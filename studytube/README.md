# sea_of_learning

An ad-free educational video platform prototype for discovering, watching, saving, and sharing study lectures.

Built with React and Vite, the application provides a YouTube-style learning experience with academic categories, search, video playback, discussion notes, mock authentication, local uploads, and multiple home-page layout prototypes.

## Features

- Browse educational lectures by subject
- Search videos by title, description, tags, uploader, or category
- Filter by academic category
- Sort by newest, most viewed, or most liked
- Watch videos with a responsive player
- Like and unlike lectures
- Save and unsave lectures
- Add discussion notes and study questions
- Track video views locally
- Upload study videos with client-side validation
- View uploaded and saved videos from the profile page
- Mock sign-in and sign-out flow
- Dark mode
- Responsive layout for desktop, tablet, and mobile
- Five switchable home-page layout prototypes
- Local persistence using browser `localStorage`

## Tech stack

- React 19
- Vite
- React Router
- Tailwind CSS
- Lucide React
- React Player
- Node.js test runner
- Oxlint

## Getting started

### Prerequisites

- Node.js 18 or newer
- npm

### Installation

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open the local URL shown by Vite, normally:

```text
http://localhost:5173
```

### Create a production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Run the linter

```bash
npm run lint
```

### Run regression tests

```bash
node --test src/__tests__/bugs.test.js
```

## Application routes

| Route | Description |
|---|---|
| `/` | Home page, search, filtering, sorting, and layout prototypes |
| `/watch/:id` | Video player, lecture details, actions, related videos, and discussion notes |
| `/upload` | Auth-gated study video upload form |
| `/profile` | User profile, uploaded videos, and saved videos |
| `*` | Not-found page |

## Project structure

```text
src/
├── components/       Reusable UI components
├── context/          Authentication and video state providers
├── data/             Mock lecture data and categories
├── hooks/             Search and local-storage hooks
├── pages/             Route-level page components
├── utils/             Validation and media-storage helpers
└── __tests__/         Regression tests
```

## State and persistence

This is currently a frontend-only prototype.

- Mock authentication is stored in `localStorage`.
- Video metadata, likes, saves, views, and comments are stored in `localStorage`.
- The initial lecture catalog is loaded from `src/data/mockVideos.js`.
- Uploaded media is currently handled in the browser and is not backed by a production upload service.
- Data is local to the browser and is not shared between users or devices.

For production use, the application would need a backend for authentication, authorization, video storage, metadata, comments, likes, saves, and view tracking.

## Testing

The regression suite covers:

- Preventing duplicate likes
- Preventing duplicate saved-video IDs
- Same-day and future timestamp handling
- Safe formatting of zero and negative view counts
- Upload validation order

## Future improvements

- Add real user authentication
- Add a database-backed API
- Store uploaded videos in object storage
- Add durable media processing and thumbnails
- Add server-side upload validation
- Add pagination and better caching
- Add curriculum pathways, courses, and milestones
- Add automated browser and accessibility tests
- Add production deployment configuration

## License

This project is currently intended as a college mini-project and prototype. Add a project-specific license before distributing it publicly.
