const IP_WITH_PORT_REGEX = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]+$/;
/**
 * Given configurations, returns the ip address of swim nodes to connect
 * on the local network
 * @returns {{resolve: Function}}
 */
module.exports = function({ argv }){
	const base = argv.filter(i => !!i.trim().match(IP_WITH_PORT_REGEX));

	async function resolve(){
		return base;
	}

	return {
		resolve,
	};
};