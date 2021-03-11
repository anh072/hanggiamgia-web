
SERVICE_NAME = giare
ENV ?= test
AWS_ROLE ?= arn:aws:iam::838080186947:role/deploy-role
APP_REGION = us-east-1

COMPOSE_RUN_AWS = docker-compose run --rm aws
COMPOSE_RUN_LINT = docker-compose run --rm lint
COMPOSE_RUN_NPM = docker-compose run --rm npm

SSL_CERT_ARN ?= arn:aws:acm:us-east-1:838080186947:certificate/17f91a87-af18-4c7d-ad93-d89a3c601671
LAMBDA_ARTIFACT = bin/lambda.zip
S3_BUCKET ?= giare-test-frontend

lint: dotenv
	$(COMPOSE_RUN_LINT) yamllint cloudformation/template.yaml
.PHONY: lint

validate: dotenv
	$(COMPOSE_RUN_AWS) make _validate
.PHONY: validate

build: dotenv
	make _build
.PHONY: build

deploy: dotenv
	$(COMPOSE_RUN_AWS) make _deploy
.PHONY: deploy

# replaces .env with DOTENV if the variable is specified
dotenv:
ifdef DOTENV
	cp -f $(DOTENV) .env
else
	$(MAKE) .env
endif

# creates .env with .env.template if it doesn't exist already
.env:
	cp -f .env.template .env

_validate: _assumeRole
	aws --region $(APP_REGION) cloudformation validate-template --template-body file://cloudformation/template.yaml; \

_build:
	npm run sitemap
	npm run build-all
	mkdir -p bin
	cp -r build lambda-build
	cd lambda-build && zip -r ../$(LAMBDA_ARTIFACT) .

_package: _assumeRole
	aws cloudformation package --template-file cloudformation/template.yaml \
		--s3-bucket "$(SERVICE_NAME)-$(ENV)-sam-deployments" \
		--output-template-file packaged.yaml

_deploy: _assumeRole _package
	aws s3 cp ./build s3://$(S3_BUCKET) --recursive
	aws --region $(APP_REGION) cloudformation deploy \
		--template-file ./packaged.yaml \
		--stack-name "$(SERVICE_NAME)-$(ENV)-frontend" \
		--capabilities CAPABILITY_NAMED_IAM \
		--no-fail-on-empty-changeset \
		--parameter-overrides SSLCertificateArn=$(SSL_CERT_ARN) 

_assumeRole:
ifndef AWS_SESSION_TOKEN
	$(eval ROLE = "$(shell aws sts assume-role --role-arn "$(AWS_ROLE)" --role-session-name "deploy-assume-role" --query "Credentials.[AccessKeyId, SecretAccessKey, SessionToken]" --output text)")
	$(eval export AWS_ACCESS_KEY_ID = $(shell echo $(ROLE) | cut -f1))
	$(eval export AWS_SECRET_ACCESS_KEY = $(shell echo $(ROLE) | cut -f2))
	$(eval export AWS_SESSION_TOKEN = $(shell echo $(ROLE) | cut -f3))
endif
