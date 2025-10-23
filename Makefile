NAME=ft_transcendence
DOCKER_COMPOSE = docker-compose -f src/docker-compose.yml

.PHONY: clean containers

up:
	@echo "Starting $(NAME)..."
	@$(DOCKER_COMPOSE) up -d --build

down:
	@echo "Stopping $(NAME)..."
	@$(DOCKER_COMPOSE) down --remove-orphans

build:
	@echo "Building $(NAME)..."
	@$(DOCKER_COMPOSE) build

logs:
	@echo "Showing logs for $(NAME)... (Ctrl+C to exit)"
	@$(DOCKER_COMPOSE) logs -f

clean_containers:
	@echo "Removing all containers..."
	@docker rm -vf $$(docker ps -aq) 2>/dev/null || true

clean_images:
	@echo "Removing all images..."
	@docker rmi -f $$(docker images -aq) 2>/dev/null || true

containers: clean_containers clean_images

clean: down containers
	@echo "Cleanup complete."
