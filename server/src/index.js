const hashring = require('swim-hashring');
const config = require('./config');
const resolvers = require('./resolvers');
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

async function main(){
	const resolverToUse = process.argv.length > 2 && process.argv[2].trim() === 'local' ? resolveWithLocal : resolveWithDocker;
	const base = await resolverToUse();
	const ring = hashring({
		port: config.hashring.port,
		base,
	});

	const events = ['up', 'peerUp', 'peerDown', 'move', 'steal', 'error'];
	events.forEach(event => {
		ring.on(event, () => console.log(event, 'happened'));
	});

	console.log(`started ${serverIp}:${config.hashring.port} with base of \`${base.join(',')}\``);
}

main().catch((err) => console.log('error happened when bootstrapping the server', err));
