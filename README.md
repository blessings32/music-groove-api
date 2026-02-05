# Music Groove 🎵

A music streaming backend application built with Node.js and Express.

> **🔗 Frontend Repository:** This backend works with the [Music Groove Web](https://github.com/blessings32/music-groove-web.git) frontend application.

## Related Projects

| Repository                                                              | Description                |
| ----------------------------------------------------------------------- | -------------------------- |
| [music-groove](.)                                                       | Backend API (this repo)    |
| [music-groove-web](https://github.com/blessings32/music-groove-web.git) | Frontend React application |

## Features

- 🎧 Music streaming and playback
- 👤 User authentication (JWT-based)
- 📚 Library management
- 🎵 Playlist creation and management
- 🔐 Secure routes with cookie-based sessions

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **Authentication:** JWT (jsonwebtoken) & bcryptjs
- **Template Engine:** EJS
- **Development:** Nodemon

## Prerequisites

- Node.js (v18 or higher recommended)
- MySQL database
- npm or yarn

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd music-groove
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=music_groove
   JWT_SECRET=your_jwt_secret
   ```

4. Set up your MySQL database and run any necessary migrations.

## Running the Application

### Development

```bash
npm test
```

This will start the server with nodemon for hot-reloading.

### Production

```bash
node ./src/server.mjs
```

## Project Structure

```
music-groove/
├── src/
│   ├── app.mjs          # Express app configuration
│   ├── server.mjs       # Server entry point
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   └── routes/          # API routes
├── config/
│   └── locals.mjs       # Local configuration
├── middleware/
│   └── errorhandler.mjs # Error handling middleware
├── public/              # Static files
│   ├── css/
│   ├── images/
│   └── Music/
├── library.mjs          # Library utilities
├── main.mjs             # Main utilities
└── package.json
```

## API Routes

- `/` - Index routes
- `/library` - Library management
- `/playlist` - Playlist operations
- `/auth` - User authentication

## License

ISC

## Author

Music Groove Team
