buildapp:
	docker-compose build app

runapp: buildapp
	docker-compose up -d --force-recreate app