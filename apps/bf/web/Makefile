# Variables - BRAND and ENVIRONMENT must be provided or set by target
PROJECT_ROOT = $(CURDIR)/../../..
CONFIG_LOADER = $(PROJECT_ROOT)/tools/docker/gen-doc.js
DOCKER_BUILDKIT ?= 1
COMPOSE_DOCKER_CLI_BUILD ?= 1
REVERSE_PROXY_DIR = apps/bf/reverse-proxy

# Generated .env file location (requires BRAND and ENVIRONMENT)
ENV_FILE = $(CURDIR)/Docker/dev_mode/.env.$(BRAND).$(ENVIRONMENT)
CONFIG_FILE = $(CURDIR)/config/$(BRAND)/env-files/$(ENVIRONMENT).json

# Import variables from generated .env file (if exists)
# This makes ENV, COMPOSE_PROJECT_NAME, BRAND, etc. available from the JSON config
-include $(ENV_FILE)

# Export key variables
export DOCKER_BUILDKIT COMPOSE_DOCKER_CLI_BUILD PROJECT_ROOT BRAND ENV REVERSE_PROXY_DIR
# Paths
DOCKER_DIR = Docker/dev_mode

# Docker Compose command templates
COMPOSE_BUILD = cd $(DOCKER_DIR) && docker compose --env-file $(ENV_FILE)

# Compose file combinations
COMPOSE_BASE = -f docker-compose.yml
COMPOSE_DEV = $(COMPOSE_BASE) -f docker-compose.local.yml
COMPOSE_DEV_NXT = $(COMPOSE_BASE) -f docker-compose.local.yml -f docker-compose.local.nxt.yml
COMPOSE_QA = $(COMPOSE_BASE) -f docker-compose.qa.yml
COMPOSE_NXT = $(COMPOSE_BASE) -f docker-compose.nxt.yml
COMPOSE_QACMS = $(COMPOSE_BASE) -f docker-compose.qacms.yml
COMPOSE_ALL = $(COMPOSE_BASE) -f docker-compose.local.yml -f docker-compose.qa.yml -f docker-compose.nxt.yml -f docker-compose.qacms.yml

# BFF Image
WEBSERVER_IMAGE = docker.app.betfair/ppb/tbd/bff/http-webserver:latest

.PHONY: build build-dev build-nxt build-qacms start-dev start-dev-nxt start-qa start-nxt start-qacms stop
.PHONY: load_config set-env-files set-brand_files

# Load configuration from JSON and generate .env file
load_config:
	@node $(CONFIG_LOADER) $(CONFIG_FILE) $(ENV_FILE)

# Generate FE env files -> environment.json && environment-backend.json
# Uses ENVIRONMENT parameter (e.g., ENVIRONMENT=qa)
set-env-files: load_config
	@echo "Generating environment files for BRAND=$(BRAND) ENVIRONMENT=$(ENVIRONMENT)"
	@sh $(PROJECT_ROOT)/tools/generate-env-files.sh --brand $(BRAND) --env $(ENVIRONMENT)

set-brand-files: load_config
	@echo "Generating brand files for BRAND=$(BRAND)"
	@sh $(PROJECT_ROOT)/tools/prepare-brand.sh --brand $(BRAND)

# Build targets
build: load_config set-env-files set-brand-files
	@echo "Building Docker images for BRAND=$(BRAND) ENVIRONMENT=$(ENVIRONMENT)"
	@$(COMPOSE_BUILD) $(COMPOSE_QA) build

build-dev: load_config set-env-files set-brand-files
	@echo "Building Docker images for BRAND=$(BRAND) ENVIRONMENT=$(ENVIRONMENT)"
	@$(COMPOSE_BUILD) $(COMPOSE_DEV) build

build-nxt: load_config set-env-files set-brand-files
	@echo "Building Docker images for BRAND=$(BRAND) ENVIRONMENT=$(ENVIRONMENT)"
	@$(COMPOSE_BUILD) $(COMPOSE_NXT) build

build-qacms: load_config set-env-files set-brand-files
	@echo "Building Docker images for BRAND=$(BRAND) ENVIRONMENT=$(ENVIRONMENT)"
	@$(COMPOSE_BUILD) $(COMPOSE_QACMS) build

	

# Start targets
start-dev: load_config
	@echo "Starting dev environment for BRAND=$(BRAND)"
	@$(COMPOSE_BUILD) $(COMPOSE_DEV) build reverseproxy
	@$(COMPOSE_BUILD) $(COMPOSE_DEV) up --remove-orphans

start-qa: load_config
	@echo "Starting QA environment for BRAND=$(BRAND)"
	@docker pull $(WEBSERVER_IMAGE)
	@$(COMPOSE_BUILD) $(COMPOSE_QA) build reverseproxy
	@$(COMPOSE_BUILD) $(COMPOSE_QA) up --remove-orphans

start-nxt: load_config
	@echo "Starting NXT environment for BRAND=$(BRAND)"
	@docker pull $(WEBSERVER_IMAGE)
	@$(COMPOSE_BUILD) $(COMPOSE_NXT) build reverseproxy
	@$(COMPOSE_BUILD) $(COMPOSE_NXT) up --remove-orphans

start-qacms: load_config
	@echo "Starting QACMS environment for BRAND=$(BRAND)"
	@docker pull $(WEBSERVER_IMAGE)
	@$(COMPOSE_BUILD) $(COMPOSE_QACMS) build reverseproxy
	@$(COMPOSE_BUILD) $(COMPOSE_QACMS) up --remove-orphans


start-dev-nxt: load_config set-env-files
	@echo "Starting dev environment with NXT backend for BRAND=$(BRAND)"
	@$(COMPOSE_BUILD) $(COMPOSE_DEV_NXT) build reverseproxy
	@$(COMPOSE_BUILD) $(COMPOSE_DEV_NXT) up --remove-orphans

# Stop and clean
stop:
	@echo "Stopping Docker containers"
	@cd $(DOCKER_DIR) && docker compose $(COMPOSE_ALL) down

