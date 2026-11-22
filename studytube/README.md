# sea_of_learning

An ad-free educational video platform prototype for discovering, watching, saving, and sharing academic lectures.

The project is built with React and Vite. It provides a YouTube-style study experience with mock authentication, subject browsing, search, filtering, sorting, video playback, likes, saves, discussion notes, local uploads, dark mode, and five switchable home-page layouts.

## Features

- Browse lectures by subject or academic category.
- Search titles, descriptions, tags, uploader names, and categories.
- Filter by category and sort by newest, most viewed, or most liked.
- Watch lectures with a responsive player.
- Like or unlike lectures and save or unsave them.
- Add discussion notes and study questions to lecture pages.
- Sign in or out using a mock, frontend-only account.
- Upload MP4, WebM, OGG, or MOV study videos up to 500 MB.
- View uploaded and saved lectures on the profile page.
- Switch between light and dark themes.
- Choose from five home-page layouts, including the AI Hero, Spotlight, Curriculum, Syllabus, and Standard Grid designs.
- Persist application state in the browser and keep the interface responsive across desktop, tablet, and mobile screens.

## Technology

- React 19
- Vite 8
- React Router 7
- Tailwind CSS 4
- React Player
- Lucide React
- Node.js test runner
- Oxlint

## Requirements

- Node.js 20.19 or later, or Node.js 22.12 or later
- npm

## Getting Started

Run the following commands from the repository root:

```bash
cd studytube
npm install
npm run dev
```

Vite will start the development server. It normally opens:

```text
http://localhost:5173
```

The development server also supports hot module replacement.

## Available Commands

Run these commands inside the `studytube/` directory:

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run the Oxlint linter |
| `node --test src/__tests__/bugs.test.js` | Run the Node.js regression tests |

## Application Routes

| Route | Description |
|---|---|
| `/` | Lecture discovery, search, category filtering, sorting, and layout selection |
| `/watch/:id` | Video playback, lecture details, likes, saves, and discussion notes |
| `/upload` | Mock-authenticated study-video upload form |
| `/profile` | Mock user profile, uploaded lectures, and saved lectures |
| `*` | Not-found page |

Search and layout options can also be included in the home-page URL:

- `/?q=python` searches for Python-related lectures.
- `/?variant=A` displays the Spotlight Hero and Grid layout.
- `/?variant=B` displays the Curriculum Pathways layout.
- `/?variant=C` displays the Syllabus List layout.
- `/?variant=default` displays the Standard Grid layout.
- `/?variant=aihero` displays the default AI Hero layout.

## Project Structure

```text
studytube/
├── public/                 Static public assets
├── src/
│   ├── assets/             Images imported by the application
│   ├── components/         Navigation, cards, grids, upload, and layout components
│   ├── context/            Mock authentication and video application state
│   ├── data/               Mock lecture catalog and categories
│   ├── hooks/              Search and local-storage hooks
│   ├── pages/              Home, watch, upload, profile, and not-found pages
│   ├── utils/              Upload validation and media-storage utilities
│   └── __tests__/          Node.js regression tests
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Upload Requirements

The mock upload form accepts:

- Video types: MP4, WebM, OGG, and MOV
- Maximum file size: 500 MB
- Title: at least 5 characters
- Description: at least 20 characters
- A valid academic category
- Optional comma-separated tags

Upload validation follows the form order, with the selected file checked before the title, category, and description.

## State and Persistence

This project is a frontend-only prototype:

- Mock user authentication is stored in `localStorage` under `studytube_user`.
- Lecture metadata, likes, saved IDs, views, and comments are stored in `localStorage` under `studytube_data`.
- Uploaded lecture metadata is added to the current application state.
- The upload preview uses a browser object URL and is not uploaded to a server or durable media service.
- An IndexedDB media utility exists, but it is not currently called by the upload flow.
- Browser data is local to the current browser and origin and is not synchronized across users or devices.
- Clearing site data removes the mock account and locally saved application state.

## Testing

The regression suite covers:

- Preventing duplicate likes
- Preventing duplicate saved-video IDs
- Handling same-day and future timestamps
- Clamping negative view counts
- Reporting the missing-file validation error before category errors

## Production Deployment

Build the project before deployment:

```bash
npm run build
```

The deployable static files are generated in `dist/`. When deploying to a static host, configure the host to rewrite unknown routes to `index.html` because the application uses browser routing.

## Limitations and Future Improvements

A production-ready system would require:

- Real authentication and authorization
- Database-backed lecture metadata and user data
- Server-side media storage and playback
- Persistent upload processing and thumbnails
- Server-side upload validation
- Shared comments, likes, saves, and view counts
- Pagination and caching
- Automated browser and accessibility tests
- Production monitoring and deployment configuration

## Contributing

Contributions are welcome. To make a change:

1. Create a focused branch.
2. Install dependencies with `npm install`.
3. Start the development server and verify the change.
4. Run `npm run lint`, `npm run build`, and `node --test src/__tests__/bugs.test.js`.
5. Open a pull request with a clear description.

Do not commit secrets, personal data, generated dependencies, or large unrelated files.

## License

This project is licensed under the MIT License. See the repository [LICENSE](../LICENSE) file.
