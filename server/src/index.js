const hashring = require('swim-hashring');
const config = require('./config');
const resolvers = require('./resolvers');
const socketServerCreator = require('./socket/index');
const serverIp = require('network-address').ipv4();

async function resolveWithLocal(){
	const resolver = resolvers.local({ argv: process.argv });
	return resolver.resolve();
}

async function resolveWithDocker(){
	const resolver = resolvers.docker({
		port: config.hashring.port,
		image: config.docker.image,
		network: config.docker.network,
		me: serverIp
	});

	return resolver.resolve();
}

/**
 * Wait for given ring to successfully emit *up* before *error* event.
 * @param ring
 * @returns {Promise<*>}
 */
function waitForHashring(ring){
	return new Promise((resolve, reject) => {
		ring.on('up', resolve);
		ring.on('error', reject);
	});
}

function handleError(err){
	console.log('an error happened, closing the server', err);
	process.exit(-1);
}

async function main(){
	const resolverToUse = process.argv.length > 2 && process.argv[2].trim() === 'local' ? resolveWithLocal : resolveWithDocker;
	const base = await resolverToUse();
	const ring = hashring({
		port: config.hashring.port,
		base,
		meta: { socketServerPort: config.socket.port },
	});

	await waitForHashring(ring);
	console.log(`started ${serverIp}:${config.hashring.port} with base of \`${base.join(',')}\``);

	// start the socket server
	const { server, io } = socketServerCreator({
		me: serverIp + ':' + config.hashring.port,
		port: config.socket.port,
		ring
	});

	// wait for either the ring or the socket server to give error
	io.on('error', handleError);
	server.on('error', handleError);
	ring.on('error', handleError);
	console.log(`started socket server on ${serverIp}:${config.socket.port}`);
}

main().catch((err) => console.log('error happened when bootstrapping the server', err));
