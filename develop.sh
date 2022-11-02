#!/bin/bash

#Run migrations to ensure the database is updated
npm run migrations

#seed data
npm run seed

#Start development environment
npm run develop
