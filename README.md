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

5. Building the docker image for the backend game
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

# Project Structure

This document outlines the organization of files and directories within the application.

## Contents

- `__tests__/`: This directory houses the application's test files, ensuring thorough testing and quality assurance.

- `api/`: This directory encompasses files and modules pertaining to the application's API functionalities.

  - `entity_module/`: This subdirectory encapsulates the structure for each entity within the application.

    - `entity.controller`: This file manages the control logic for the entity, handling incoming requests and coordinating with other components.
    
    - `entity.router`: This file defines the routes and endpoints associated with the entity, facilitating communication between the client and server.
    
    - `entity.sanitization`: This file implements data sanitization techniques to ensure data integrity and security within the entity.
    
    - `entity.service`: This file houses the business logic and operations related to the entity, abstracting away data manipulation from the controller.

- `config/`: This directory contains the application's configuration files, including settings for database connections, environment variables, and other parameters.

- `database/`: This directory encompasses all components related to the application's database management.

  - `migrations/`: This directory hosts scripts for managing database schema changes and version control, ensuring smooth transitions between database states.

  - `models/`: This directory holds definitions for database models, representing the structure and relationships between data entities within the application.

  - `seeders/`: This directory contains initial data seeding files, populating the database with predefined data for development or testing purposes.

- `errors/`: This directory houses class files responsible for error handling within the application, providing structured and consistent methods for managing and responding to errors.

- `middleware/`: This directory contains separate middleware components utilized within the application, facilitating modularization and encapsulation of request processing logic.

- `utils/`: This directory contains reusable utility classes and functions utilized across the application, promoting code reusability and maintainability.

- `www/app.js`: This directory contains the main server file for the application, responsible for bootstrapping the Node.js server and initializing the application's components and middleware.

## Usage

Once the containers are started, you can access the api game application at the following address: `http://localhost:3000`

## License

All rights reserved. You must obtain permission before using this project.
