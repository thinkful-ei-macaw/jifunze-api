# Jifunze API
Server application for the [Jifunze app](https://github.com/thinkful-ei-macaw/jifunze) (spaced repetition capstone) by [James Moua](https://github.com/HueHealer) and [Malcolm Kiano](https://github.com/malcolmkiano)

## Tables of contents
* [General Info](#general-info)
* [Technologies](#technologies)
* [Local dev setup](#local-dev-setup)
* [Configuring Postgres](#configuring-postgres)
* [Scripts](#scripts)
* [Endpoints](#endpoints)

## General info
This project is the server application for the Jifunze app. It consists of a database, a test database, 3 tables, 3 routers, and 6 endpoints

## Technologies
Project is created with:
* Express
* PSQL
* Knex
* Authentication e.g. BcryptJS
* Middleware e.g. Morgan
* JavaScript
* NodeJS

Project is tested with:
* Postgrator-cli@3.2.0
* Mocha
* Chai
* Supertest
* Nodemon

## Local dev setup
If using user ```dunder-mifflin```:
```
mv example.env .env
createdb -U dunder-mifflin spaced-repetition
createdb -U dunder-mifflin spaced-repetition-test
```
If your ```dunder-mifflin``` user has a password be sure to set it in ```.env``` for all appropriate fields. Or if using a different user, update appropriately.

```
npm install
npm run migrate
env TEST_DATABASE_=spaced-repetition-test npm run migrate
```
And ```npm test``` should work at this point
## Configuring Postgres
For tests involving time to run properly, configure your Postgres database to run in the UTC timezone.
1. Locate the ```postgresql.conf``` file for your Postgres installation.
   - E.g. for an OS X, Homebrew install: ```/usr/local/var/postgres/postgresql.conf```
   - E.g. on Windows, maybe: ```C:\Program Files\PostgreSQL\11.2\data\postgresql.conf```
   - E.g on Ubuntu 18.04 probably: ```'/etc/postgresql/10/main/postgresql.conf'```
  
2. Find the timezone line and set it to UTC:
```
# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default'     # Select the set of available time zone
```
## Scripts
Start the application ```npm start```

Start nodemon for the application ```npm run dev```

Run the tests mode ```npm test```

Run the migrations up ```npm run migrate```

Run the migrations down ```npm run migrate -- 0```

## Endpoints
## ```POST /api/auth/token```
handles the authentication, making sure both username and password match for existing registered accounts

JSON Object requires: 
- username: string
- password: string

#### Response: ```200 OK```
   ```
 {
      "authToken": eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJuYW1lIjoiSmlmdW56ZSBBZG1pbiIsImlhdCI6MTU5MDA3NjQ0MiwiZXhwIjoxNTkwMDg3MjQyLCJzdWIiOiJhZG1pbiJ9.rwoEogsEQYkPDwOrMQTmLG9QDlZleQt7wKNB563A8K8"
}
```
## ```PUT /api/auth/token```
handles the refresh of the user's auth token

JSON Object requires: 
- valid JSON Web Token

#### Response: ```200 OK```
```
{
    "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJuYW1lIjoiSmlmdW56ZSBBZG1pbiIsImlhdCI6MTU5MDA3NzE5NywiZXhwIjoxNTkwMDg3OTk3LCJzdWIiOiJhZG1pbiJ9.KISz0KYn6DdgPL-S5zVIG_4YD90c6dFl8yGSR81tljI"
}
```

## ```GET /api/language```
gets all of the languages and words

#### Response: ```200 OK```
```
{
    "language": {
        "id": 1,
        "name": "Swahili",
        "user_id": 1,
        "head": 1,
        "total_score": 0
    },
    "words": [
        {
            "id": 1,
            "language_id": 1,
            "original": "mazoezi",
            "translation": "practice",
            "next": 2,
            "memory_value": 1,
            "correct_count": 0,
            "incorrect_count": 0
        },
     ]
}
```
## ```GET /api/language/head```
gets the current word

#### Response: ```200 OK```
```
{
    "nextWord": "mazoezi",
    "totalScore": 0,
    "wordCorrectCount": 0,
    "wordIncorrectCount": 0
}
```

## ```POST /api/language/guess```
handles whether the user guessed the current word correctly, then updates the score in the database

JSON Object requires:
- guess: string

#### Response: ```200 OK```
```
{
    "answer": "practice",
    "isCorrect": false,
    "nextWord": "jambo",
    "totalScore": 0,
    "wordCorrectCount": 0,
    "wordIncorrectCount": 0
}
```

## ```POST /api/user```
handles the registration, making sure that the user's username is not already taken when registering

JSON Object requires:
- name: string
- username: string ```must not already exist in database```
- password: string ```7 letters minimum, one uppercase, one number, and one special character```

#### Response: ```201 Created```
```
{
    "id": 2,
    "name": "geon",
    "username": "admin1"
}
```