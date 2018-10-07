# consistent-hashing-websocket-server
A socket.io server cluster using consistent hashing. A users socket connection request is mapped to a socket server that runs in the cluster, according to the query parameters of the socket connect request.

A use-case for this example is a game server, that separates users to socket servers according to the id of the game instance.
*swim-hashring* and 
