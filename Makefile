pull_image:
	docker-compose pull app

buildapp:
	docker-compose build app

runapp: pull_image
	docker-compose up -d --force-recreate app