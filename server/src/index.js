const hashring = require('swim-hashring');
const ipv4 = require('network-address').ipv4;
const port = parseInt(process.argv[2]);
const serverIp = process.argv[3];
const ring = hashring(Object.assign({ port }, serverIp ? { base: [ serverIp ] } : {}));

const localIp = ipv4();
console.log('my local ip is', localIp);

const events = ['up', 'peerUp', 'peerDown', 'move', 'steal', 'error'];
events.forEach(event => {
	ring.on(event, (data) => console.log(event, 'happened with data', JSON.stringify(data)));
});

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function randomId(){
	return [...new Array(6)].map(_ => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
}

setInterval(function(){
	console.log('interval called');
	const key = randomId();
	console.log('key', key);
	const peersResult = ring.peers();
	const lookupResult = ring.lookup(key);
	const isAllocatedToMe = ring.allocatedToMe(key);

	console.log('isAllocatedToMe', isAllocatedToMe);
	console.log('lookup', JSON.stringify(lookupResult));
	console.log('peers', JSON.stringify(peersResult));
	console.log('--------');
}, 15000);
