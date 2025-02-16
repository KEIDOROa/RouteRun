DOCKER_COMPOSE=docker-compose

CONTAINER_NAME=app


.PHONY: up
up:
	$(DOCKER_COMPOSE) up --build

.PHONY: down
down:
	$(DOCKER_COMPOSE) down

.PHONY: build
build:
	$(DOCKER_COMPOSE) run $(CONTAINER_NAME) npm run build

.PHONY: lint
lint:
	$(DOCKER_COMPOSE) run $(CONTAINER_NAME) npm run lint
