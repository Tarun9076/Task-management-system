# Task Management System

A modern, full-stack task management application built with Vue 3, Express.js, and SQLite. Organize projects and tasks with a sleek, responsive Kanban-style interface featuring real-time updates.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Project Management**: Create and manage multiple projects
- **Kanban Board**: Organize tasks across three columns (Todo, In Progress, Done)
- **Real-time Updates**: Socket.io integration for instant task synchronization
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Clean UI**: Minimal, intuitive design for easy navigation and task management

## Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Vite** - Lightning-fast frontend build tool
- **Pinia** - State management
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client

### Backend
- **Express.js** - Node.js web framework
- **Sequelize** - ORM for database operations
- **SQLite3** - Lightweight database
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time WebSocket communication

## Project Structure

```
taskmanagement/
├── server/                 # Express backend
│   ├── src/
│   │   ├── server.js      # Main server entry
│   │   ├── db.js          # Database configuration
│   │   ├── models.js      # Sequelize models
│   │   └── routes.js      # API routes
│   ├── .env               # Server environment variables
│   └── package.json
├── web/                   # Vue 3 frontend
│   ├── src/
│   │   ├── pages/
│   │   │   └── Dashboard.vue  # Main application
│   │   ├── socket.js          # Socket.io configuration
│   │   ├── api.js             # Axios instance
│   │   └── main.js            # Vue app entry
│   ├── .env               # Frontend environment variables
│   └── package.json
├── package.json           # Root package for dev scripts
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taskmanagement
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create `.env` file in `server/` directory:
   ```
   PORT=4000
   DATABASE_URL=sqlite::memory:
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

   Create `.env` file in `web/` directory:
   ```
   VITE_API_URL=http://localhost:4000
   VITE_SOCKET_URL=http://localhost:4000
   ```

## Running the Application

### Development Mode

Start both servers with a single command:

```bash
npm run dev
```

This runs:
- **Backend Server**: http://localhost:4000
- **Frontend Application**: http://localhost:5173

### Individual Servers

Start backend only:
```bash
npm run dev:server
```

Start frontend only:
```bash
npm run dev:web
```

## Database

The application uses SQLite3 for local development. The default configuration uses an in-memory database (`:memory:`) which means data is not persisted between sessions.

### For Persistent Storage

Update `server/.env`:
```
DATABASE_URL=sqlite:./taskmanagement.db
```

### Production Database

For production deployments, replace SQLite3 with PostgreSQL:

1. Update `server/src/db.js` to use PostgreSQL dialect
2. Update `server/.env` with PostgreSQL connection string
3. Run migrations/seeders as needed

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Projects
- `GET /projects` - List user's projects
- `POST /projects` - Create new project

### Tasks
- `GET /projects/:projectId/tasks` - Get tasks for a project
- `POST /projects/:projectId/tasks` - Create new task
- `DELETE /tasks/:taskId` - Delete a task

## Real-time Events

The application uses Socket.io for real-time updates:

- `join:project` - Join a project channel
- `task:created` - New task created
- `task:updated` - Task status updated

## Authentication

The application uses JWT (JSON Web Tokens) for secure authentication:

1. User registers with email and password
2. Password is hashed using bcryptjs
3. JWT token is generated and stored in localStorage
4. Token is sent with all API requests in Authorization header
5. Token is automatically sent with Socket.io connections

## Development Notes

### Adding Features
1. Create API endpoints in `server/src/routes.js`
2. Add database models in `server/src/models.js`
3. Update Vue components in `web/src/pages/`
4. Test with both servers running

### File Size Note
Windows paths with special characters may cause npm install issues. Use short path notation (e.g., `TARUNK~1`) when necessary.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Drag-and-drop task management
- Task priorities and due dates
- Team collaboration and permissions
- Task comments and attachments
- Advanced filtering and search
- Dark/Light theme toggle
- Email notifications

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please open an issue on the GitHub repository.
