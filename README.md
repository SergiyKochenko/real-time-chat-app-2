# Real-Time Chat App Without Images Uploads

A real-time chat application allowing users to communicate instantly. Built using the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO for real-time web socket communication.

[View Live Demo](https://...)  
[View Repository](https://...)

---

## Am I Responsive?

![Am I Responsive](./assets/amiresponsive.png)

The application is fully responsive and works seamlessly across devices, including desktops, tablets, and mobile phones.

---

## Table of Contents

- [Real-Time Chat App Without Images Uploads](#real-time-chat-app-without-images-uploads)
  - [Am I Responsive?](#am-i-responsive)
  - [Table of Contents](#table-of-contents)
  - [Project Goals](#project-goals)
  - [User Experience (UX)](#user-experience-ux)
    - [User Stories](#user-stories)
  - [Design](#design)
    - [Wireframes](#wireframes)
    - [Color Scheme](#color-scheme)
    - [Typography](#typography)
  - [Features](#features)
    - [Existing Features](#existing-features)
    - [Future Features](#future-features)
  - [Technologies Used](#technologies-used)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [API Endpoints](#api-endpoints)
  - [Testing](#testing)
    - [Manual Testing](#manual-testing)
    - [Validator Testing](#validator-testing)
    - [Performance Testing](#performance-testing)
    - [Known Bugs](#known-bugs)
  - [Deployment](#deployment)
    - [Preparation for Deployment](#preparation-for-deployment)
    - [Backend Deployment](#backend-deployment)
    - [Frontend Deployment](#frontend-deployment)
    - [Completed Deployment](#completed-deployment)
  - [Local Development](#local-development)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [API Endpoints](#api-endpoints-1)
    - [Signup Route](#signup-route)
    - [Login Route](#login-route)
    - [Logout Route](#logout-route)
    - [Message Routes](#message-routes)
      - [**GET** `/api/messages/:id`](#get-apimessagesid)
      - [**POST** `/api/messages/send/:id`](#post-apimessagessendid)
    - [User Routes](#user-routes)
      - [**GET** `/api/users/`](#get-apiusers)
  - [Testing](#testing-1)
  - [Avatar Placeholder](#avatar-placeholder)
  - [Credits](#credits)
    - [Content](#content)
    - [Media](#media)
    - [Code](#code)
    - [Acknowledgements](#acknowledgements)
  - [License](#license)

---

## Project Goals

The goal of this project is to create a real-time chat application that allows users to communicate instantly. The application is designed to provide a seamless and secure user experience with features like user authentication, profile management, and real-time messaging.

---

## User Experience (UX)

### User Stories

* As a user, I want to register an account so that I can log in and use the chat.
* As a user, I want to log in with my email and password so that I can access my chat sessions.
* As a user, I want to update my profile picture so that I can personalize my account.
* As a user, I want to log out securely so that my account remains safe.

---

## Design

### Wireframes

*(Include links or images of wireframes for key pages like Login, Signup, Chat Interface, etc.)*

### Color Scheme

*(Specify the color palette used in the application.)*

### Typography

*(Specify the fonts used for headings, body text, etc.)*

---

## Features

### Existing Features

* **User Authentication:** Secure signup, login, and logout functionality using JWT and cookies.
* **Profile Management:** Users can update their profile picture.
* **Real-time Messaging:** *(Add details once implemented.)*
* **Responsive Design:** *(Add details once implemented.)*

### Future Features

* Group chats.
* Online status indicators.
* Message notifications.
* Search functionality for users or messages.

---

## Technologies Used

### Frontend

* React
* Vite
* Zustand (State Management)
* CSS (or specify framework like Tailwind CSS)

### Backend

* Node.js
* Express.js
* MongoDB (Database)
* Mongoose (ODM)
* JSON Web Tokens (JWT)
* bcryptjs
* cookie-parser
* dotenv
* Cloudinary (for image uploads)

### API Endpoints

*(Add details about API endpoints as needed.)*

---

## Testing

### Manual Testing

*(Provide a table or list of manual tests performed.)*

### Validator Testing

*(Provide details about HTML, CSS, and JavaScript validation.)*

### Performance Testing

*(Include Lighthouse scores for Performance, Accessibility, Best Practices, SEO.)*

### Known Bugs

*(List any known bugs or issues.)*

---

## Deployment

### Preparation for Deployment

*(Provide steps for preparing the application for deployment.)*

### Backend Deployment

*(Specify the platform used, e.g., Render, Heroku, and the steps involved.)*

### Frontend Deployment

*(Specify the platform used, e.g., Vercel, Netlify, and the steps involved.)*

### Completed Deployment

The application has been successfully deployed and is live at:  
**[https://....](https://....)**

The source code is available at:  
**[https://github.com...](https://github.com....)**

---

## Local Development

### Prerequisites

* Node.js and npm (or yarn) installed.
* MongoDB instance (local or cloud-based like MongoDB Atlas).
* Cloudinary account (for image uploads).

### Installation

1. Navigate to the project directory:
    ```bash
    cd chat-app-yt
    ```

2. Initialize the project:
    ```bash
    npm init -y
    ```

3. Backend Setup:
    ```bash
    cd backend
    npm install express dotenv cookie-parser bcryptjs mongoose socket.io jsonwebtoken
    npm install nodemon --save-dev
    ```

4. Generate a JWT secret:
    ```bash
    openssl rand -base64 32
    ```
    Copy the generated secret and add it to your `.env` file:
    ```
    JWT_SECRET=<your_generated_secret>
    ```

5. Database Setup:
    - Use MongoDB Atlas or a local MongoDB instance.
    - Add the connection string to your `.env` file:
      ```
      MONGO_DB_URI=<your_mongodb_connection_string>
      ```

6. Start the backend server:
    ```bash
    npm run server
    ```

4. Frontend Setup:
    ```bash
    cd ../frontend
    npm create vite@latest .
    npm install
    npm run dev
    ```

---

## API Endpoints

### Signup Route

**POST** `/api/auth/signup`  
**Description:** Registers a new user.  

**Request Body:**
```json
{
    "fullName": "John Doe",
    "username": "johndoe",
    "password": "password123",
    "confirmPassword": "password123",
    "gender": "male"
}
```

**Response:**
```json
{
    "_id": "user_id",
    "fullName": "John Doe",
    "username": "johndoe",
    "profilePic": "https://avatar.iran.liara.run/public/boy?username=johndoe"
}
```

---

### Login Route

**POST** `/api/auth/login`  
**Description:** Logs in an existing user.  

**Request Body:**
```json
{
    "username": "johndoe",
    "password": "password123"
}
```

**Response:**
```json
{
    "_id": "user_id",
    "fullName": "John Doe",
    "username": "johndoe",
    "profilePic": "https://avatar.iran.liara.run/public/boy?username=johndoe"
}
```

---

### Logout Route

**POST** `/api/auth/logout`  
**Description:** Logs out the current user by clearing the JWT cookie.  

**Response:**
```json
{
    "message": "Logged out successfully"
}
```

---

### Message Routes

#### **GET** `/api/messages/:id`
**Description:** Fetch all messages in a conversation between the logged-in user and the user specified by `id`.

**Headers:**
- `Authorization`: Bearer `<JWT Token>`

**Response:**
- **200 OK**: Returns an array of messages.
- **401 Unauthorized**: If the user is not authenticated.
- **500 Internal Server Error**: If an error occurs on the server.

**Example Response:**
```json
[
    {
        "_id": "message_id",
        "senderId": "sender_user_id",
        "receiverId": "receiver_user_id",
        "message": "Hello!",
        "createdAt": "2023-10-01T12:00:00.000Z",
        "updatedAt": "2023-10-01T12:00:00.000Z"
    }
]
```

---

#### **POST** `/api/messages/send/:id`
**Description:** Send a message to the user specified by `id`.

**Headers:**
- `Authorization`: Bearer `<JWT Token>`

**Request Body:**
```json
{
    "message": "Hello, how are you?"
}
```

**Response:**
- **201 Created**: Returns the created message.
- **401 Unauthorized**: If the user is not authenticated.
- **500 Internal Server Error**: If an error occurs on the server.

**Example Response:**
```json
{
    "_id": "message_id",
    "senderId": "sender_user_id",
    "receiverId": "receiver_user_id",
    "message": "Hello, how are you?",
    "createdAt": "2023-10-01T12:00:00.000Z",
    "updatedAt": "2023-10-01T12:00:00.000Z"
}
```

---

### User Routes

#### **GET** `/api/users/`
**Description:** Fetches a list of users excluding the logged-in user for the sidebar.

**Headers:**
- `Authorization`: Bearer `<JWT Token>`

**Response:**
- **200 OK**: Returns an array of user objects excluding the logged-in user.
- **401 Unauthorized**: If the user is not authenticated.
- **500 Internal Server Error**: If an error occurs on the server.

**Example Response:**
```json
[
    {
        "_id": "user_id_1",
        "fullName": "Jane Doe",
        "username": "janedoe",
        "profilePic": "https://avatar.iran.liara.run/public/girl?username=janedoe"
    },
    {
        "_id": "user_id_2",
        "fullName": "John Smith",
        "username": "johnsmith",
        "profilePic": "https://avatar.iran.liara.run/public/boy?username=johnsmith"
    }
]
```

---

## Testing

All routes (Signup, Login, Logout) were tested using [Postman](https://www.postman.com/). Below are the steps to test:

1. Open Postman and create a new request.
2. Set the request type to `POST`.
3. Enter the appropriate route URL (e.g., `http://localhost:5000/api/auth/signup`).
4. Add the required request body in JSON format.
5. Send the request and verify the response.

---

## Avatar Placeholder

The application uses the following service for generating profile pictures:  
[https://avatar-placeholder.iran.liara.run/](https://avatar-placeholder.iran.liara.run/)

- Male Avatar: `https://avatar.iran.liara.run/public/boy?username=<username>`
- Female Avatar: `https://avatar.iran.liara.run/public/girl?username=<username>`

---

## Credits

### Content

*(Acknowledge any tutorials, documentation, or other resources used.)*

### Media

*(Acknowledge sources for images, icons, etc.)*

### Code

*(Acknowledge any significant code snippets or libraries used.)*

### Acknowledgements

*(Thank anyone who helped or inspired the project.)*

---

## License

*(Specify the license for your project, e.g., MIT License.)*
