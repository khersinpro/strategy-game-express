#!/bin/bash

# Exécutez la commande npx sequelize-cli db:drop
npx sequelize-cli db:drop

# Exécutez la commande npx sequelize-cli db:create
npx sequelize-cli db:create

# Exécutez la commande npx sequelize-cli db:migrate
npx sequelize-cli db:migrate

# Exécutez la commande npx sequelize-cli db:seed:all
npx sequelize-cli db:seed:all