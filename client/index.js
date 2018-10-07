const url = process.argv[2] || 'http://localhost:8080';
const room = process.argv[3] || 'default';

function connect() {
	const io = require('socket.io-client')(url, { query: { room } });

	io.on('connection', function () {
		console.log('connected to the server.');
	});

	io.on('hello', function (data) {
		console.log('got hello', JSON.stringify(data));
	});

	io.on('error', function (err) {
		console.log('got an error', err);
	});

	io.on('disconnect', function(){
		console.log('got disconnected, will try re-connecting');
		io.close();
		return setTimeout(() => connect(), 5000);
	});
}

connect();
