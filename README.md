# Clear-mind API

# Clear-mind Server

## Introduction

- Welcome to Clear-Mind.

- Explore your feelings and thoughts with daily journals and personal data tracking.

- This digital journaling application allows users to keep track of daily tasks, record inner thoughts, encourage mindful acts, and track sleep and emotional patterns.

- Upon submitting a journal entry, the user's dashboard will update to display emotion and sleep data, allowing the user to see a visual representation of their progress over time.

- The user can use the calendar on the mindfulness center page to navigate to a specific day's journal and update entries to their liking.

## heroku link:

https://obscure-castle-68689.herokuapp.com/

## link to live app:

https://clear-mind.now.sh/

## link to server repo:

https://github.com/thinkful-ei-macaw/clear-awareness-api

## link to client repo:

https://github.com/thinkful-ei-macaw/clear-awareness-client

## Team members: [Desmond Wareham](https://github.com/desmondwa), [Brannen Petit](https://github.com/bpetit940), [James Moua](), [Javori Smart](https://github.com/javi-err), [Vendy Prum](https://github.com/iampruven)

### Tech-Stack:

### Client:

- ReactJS
- HTML
- JavaScript
- CSS
- Vercel

### Server:

- ReactJs
- NodeJs
- Express
- Knex
- PostgreSQL
- Heroku

## Screenshots

## API Docs:

- POST

  - REQUEST: /api/auth/token
  - allows users to login and get authorization token
  - `RESPONSE: 200 OK { authToken: returns authToken }`

- PUT

  - REQUEST: /api/auth/
  - Updates the user's auth token, this is a refreshing situation
  - RESPONSE: 200 OK {
    authToken: returns authToken
    }

- POST

  - REQUEST: /api/users/
  - Allows users to sign up on the app
  - RESPONSE: 201 OK {
    "id": 4,
    "name": "bran",
    "username": "testing2"
    }

- GET

  - REQUEST: /api/journal/
  - retrieves the user's journals from the last 7 days
  - RESPONSE: 200 [
    {"id": 1,
    "entry": "Sample entry",
    "tasks": [
    "task1", "task2, "task3"
    ],
    "mindful": "sample mindful act",
    "sleep_hours": 8,
    "emotions": 1,
    "date_created": "2020-06-04},
    {"id": 1,
    "entry": "Sample entry",
    "tasks": [
    "task1", "task2, "task3"
    ],
    "mindful": "sample mindful act 2",
    "sleep_hours": 8,
    "emotions": 1,
    "date_created": "2020-06-05}
    ]

- GET

  - REQUEST: /api/journal/:journalDate

  - retrieves the specific day that the user is requesting to view
  - RESPONSE: 200
    {"id": 1,
    "entry": "Sample entry",
    "tasks": [
    "task1", "task2, "task3"
    ],
    "mindful": "sample mindful act",
    "sleep_hours": 8,
    "emotions": 1,
    "date_created": "2020-06-04
    }

- POST

  - REQUEST: /api/journal

  - inserts users journal at the current date to the database
  - RESPONSE: 200
    [ 1 ]

- PATCH

  - REQUEST: /api/journal/:journalDate

  - updates journal for the specified day by the user

  - RESPONSE: 204

- DELETE

  - REQUEST: /api/journal/:journalDate

  - deletes a journal entry based on the specified date by the user
  - Response: 204

- GET
  - REQUEST: /api/quotes
  - returns list of all quotes within the backend store
  - RESPONSE: [
    {
    id: uuid(),
    quotation:
    "Anxiety arises from not being able to see the whole picture. If you feel anxious, but are not sure why, try putting your things in order.",
    author: "Marie Kondo",
    },
    {
    id: uuid(),
    quotation: "It takes as much energy to wish as it does to plan.",
    author: "Eleanor Roosevelt",
    },
    {
    id: uuid(),
    quotation:
    "Entrepreneurs are simply those who understand that there is little difference between obstacle and opportunity and are able to turn both to their advantage.",
    author: "Niccolo Machiavelli",
    }]

### Summary

- This application allows users to view their current emotion and sleep patterns
- This application allows users to view the current calendar month and submit journals for specific days
- This application allows users to edit or delete a journal for a specific day
- This application allows user to view mindfulness quotes above their calendar

### Local Dev Setup

If using user `dunder-mifflin`;

```
mv .env.test .env
createdb -U dunder-mifflin clear-mind
createdb -U dunder-mifflin clear-mind-test
```

If your `dunder-mifflin` user has a password, be sure to set it in `.env` for all appropriate fields. Or if using a different user, update appropriately.

```
npm install
npm run migrate
```

Refer to `.env.test`

### client installation setup

- npm i
- npm i react-router-dom
- npm i date-fns
- npm i recharts
- npm i calendar

```

```

```

```
