#############################
# middleware
#############################
.PHONY: middleware.up
middleware.up:
	@docker compose --profile service up -d

.PHONY: middleware.down
middleware.down:
	@docker compose --profile service down

.PHONY: middleware.restart
middleware.restart: middleware.down middleware.up 

.PHONY: middleware.psql
middleware.psql:
	PGPASSWORD=pgpass psql -h postgres.sampleapp.local -p 5432 -U sampleapp -d sampleapp

.PHONY: middleware.npm.install
middleware.npm.install:
	@docker compose --profile adhoc run --rm sampleapp-node npm install

#############################
# migration
#############################
.PHONY: migrate.diff.local
migrate.diff.local:
	@atlas schema diff \
		--from "postgres://sampleapp:pgpass@localhost:5432/sampleapp?sslmode=disable" \
		--to "file://schema.sql" \
		--dev-url docker://postgres/15/dev

.PHONY: migrate.apply.local
migrate.apply.local:
	@atlas schema apply \
		--url "postgres://sampleapp:pgpass@localhost:5432/sampleapp?sslmode=disable" \
		--to "file://schema.sql" \
		--dev-url docker://postgres/15/dev

.PHONY: migrate.seed.local
migrate.seed.local:
	PGPASSWORD=pgpass psql -h localhost -p 5432 -U sampleapp -d sampleapp -f seed.sql
