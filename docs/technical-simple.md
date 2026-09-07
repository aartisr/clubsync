# ClubSync technical details, explained simply

## What this document is
This is the "what is it built with and where does it run" version.

It explains the technical parts in very simple terms.

## What ClubSync is built with
ClubSync is a web app made from a few common pieces:

- **React** for the screen the user sees
- **TypeScript** so the code is easier to keep organized
- **Vite** so the app builds and reloads quickly during development
- **Node.js** for the server side
- **Express** for the small backend server and API routes
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Motion** for small animations
- **Google GenAI** for the optional AI helper inside the app

## What each part does

### React
React is the front end.
It draws the pages, buttons, tabs, cards, and dialogs.

### TypeScript
TypeScript is JavaScript with more structure.
It helps catch mistakes earlier.

### Vite
Vite is the build tool.
It bundles the app for production and makes development fast.

### Node.js and Express
Node.js runs the server.
Express is the layer that handles requests.

In this repo, the server does things like:

- serve the app
- provide API endpoints
- handle AI helper requests
- support local development

### Tailwind CSS
Tailwind is the styling system.
It is what makes the app look polished without writing a lot of custom CSS.

### Lucide React and Motion
Lucide React provides icons.
Motion provides lightweight animation.

### Google GenAI
This is used only for the AI assistant features.
If the API key is missing, the main app still works.

## Where ClubSync runs
ClubSync can run in more than one place.

### 1. Local development on a laptop
This is for building and testing.

The repo uses:

- `npm run dev`
- `tsx server.ts`
- Vite middleware during development

That means the server and the React app run together on your machine.

### 2. Vercel deployment
The repo is also set up for Vercel.

That means:

- the front end can be hosted as a web app
- API endpoints can run as serverless functions
- `vercel.json` helps with routing

This is the easiest hosted option in the repo.

### 3. Standalone Node.js hosting
The app can also run as a normal Node server.

That mode uses:

- `npm run build:standalone`
- `dist/server.cjs`
- `npm run start`

This is useful if you want to host it yourself on a server or container.

## How the app is deployed

### For local testing
The development flow is:

1. Install dependencies.
2. Start the dev server.
3. Open the app in the browser.
4. Make changes and see them reload quickly.

### For Vercel
The hosted flow is:

1. Push the code to GitHub.
2. Connect the repo to Vercel.
3. Set the environment variables.
4. Let Vercel build and deploy it.

### For standalone Node hosting
The self-hosted flow is:

1. Build the app.
2. Start the production server.
3. Put it behind a domain or reverse proxy if needed.

## What the backend does
The backend is small and focused.

It mainly provides:

- a health check endpoint
- AI chat requests
- AI script customization requests
- app routing support

It is not a giant database server or a complicated backend.
It is more like a helper layer around the main web app.

## What data the app uses
ClubSync mostly uses in-memory configuration and static data files.

That means a lot of the content comes from files like:

- diagrams
- design document text
- permission data
- proposal text
- handover steps
- automation script templates

So the app is more of a planning and presentation tool than a heavy data app.

## Simple technical picture

```text
Browser
  |
  v
React user interface
  |
  v
Node.js + Express server
  |
  +--> AI helper API calls
  |
  +--> Vite during development
  |
  +--> Static build or Vercel in production
```

## How the pieces fit together
The simplest way to think about it is:

- React shows the screen
- TypeScript keeps the code organized
- Vite builds and serves it
- Node and Express run the server side
- Vercel can host it on the internet
- Google GenAI powers the optional AI helper

## What is important about deployment

### Environment variables
Some features need setup values, especially the AI helper.

The important one is:

- `GEMINI_API_KEY`

If it is missing, the AI helper will not work, but the rest of the app still can.

### Port
The app runs on port `3000` in development and in standalone server mode.

### No big database requirement
The repo does not depend on a large database for its main purpose.
That makes it easier to run and easier to deploy.

## One-sentence summary
ClubSync is a React and TypeScript web app with a small Node and Express backend, built with Vite, styled with Tailwind, optionally powered by Google GenAI, and deployable either on Vercel or as a standalone Node server.
