module.exports = {
	hashring: {
		base_host: process.env.HASHRING_BASE_HOST || 'localhost',
		base_port: process.env.HASHRING_BASE_PORT || 7373,
	},
	port: process.env.PORT || 8000,
};