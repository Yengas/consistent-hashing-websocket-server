module.exports = {
	hashring: {
		port: process.env.HASHRING_PORT || 7373,
	},
	docker: {
		image: process.env.DOCKER_IMAGE_NAME || 'consistent-hashing-websocket-server_server',
		network: process.env.DOCKER_HASHRING_NETWORK_NAME || 'consistent-hashing-websocket-server_hashring-network'
	},
	socket: {
		port: process.env.SOCKET_PORT || 8080,
	},
};