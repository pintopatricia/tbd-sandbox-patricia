build:
	sh ../../tools/generate-env-files.sh --brand BF --env QA
	docker build --build-arg GITHUB_TOKEN=${GITHUB_TOKEN} --build-arg MONTEROSA_TOKEN=${MONTEROSA_TOKEN} --build-arg BRAND=bf --build-arg ENVIRONMENT=qa -f ./dev.Dockerfile -t ppb/tbd/bff/http-webserver ../..

run-bf:
	docker run \
		--user="node" \
		-v $(PWD)/config/certificates/:/etc/bf-fabric/certificates \
		-v $(PWD)/config/webserver-config-http-bf-qa.json:/etc/bf-fabric/config-http.json \
		-v $(PWD)/.yalc/:/fabric/deploy/tbd-http-webserver/.yalc \
		-p 8081:8081 \
		ppb/tbd/bff/http-webserver

run-sbg:
	docker run \
		--user="node" \
		-v $(PWD)/config/certificates/:/etc/bf-fabric/certificates \
		-v $(PWD)/config/webserver-config-http-sbg-qa.json:/etc/bf-fabric/config-http.json \
		-v $(PWD)/.yalc/:/fabric/deploy/tbd-http-webserver/.yalc \
		-p 8081:8081 \
		ppb/tbd/bff/http-webserver

debug-bf:
	docker run \
		--user="node" \
		-v "$(PWD)/lib:/fabric/deploy/tbd-http-webserver/lib" \
		-v $(PWD)/config/certificates/:/etc/bf-fabric/certificates \
		-v $(PWD)/config/webserver-config-http-bf-qa.json:/etc/bf-fabric/config-http.json \
		-v "$(PWD)/.yalc/:/fabric/deploy/tbd-http-webserver/.yalc" \
		-it \
		--init \
		--name http-webserver \
		-p 8081:8081 \
		-p 9229:9229 \
		ppb/tbd/bff/http-webserver \
		nodemon --inspect=0.0.0.0 -e ts,js --signal SIGINT --watch ./deploy/tbd-http-webserver/lib/ --watch ./deploy/tbd-http-webserver/.yalc --exec "sh deploy/tbd-http-webserver/rebuild.sh && node" bin/fabric.js run /etc/bf-fabric/config-http.json

debug-sbg:
	docker run \
		--user="node" \
		-v "$(PWD)/lib:/fabric/deploy/tbd-http-webserver/lib" \
		-v $(PWD)/config/certificates/:/etc/bf-fabric/certificates \
		-v $(PWD)/config/webserver-config-http-sbg-qa.json:/etc/bf-fabric/config-http.json \
		-v "$(PWD)/.yalc/:/fabric/deploy/tbd-http-webserver/.yalc" \
		-it \
		--init \
		--name http-webserver \
		-p 8081:8081 \
		-p 9229:9229 \
		ppb/tbd/bff/http-webserver \
		nodemon --inspect=0.0.0.0 -e ts,js --signal SIGINT --watch ./deploy/tbd-http-webserver/lib/ --watch ./deploy/tbd-http-webserver/.yalc --exec "sh deploy/tbd-http-webserver/rebuild.sh && node" bin/fabric.js run /etc/bf-fabric/config-http.json

build-dev-regression:
	make build
	docker-compose -f ./Docker/tests/docker-compose.yml -f ./Docker/tests/dev_mode/dev.docker-compose.yml -p tbd-http-webserver-regression up --remove-orphans --build mockServer http-webserver-proxy-dev

build-ci-regression:
	make build
	docker-compose -f ./Docker/tests/docker-compose.yml -f ./Docker/tests/prod_mode/prod.docker-compose.yml -p tbd-http-webserver-regression up --remove-orphans --exit-code-from testexecutor --build mockServer http-webserver-proxy testexecutor

publish:
	docker tag ppb/tbd/bff/http-webserver docker.app.betfair/ppb/tbd/bff/http-webserver:${BUILD_NUMBER}
	docker tag ppb/tbd/bff/http-webserver docker.app.betfair/ppb/tbd/bff/http-webserver:latest
	docker push docker.app.betfair/ppb/tbd/bff/http-webserver:latest
	docker push docker.app.betfair/ppb/tbd/bff/http-webserver:${BUILD_NUMBER}
