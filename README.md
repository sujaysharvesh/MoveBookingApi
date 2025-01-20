Movie Ticket Booking Application

Description

A comprehensive movie ticket booking system that allows users to browse theaters, view movie screenings, and book tickets. The project focuses on providing an intuitive user experience while ensuring data security and efficient performance.

Features

Theater and Movie Search: Advanced search functionality using Prisma ORM to query nested relations, providing accurate results based on user keywords.

Movie and Theater Details: Displays relevant information about movies, including title, language, duration, ratings, and descriptions, along with theater details.

Booking System: Allows users to select seats and book tickets seamlessly.

Authentication and Authorization: Secure user authentication with JWT-based authorization integrated with OAuth for third-party login.

Session Management: Implemented Redis for efficient session handling and caching.

Scalable Architecture: Designed to handle high traffic and ensure consistent performance.

Technologies Used

Backend: Node.js, Express.js

Database: PostgreSQL (managed with Prisma ORM)

Caching: Redis

Authentication: JWT, OAuth

API Testing: Postman

Version Control: Git, GitHub

Installation

Clone the repository:

git clone https://github.com/your-username/movie-ticket-booking.git

Navigate to the project directory:

cd movie-ticket-booking

Install dependencies:

npm install

Set up the environment variables:

Create a .env file in the root directory.

Add the following variables:

DATABASE_URL=your_database_url
REDIS_URL=your_redis_url
JWT_SECRET=your_jwt_secret
OAUTH_CLIENT_ID=your_oauth_client_id
OAUTH_CLIENT_SECRET=your_oauth_client_secret

Run database migrations:

npx prisma migrate dev

Start the server:

npm start

API Endpoints

Authentication

POST /auth/register: User registration

POST /auth/login: User login with JWT

GET /auth/oauth: OAuth-based login

Search

POST /search: Search theaters or movies by keyword

Booking

POST /bookings: Book tickets for a screening

Movies

GET /movies: Fetch all movies

GET /movies/:id: Get details of a specific movie

Theaters

GET /theaters: Fetch all theaters

GET /theaters/:id: Get details of a specific theater

Contribution

Fork the repository.

Create a feature branch:

git checkout -b feature-name

Commit your changes:

git commit -m "Description of changes"

Push to the branch:

git push origin feature-name

Open a pull request.
