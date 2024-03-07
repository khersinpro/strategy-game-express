# strategy-game-express

# Create docker network for join database to project
docker network create --driver=bridge --attachable mysql-database

# Create dockerfile for mysql database and add it to the mysql-database network
The mysql database container should be named : db

# Create the docker image file for the backend game
docker build -t strategy-game .

# Launch the docker compose
docker-compose up

# Show all container
docker ps


