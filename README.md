# BookIt: Experiences & Slots

BookIt is a fullstack travel experiences marketplace built for the Fullstack Intern assignment. Travellers can browse curated adventures, review availability, complete a guided checkout, and receive instant confirmation.

## Tech Stack

- **Frontend**: React 18 + TypeScript, Vite, TailwindCSS, React Router, Axios
- **Backend**: Node.js, Express, MongoDB (Mongoose), Zod for validation
- **Database**: MongoDB (local instance or Atlas). A development fallback using `mongodb-memory-server` is provided so the API runs without an external database when testing locally.

## Project Structure

```
.
├── backend/          # Express API
│   ├── src/
│   ├── package.json
│   └── .env.example
├── frontend/         # React client
│   ├── src/
│   ├── package.json
│   └── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- MongoDB database connection string (for production use). Local development automatically boots an in-memory MongoDB instance if `MONGODB_URI` is not provided.

### Backend setup

```bash
cd backend
cp .env.example .env
# Optionally set MONGODB_URI in .env to use a persistent database
npm install
npm run dev
```

The API seeds three sample experiences on first launch. Endpoints:

- `GET /experiences`
- `GET /experiences/:id`
- `POST /bookings`
- `POST /promo/validate`

A health check is available at `GET /health`.

### Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The Vite dev server proxies `/api` requests to the backend. Update `VITE_API_URL` when deploying the API separately.

### Booking flow

1. Browse experiences on the Home page.
2. Select an experience to view detailed itineraries and live slot availability.
3. Choose an available slot and continue to checkout.
4. Enter guest details, apply promo codes (SAVE10, FLAT100, SUMMER25), and confirm the reservation.
5. Receive a success or error summary on the Result page.

### Deployment

Deploy the backend (Express API) to platforms like Render, Railway, or Fly.io. Deploy the frontend to Vercel, Netlify, or similar. Update the environment variables accordingly:

- Backend `.env`: `CLIENT_URL` should contain the deployed frontend origin(s) separated by commas.
- Frontend `.env`: `VITE_API_URL` should point to the deployed API base URL.

## Testing & Validation

- Promo code validation lives at `POST /promo/validate` and supports SAVE10 (10%), FLAT100 (\$10), and SUMMER25 (25%).
- Double booking is prevented by slot-level capacity checks before persisting a new booking.
- Form validation ensures email, phone, and required fields are supplied before submission.

## License

This project is provided for assessment purposes.
