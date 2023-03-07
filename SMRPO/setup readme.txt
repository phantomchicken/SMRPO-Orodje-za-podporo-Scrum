// Docker start
cd ./SMRPO
docker-compose up mongo-db --no-start
docker exec -it smrpo-mongo-db mongosh
use SMRPO
db.Users.deleteMany({})
//docker exec -it smrpo-mongo-db bash -c "mongo SMRPO --eval 'db.Users.deleteMany({})'"

// Add sample data
cd ./SMRPO
docker cp ./users.json smrpo-mongo-db:/users.json
docker exec -it smrpo-mongo-db mongoimport --db SMRPO --collection Users --mode upsert --upsertFields make --jsonArray --file users.json
docker exec -it smrpo-mongo-db rm -rf users.json

// Start API
cd ./SMRPO
nodemon server.js

// Start APP
cd ./SMRPO/src/app/ 
ng serve --open 