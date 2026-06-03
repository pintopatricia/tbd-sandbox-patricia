set_env_files:
	@sh ../../../tools/generate-env-files.sh --brand SBG --env $(env)

build:
	@COMPOSE_DOCKER_CLI_BUILD=1 docker-compose -f Docker/dev_mode/docker-compose.yml build

start:
	@make set_env_files
	@COMPOSE_DOCKER_CLI_BUILD=1 docker-compose -f Docker/dev_mode/docker-compose.yml build reverseproxy && docker-compose -f Docker/dev_mode/docker-compose.yml up --remove-orphans

start-nxt:
	@make set_env_files env=NXT
	@COMPOSE_DOCKER_CLI_BUILD=1 docker-compose -f Docker/dev_mode/docker-compose.yml -f Docker/dev_mode/docker-compose.nxt.yml build reverseproxy && docker-compose -f Docker/dev_mode/docker-compose.yml -f Docker/dev_mode/docker-compose.nxt.yml up --remove-orphans

stop:
	@docker-compose -f Docker/dev_mode/docker-compose.yml -f Docker/dev_mode/docker-compose.nxt.yml down
