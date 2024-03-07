# Strategy Game Express

## Prerequisites
Make sure you have Docker installed on your machine.

## Setting up Docker Network
Before launching the project, you need to create a Docker network to connect the database to the project. 

`docker network create --driver=bridge --attachable mysql-database`

## Create the mysql database image and join it to the network
Ensure that the MySQL database container is named: `db` and connected to the network.

## Building the Docker Image for the Backend Game
To create the Docker image for the backend game, use the following command:

`docker build -t strategy-game .`

## Launching the Docker Compose
To initiate the Docker Compose and launch the project, execute the following command:

`docker-compose up`

## Listing All Containers
To display information about all running containers, use the following command:

`docker ps`

## Generating Database with Seeders
To generate the database using seeders, execute the following command:

`./script-db.sh`

## Running Unit Tests
To execute the unit tests, run the following command:

`npm run tests`

