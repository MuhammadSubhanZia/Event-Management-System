# Event Management System

A React application for discovering upcoming events and managing personal event registrations. Event information comes from the Ticketmaster Discovery API.

## Features

- Register, log in, and log out with a frontend-only account simulation
- Browse upcoming events and search by keyword or city
- Filter by event category and browse result pages
- View individual event details
- Register for an event once and cancel an upcoming registration
- View your own upcoming and completed events

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- A Ticketmaster Discovery API key

## Run locally

1. Clone the repository and open its folder in a terminal.
2. Install dependencies:

   ```powershell
   npm install
   ```

3. Copy the example environment file:

   ```powershell
   Copy-Item .env.example .env
   ```

4. Get a key from the [Ticketmaster Developer Portal](https://developer.ticketmaster.com/). In `.env`, replace the placeholder:

   ```dotenv
   VITE_TICKETMASTER_API_KEY=your_consumer_key
   ```

5. Start the application:

   ```powershell
   npm run dev
   ```

6. Open the local address printed in the terminal.

To check the production build, run `npm run build`. To preview that build locally, run `npm run preview`.

## Main pages

| Path | Purpose |
| --- | --- |
| `/` | Home |
| `/events` | Event search and categories |
| `/events/:eventId` | Event details and registration |
| `/register` | Create an account |
| `/login` | Log in |
| `/my-events` | Your registrations; login required |

## How data is stored

Authentication is a frontend simulation. Accounts, the current session, and registrations are saved in this browser's local storage. Registrations are associated with each local account. They are **not Ticketmaster ticket purchases** and will not appear on another device or browser.

Use a dummy password when trying the application. The `.env` file is excluded from Git; anyone running the project needs their own API key. Because this is a frontend application, a key used by the running browser is visible in its network requests.

## Built with

React, Redux Toolkit, React Router, Vite, and the Ticketmaster Discovery API.