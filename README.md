# consistent-hashing-websocket-server
A socket.io server cluster using consistent hashing. A users socket connection request is mapped to a socket server that runs in the cluster, according to the query parameters of the socket connect request.

A use-case for this example is a game server, that separates users to socket servers according to the id of the game room instance.
*swim-hashring* and *firebird* is used for creating a socket.io cluster and proxying requests. The server and proxy instances are containerized using docker, and hashring peers find eachother by querying docker containers that have the same image as them.

## Running the example
- Go to the root of the project and run `docker-compose up` this should start a single socket server and a proxy that points to this instance
- cd into [client](./client) folder, and setup the client using `npm install`
- at the root of the project start a client by running `node client/index.js http://localhost:8080 room_id` where room_id can be any string you want.
- watch and see which server the client is connected to
- scale the socket server cluster by running `docker-compose scale server=3` where 3 can be any number you want.
- the client may change server if the room_id you gave it to is assigned to another socket server in the cluster
- play around by starting new clients, and scaling the server count. you will observe the sockets that has the same room_id will always connect the same socket server.
