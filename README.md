# College Mini Projects and Report

A public collection of college mini-projects, reports, prototypes, and learning experiments. The repository is open for students and contributors to study, improve, and reuse; please follow the applicable project guidelines and license.

## Featured Project: sea_of_learning (StudyTube)

**sea_of_learning** is an ad-free educational video platform prototype for discovering, watching, saving, and sharing academic lectures.

It provides a YouTube-style learning experience with academic categories, search, filtering, sorting, video playback, likes, saved videos, discussion notes, mock authentication, local uploads, dark mode, and five switchable home-page layout prototypes.

The project lives in [`studytube/`](studytube/) and is built with React 19 and Vite.

## Features

- Browse lectures by academic subject
- Search by title, description, tags, uploader, or category
- Filter and sort lecture listings
- Watch lectures in a responsive player
- Like, save, and share lectures
- Add study notes and discussion questions
- Track views locally
- Upload and validate study videos in the browser
- View uploaded and saved videos on a profile page
- Sign in and out through a mock authentication flow
- Switch between light and dark themes
- Use responsive layouts across desktop, tablet, and mobile
- Explore five switchable home-page layout prototypes

## Project Structure

```text
.
├── GLOSSARY.md      Domain terminology for sea_of_learning
├── README.md        Repository documentation
└── studytube/       React and Vite mini-project
    ├── public/      Static assets
    ├── src/
    │   ├── components/  Reusable interface components
    │   ├── context/     Authentication and application state
    │   ├── data/        Mock lectures and categories
    │   ├── hooks/       Search and local-storage hooks
    │   ├── pages/       Route-level views
    │   ├── utils/       Validation and media helpers
    │   └── __tests__/   Node regression tests
    ├── package.json
    └── vite.config.js
```

## Tech Stack

- React 19
- Vite 8
- React Router 7
- Tailwind CSS 4
- React Player
- Lucide React
- Node.js test runner
- Oxlint

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Run the Project

```bash
cd studytube
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

### Production Commands

```bash
npm run build
npm run preview
npm run lint
node --test src/__tests__/bugs.test.js
```

Run these commands from the `studytube/` directory.

## Application Routes

| Route | Purpose |
| --- | --- |
| `/` | Lecture discovery, search, filtering, sorting, and layout prototypes |
| `/watch/:id` | Lecture player, details, actions, related lectures, and notes |
| `/upload` | Auth-gated study-video upload form |
| `/profile` | User profile, uploaded lectures, and saved lectures |
| `*` | Not-found page |

## Data and Prototype Limitations

This project is a frontend-only prototype:

- Mock authentication and application data use browser `localStorage`.
- Lecture metadata, likes, saves, views, and comments are stored locally.
- The initial catalog comes from `src/data/mockVideos.js`.
- Uploaded media is handled in the browser and is not stored by a production service.
- Browser data is not synchronized across users or devices.

A production deployment would require a backend for authentication, authorization, media storage, metadata, comments, likes, saves, and view tracking.

## Testing

The Node regression suite covers duplicate likes and saves, timestamp handling, view-count formatting, and upload-validation order.

## Contributing

Contributions are welcome. You may report issues, fix bugs, improve documentation, refactor code, add features, or use the project as a learning reference.

1. Fork the repository.
2. Create a focused branch:

   ```bash
   git checkout -b feature/your-change
   ```

3. Make and test your changes from `studytube/`:

   ```bash
   npm run lint
   npm run build
   node --test src/__tests__/bugs.test.js
   ```

4. Commit the changes and open a pull request with a clear description.

Keep changes small and document any behavior or setup changes. Do not commit secrets, personal data, generated dependencies, or large unrelated files.

## Potential Improvements

- Real authentication and authorization
- Database-backed APIs
- Cloud object storage for uploaded videos
- Server-side upload and file validation
- Video processing and thumbnails
- Courses, tracks, milestones, and curriculum pathways
- Pagination, caching, and improved search
- Automated browser and accessibility testing
- Deployment configuration

## Glossary

Common project terminology is defined in [`GLOSSARY.md`](GLOSSARY.md).

## License

This project is released under the [MIT License](LICENSE). You are permitted to use, modify, and distribute the code, subject to the license terms.

## Author

Maintained by [@sharan-k-03](https://github.com/sharan-k-03).
