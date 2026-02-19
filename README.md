# Premium Modern Blog

A classic, premium modern blog built with the MERN stack (MySQL instead of MongoDB).

## Tech Stack
- **Backend**: Node.js, Express.js, MySQL (Sequelize ORM)
- **Frontend**: React.js (Vite), Framer Motion, Lucide Icons
- **Auth**: JWT with HTTP headers
- **Styling**: Vanilla CSS (Premium Custom Design)

## Prerequisites
1. **MySQL**: Ensure MySQL is running on your machine.
2. **Database**: Create a database named `blog_db` in your MySQL server.

## Installation & Setup

### 1. Backend
- Go to `server` directory.
- Run `npm install`.
- Update `.env` with your MySQL credentials (if different from default).
- Run `node scripts/seed.js` to create the initial admin account.
- Run `npm run dev` or `nodemon index.js`.

**Admin Credentials:**
- **Email:** `admin@blog.com`
- **Password:** `adminpassword`

### 2. Public Blog (Client)
- Go to `client` directory.
- Run `npm install`.
- Run `npm run dev`.

### 3. Admin Panel
- Go to `admin` directory.
- Run `npm install`.
- Run `npm run dev`.

## Project Structure
- `/server`: Express API, Sequelize models, and image uploads.
- `/client`: Public facing blog with premium aesthetics.
- `/admin`: Dashboard for managing blog posts.
