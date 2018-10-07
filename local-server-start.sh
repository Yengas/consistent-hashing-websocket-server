#!/bin/bash
# when this script is terminated, kill the child processes we spawned
trap "kill 0" EXIT

# get the local ip that the server will listen on
LOCAL_IP=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1')
START_PORT=7373
START=1
# how many servers to start
SCALE=${1:-2}

for i in $(seq 1 $SCALE); do
  # no base for the first server to be started
  if [ $i -eq 1 ]; then
    BASE=""
  else
    BASE="$LOCAL_IP:$START_PORT"
  fi

  # start the server with local base resolver and the first server as base
  HASHRING_PORT=$(($START_PORT + $i - 1)) node server/bin/index "local" "$BASE"&

  # wait 1 second before starting the other server
  sleep 1
done

# wait for the child processes to end
wait
