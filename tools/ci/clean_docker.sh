#removes all the docker containers this script could potentially make
docker_containers=("visual-test-ci*" "mockServer" "http-webserver-proxy-dev" "http-webserver-proxy" "testexecutor")

for container in ${docker_containers[@]};
do
    docker ps -a -q --filter name=$container | xargs -r docker rm -f
done