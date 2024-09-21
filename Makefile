
SHELL = /bin/bash
.SHELLFLAGS = -o pipefail -c

DOCKER_IMAGE_TAG = ghcr.io/burningtree/atcourse

.PHONY: help
help: ## Print info about all commands
	@echo "Helper commands:"
	@echo
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "    \033[01;32m%-20s\033[0m %s\n", $$1, $$2}'
	@echo

.PHONY: build
docker: ## Build docker image
	docker build -t $(DOCKER_IMAGE_TAG):latest .

.PHONY: docker-push-latest
docker-push-latest: ## Push latest docker image
	docker push $(DOCKER_IMAGE_TAG):latest