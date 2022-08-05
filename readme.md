# DevCamper API

Backend API for Managing users, authentication, bootcamps, courses and reviews.

- [Documentation](https://documenter.getpostman.com/view/5295552/Uzs6zPSy)
- [A Example REST Endpoint](https://devcamper-api59.herokuapp.com/api/v1/bootcamps) Please check Documentation for other endpoints.
## Test in local

- copy `config/production.env` file contents into `config/config.env`. You must provide the missing sensitive environment variables (eg: MONGO_URI for mongoDB connection), other variables is already filled for you.
- run `npm install` to install dependencies
- run `npm run dev` to start server


## Deploy in production using heroku

[heroku documentation](https://devcenter.heroku.com/articles/deploying-nodejs)

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
node seeder
```

this will destroy all data and will recreate initial data.


# Bootcamps API overview
- List all bootcamps
   * Select specific fields in result
   * Pagination
   * Filter by fields (supports NoSQL standard query)
   * Sort by fields
- Search bootcamps by radius from zipcode
- Get single bootcamp
- Create new bootcamp
  * Authenticated users only
  * Must have the role "publisher" or "admin"
  * Only one bootcamp per publisher (admins can create more)
- Upload a photo for bootcamp
  * Owner only
- Update bootcamps
  * Owner only
- Delete Bootcamp
  * Owner only

## Courses API overview
- List all courses
   * Select specific fields in result
   * Pagination
   * Filter by fields (supports NoSQL standard query)
   * Sort by fields
- List all courses for bootcamp
- Get single course
- Create new course
  * Authenticated users only
  * Must have the role "publisher" or "admin"
  * Only the owner or an admin can create a course for a bootcamp
  * Publishers can create multiple courses
- Update course
  * Owner only
- Delete course
  * Owner only
  
## Reviews API overview
- List all reviews
   * Select specific fields in result
   * Pagination
   * Filter by fields (supports NoSQL standard query)
   * Sort by fields
- List all reviews for a bootcamp
- Get a single review
- Create a review
  * Authenticated users only
  * Must have the role "user" or "admin" (no publishers)
- Update review
  * Owner only
- Delete review
  * Owner only

## Users API overview
- List all users
   * Authenticated & user should have 'admin' role
   * Select specific fields in result
   * Pagination
   * Filter by fields (supports NoSQL standard query)
   * Sort by fields
- Get a single user by id
   * Authenticated & user should have 'admin' role
- Create a user
  * Authenticated & user should have 'admin' role
- Update user
  * Authenticated & user should have 'admin' role
- Delete user
  * Authenticated & user should have 'admin' role

## Authentication API overview
- User registration
  * Register as a "user" or "publisher"
  * Once registered, a JWT token will be sent with response and cookie
- User login
  * User can login with email and password
  * Once logged in, a JWT token will be sent with response and cookie
- User logout
  * Authenticated users only
  * JWT token Cookie will be cleared
- Get user
  * Authenticated users only
  * Get the currently logged in user info
- Forgot Password (lost password)
  * A hashed token will be emailed to email address
  * The token will expire after 10 minutes
- Password reset with email token
  * A put request can be made to the generated url to reset password
- Update user info
  * Authenticated user only
  * user can update name and email
- Update user password
  * Authenticated user only
  * user can update password (user must provide current password)

## Other important considerations
- AverageCost and averageRating of a bootcamp is automatically calculated when a new courses or reviews are added or deleted.
- If a bootcamp is deleted cascade delete all related courses and reviews.
- Authentication is managed via JWT token
- Password is hashed before saving to database
- Security considerations
  * Prevent cross site scripting(XSS) attacks
  * Prevent NoSQL injections
  * Add a rate limiter for requests of 100 requests per 10 minutes
  * Protect against http param pollution
  * Add headers for security
  * Use cors to make API public
- Config file for sensitive constants
- Proper authentication and role check before data access
- Database seeder to insert dummy data