# Todo List Sequelize + Postgres + Express Server

## Prerequisites

* NVM
* Docker

## Command line to run postgres server
 * docker-compose up -d

## Command line to migrate db (Run in the first time when created database): 
 * npx sequelize db:migrate

## Install tool to support create model reference only base on existing table in database postgres:
 * npm install -g sequelize-auto pg pg-hstore 

## Command line to create model reference only
* sequelize-auto -h localhost -d postgres -u postgres -x postgres -p 5432  --dialect postgres -o "./src/models-reference-only" -l es6 --useDefine

"After created **models-reference-only**. We can see its folder and take a time to discover **"./src/models"** in **Sequelize_Course_Master** at the link https://github.com/DavidArmendariz/sequelize-course and bring model config from **models-reference-only** to **"./src/models"** on this Todo list project.
