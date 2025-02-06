# Setup
#### Initialize the database
```bash
cd SMRPO
docker-compose up mongo-db
```

#### Insert placeholder data into database

Executing these commands will copy sample users, projects, sprints, tasks and comments into the app. User admin has the password admin, users nino, marko, bojan and miha follow in similar suit.

```bash
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

```

#### Start the API

Routes:
- http://localhost:3000/api/db
- http://localhost:3000/api/db/projects
- http://localhost:3000/api/db/sprints
- http://localhost:3000/api/db/tasks
- http://localhost:3000/api/db/workLogs

```bash
cd SMRPO
npm install
nodemon server.js
```

#### Start the app
```
cd ./SMRPO/src/app/ 
ng serve --open
```


