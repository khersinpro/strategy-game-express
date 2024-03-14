# Strategy Game Express

This repository contains an Express.js application with Docker, Docker Compose, and Sequelize for managing the database and migrations.

## Features

- **User Authentication**: Implement user authentication to allow users to create accounts and access the game securely.

- **Village Management**:
  - **Create and Manage Villages**: Enable players to create and manage their own villages on the server.
  - **Building Construction**:
    - Construct a variety of buildings, including barracks for troops, mines for resources, defensive walls, and base buildings.
    - Upgrade Buildings: Upgrade buildings to unlock new features and enhancements.
  - **Real-Time Resource Collection**: Resources are collected in real-time based on the buildings and upgrades in place.

- **Enemy Attacks and Defense**:
  - **Attack Enemies**: Engage in thrilling battles by attacking enemy villages to gain resources and expand your territory.
  - **Defend Against Attacks**: Strengthen your village's defenses to protect against enemy raids and invasions.

- **Alliance Support**: Form alliances with other players to benefit from mutual assistance, resource exchange, and collaboration in battles.

- **Strategy and Planning**: Utilize advanced gameplay tactics to manage resources effectively, train troops, and plan attacks strategically.

## License

All rights reserved. You must obtain permission before using this project.

## Prerequisites

Make sure to obtain permission before using this project.

## Installation

1. Make sure Docker is installed and running on your system.

2. Before launching the project, you need to create a Docker network to connect the database to the project. 
    ```bash
    docker network create --driver=bridge --attachable mysql-database
    ```

3. Create the mysql database image and join it to the network
    - **Ensure that the MySQL database container is named: `db` and connected to the network.**

4. Clone this repository:
    ```bash
    git clone https://github.com/khersinpro/strategy-game-express
    cd strategy-game-express
    ```

5. Building the Docker Image for the Backend Game
To create the Docker image for the backend game, use the following command:
    ```bash
    docker build -t strategy-game -f dockerfile.dev .
    ```

6. Start the containers using Docker Compose:
    ```bash
    docker-compose -f docker-compose.dev.yml up -d
    ```

7. Generate database with seeders
To generate the database using seeders, execute the following command:
    ```bash
    ./script-db.sh
    ```

8. Running unit tests
    ```bash
    npm run tests
    ```

