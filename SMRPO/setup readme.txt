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

docker cp ./projects.json smrpo-mongo-db:/projects.json
docker exec -it smrpo-mongo-db mongoimport --db SMRPO --collection Projects --mode upsert --upsertFields make --jsonArray --file projects.json
docker exec -it smrpo-mongo-db rm -rf projects.json

docker cp ./sprints.json smrpo-mongo-db:/sprints.json
docker exec -it smrpo-mongo-db mongoimport --db SMRPO --collection Sprints --mode upsert --upsertFields make --jsonArray --file sprints.json
docker exec -it smrpo-mongo-db rm -rf sprints.json

// Start API
cd ./SMRPO
nodemon server.js

// Start APP
cd ./SMRPO/src/app/ 
ng serve --open 

// Bonus - prevent projects  with same names
docker exec -it smrpo-mongo-db mongosh
use SMRPO
db.Projects.getIndexes()
db.Projects.createIndex({ name: 1 }, { unique: true, name: 'name' })