set_env_files:
	@sh ../../../tools/generate-env-files.sh --brand SBG --env $(env)

build:
	@COMPOSE_DOCKER_CLI_BUILD=1 docker compose -f Docker/dev_mode/docker-compose.yml -f Docker/dev_mode/docker-compose.qa.yml build

build-dev:
	@make set_env_files env=NXT
	@COMPOSE_DOCKER_CLI_BUILD=1 docker compose -f Docker/dev_mode/docker-compose.yml -f Docker/dev_mode/docker-compose.local.yml build

start-dev:
	@make set_env_files env=QA
	@COMPOSE_DOCKER_CLI_BUILD=1 docker compose -f Docker/dev_mode/docker-compose.yml -f Docker/dev_mode/docker-compose.local.yml build reverseproxy && docker compose -f Docker/dev_mode/docker-compose.yml -f Docker/dev_mode/docker-compose.local.yml up --remove-orphans

start-dev-nxt:
	@make set_env_files env=NXT
	@COMPOSE_DOCKER_CLI_BUILD=1 docker compose -f Docker/dev_mode/docker-compose.yml -f Docker/dev_mode/docker-compose.local.yml -f Docker/dev_mode/docker-compose.local.nxt.yml build reverseproxy && docker compose -f Docker/dev_mode/docker-compose.yml -f Docker/dev_mode/docker-compose.local.yml -f Docker/dev_mode/docker-compose.local.nxt.yml up --remove-orphans

start-qa:
	@make set_env_files env=QA
	@docker pull docker.app.betfair/ppb/tbd/bff/http-webserver:latest
	@COMPOSE_DOCKER_CLI_BUILD=1 docker compose -f Docker/dev_mode/docker-compose.yml -f Docker/dev_mode/docker-compose.qa.yml build reverseproxy && docker compose -f Docker/dev_mode/docker-compose.yml -f Docker/dev_mode/docker-compose.qa.yml up --remove-orphans

start-nxt:
	@make set_env_files env=NXT
	@docker pull docker.app.betfair/ppb/tbd/bff/http-webserver:latest
	@docker compose -f Docker/dev_mode/docker-compose.yml -f Docker/dev_mode/docker-compose.nxt.yml build reverseproxy && docker compose -f Docker/dev_mode/docker-compose.yml -f Docker/dev_mode/docker-compose.nxt.yml up --remove-orphans

stop:
	@docker compose -f Docker/dev_mode/docker-compose.yml -f Docker/dev_mode/docker-compose.qa.yml -f Docker/dev_mode/docker-compose.local.yml down
