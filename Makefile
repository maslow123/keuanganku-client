buildapp:
	docker-compose build app

runapp:
	docker-compose up -d --force-recreate app