# DevCamper API

> Backend API for Managing users, authentication, bootcamps, courses and reviews

Check [Specifications](https://github.com/black-turtle/DevCamper/tree/master/devcamper_specs.md) for more information

## Test in local

- copy "config/production.env" file contents into "config/config.env". You must provide the missing environment variables (eg: MONGO_URI for mongoDB connection).
- run `npm install` to install dependencies
- run `npm run dev` to start server


## deploy in production

[documentation](https://devcenter.heroku.com/articles/deploying-nodejs)

According to the documentation you need to follow these steps
- install `heroku CLI` (check documentation)
- add `engines` property in `package.json`
- Deploy using these commands
```
    heroku login
    heroku create
    git push heroku main
```

## Database Seeder

To seed the database with users, bootcamps, courses and reviews with data from the "\_data" folder, run

```
# Destroy all data and recreate
node seeder
```

## API documentation / Demo

Click [here](https://devcamper-api59.herokuapp.com) to check API documentation. API is live, feel free to follow documentation to test it.

- Version: 1.0.0
- License: MIT
