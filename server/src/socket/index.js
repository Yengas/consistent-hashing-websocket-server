const http = require('http');
const sio = require('socket.io');

function getRoute(socket) {
	return socket.handshake.query.room || 'default';
}

module.exports = function({ me, port, ring }){
	const server = http.createServer();
	const io = sio(server);

	function ping(socket){
		socket.emit('hello', { server: me, date: Date.now() });
	}

	function handleConnection(socket){
		const route = getRoute(socket);

		if(!ring.allocatedToMe(route)){
			console.log(`socket with id of '${socket.id}' tried to connect with '${route}' which does not belong to me`);
			return socket.disconnect();
		}

		console.log(`got new socket connection with socket id of '${socket.id}'`);
		socket.route = route;
		ping(socket);
		const intervalHandle = setInterval(() => ping(socket), 1000);
		socket.on('disconnect', () => clearInterval(intervalHandle));
	}

	function handleSocketMove(){
		const sockets = Object.keys(io.sockets.sockets);

		sockets.forEach((socketId) => {
			const socket = io.sockets.sockets[socketId];
			if(!ring.allocatedToMe(socket.route)){
				console.log(`removing socket with id of '${socket.id}' because of ring move`);
				return socket.disconnect();
			}

			console.log(`keeping socket with id of '${socket.id}'`);
		});
	}

	io.on('connection', handleConnection);
	ring.on('move', handleSocketMove);

	server.listen(port);
	return {
		server,
		io,
	};
};