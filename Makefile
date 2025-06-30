start: ## Execute project on local environment
	@echo "🏃 Running project..."
	@bun run dev

build: ## Build project
	@echo "🔨 Building project..."
	@bun run build

lint: ## Lint project
	@echo "🔍 Linting project..."
	@bun run lint

preview: ## Preview project
	@echo "👀 Previewing project..."
	@bun run preview

test: ## Run tests
	@echo "🧪 Running tests..."
	@bun run test