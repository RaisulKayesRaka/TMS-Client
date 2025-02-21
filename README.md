# TMS

TMS is a Task Management Application where users can add, edit, delete, and reorder tasks using a drag-and-drop interface.

## Live Site

https://simple-task-management-system.web.app

## Key Features

- Drag-and-Drop Interface
- Secure User Authentication and Authorization
- Fully Responsive Design

## Technologies Used

`HTML`, `Tailwind CSS`, `React`, `Firebase`, `Node.js`, `Express.js`, `MongoDB`, `JWT`

## Dependencies

- @tanstack/react-query
- axios
- firebase
- react
- react-dom
- react-helmet-async
- react-hot-toast
- react-icons
- react-router-dom

## Installation

Here is a step-by-step guide on how to run the project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/RaisulKayesRaka/TMS-Client.git
   cd TMS-Client
   ```

2. **Install dependencies:**
   Ensure you have Node.js and npm installed. Then run:

   ```bash
   npm install
   ```

3. **Set up Firebase Authentication**

   - Go to the Firebase Console. https://console.firebase.google.com
   - Create a new project or use an existing one.
   - Navigate to Project Settings > General and add a new Web App.
   - Copy the Firebase configuration object.
   - In the Firebase console, go to Authentication > Sign-in method, and enable:
     - Google Sign-in

4. **Set up environment variables:**
   Create a `.env.local` file in the root directory and Add the following variables to it:

   ```
   VITE_apiKey=your_api_key
   VITE_authDomain=your_auth_domain
   VITE_projectId=your_project_id
   VITE_storageBucket=your_storage_bucket
   VITE_messagingSenderId=your_messaging_sender_id
   VITE_appId=your_app_id
   ```

5. **Run the development server:**

   ```bash
   npm run dev
   ```
