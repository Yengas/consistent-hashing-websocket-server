const redbird = require('redbird');
const hashring = require('swim-hashring');
const querystring = require('querystring');
const config = require('./config');

function getRoute(url){
	const idx = url.indexOf('?');
	if(idx === -1) return null;
	const { room } = querystring.parse(url.substring(idx + 1));
	return room;
}

function getSocketServerURL({ id, meta: { socketServerPort } }, url){
	const idx = id.indexOf(':');
	const base = idx !== -1 ? id.substring(0, idx) : id;
	return 'http://' + base + ':' + socketServerPort + url;
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

async function main(){
	const ring = hashring({ base: [config.hashring.base], client: true });
	await waitForHashring(ring);

	function resolver(host, url, req){
		const route = getRoute(url);
		if(!route) return null;
		const lookup = ring.lookup(route);
		return getSocketServerURL(lookup, url);
	}

	const proxy = redbird({
		port: config.port,
		resolvers: [
			resolver
		]
	});
	console.log(`started redbird proxy on ${config.port}`);
}

main().catch((err) => console.log('an error happened when bootstrapping the proxy', err));
