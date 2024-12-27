# Custom URL Shortener API

This project is a **Custom URL Shortener API** that provides advanced analytics, user authentication using Google Sign-In, and rate limiting. It allows users to create, manage, and analyze short URLs categorized under specific topics, simplifying the sharing of long URLs while delivering detailed insights into link performance.

## Deployment Details

- **Platform**: The API is deployed on [Render.com](https://render.com) due to its ease of use and free hosting options.
- **Initial Deployment Challenges**: While I initially attempted to deploy the service to AWS, I faced challenges in configuring the necessary infrastructure. As a result, I opted for Render.com, which offers a simpler and faster deployment process.

---

## Features

- **User Authentication**: Secure authentication using Google Sign-In.
- **Short URL Generation**: Create short URLs for long URLs with optional custom aliases and topic categorization.
- **Redirects with Analytics**: Redirect users seamlessly while collecting detailed analytics on audience interactions.
- **Advanced Analytics**:
  - Individual URL analytics.
  - Topic-based URL analytics.
  - Overall URL performance.
- **Rate Limiting**: Prevent abuse of the API endpoints.
- **Caching**: Redis caching for improved performance and reduced database load.
- **Scalability**: Dockerized solution for easy deployment and management.

---

## Deployed Service

The API is deployed at **[https://custom-url-shortener-1.onrender.com](https://custom-url-shortener-1.onrender.com)**.

### Authentication

To access the API endpoints:

1. First, log in using the Google Sign-In endpoint:  
   **[https://custom-url-shortener-1.onrender.com/auth/google](https://custom-url-shortener-1.onrender.com/auth/google)**
2. Use the token received in the login response to authenticate subsequent requests. Include the token in the request headers as:  
   `Authorization: Bearer <token>`

### Note

If the API takes time to respond, the Render instance might have stopped due to inactivity. Please wait a few moments for the instance to start running again.

---

## API Documentation

The full API documentation, including request and response formats, is available in the Swagger UI at:  
**[https://www.postman.com/aerospace-operator-390260/custom-url-shortener/overview](https://www.postman.com/aerospace-operator-390260/custom-url-shortener/overview)**

---

## Endpoints Overview

### 1. Authentication

- **POST /auth/google**: Log in or register using Google Sign-In.

### 2. Short URL API

- **POST /api/shorten**: Create a new short URL.
- **GET /api/shorten/{alias}**: Redirect to the original URL based on the short URL alias.

### 3. Analytics

- **GET /api/analytics/{alias}**: Retrieve analytics for a specific short URL.
- **GET /api/analytics/topic/{topic}**: Retrieve analytics for all URLs grouped under a specific topic.
- **GET /api/analytics/overall**: Retrieve overall analytics for all short URLs created by the authenticated user.

### 4. Caching

- URLs and analytics data are cached using Redis to improve performance.

---

## Technical Details

- **Backend Framework**: Node.js
- **Database**: PostgreSQL
- **Caching**: Redis
- **Authentication**: Google Sign-In
- **Containerization**: Docker
- **Deployment**: Render.com

---

## Running the Application Locally

### Prerequisites

- Node.js
- Docker
- Redis
- A Google Cloud project with OAuth credentials for Google Sign-In.

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/siddharth20190428/Custom-URL-Shortener
   cd Custom-URL-Shortener
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables: Create a .env file with the following variables:

   ```env
   CLIENT_ID = <your-google-client-id>
   CLIENT_SECRET = <your-google-client-secret>
   POSTGRES_HOST=<your-db-host>
   POSTGRES_USER=<your-db-user>
   POSTGRES_PASSWORD=<your-db-password>
   POSTGRES_DB=<your-db-name>
   DATABASE_URL=<your-db-url>
   REDIS_HOST=<your-redis-host>
   REDIS_PORT=6379
   JWT_SECRET=<your-jwt-secret>
   HOST_NAME=http://localhost:3000
   SESSION_SECRET=<your-session-secret>
   ```

4. Run the application:

   ```bash
   npm start
   ```

### Running with Docker

1. Build the Docker image:

   ```bash
   docker build -t custom-url-shortener .
   ```

2. Run the Docker container:

   ```bash
   docker run -p 3000:3000 custom-url-shortener
   ```
