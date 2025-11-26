# notes.io

notes.io is a monochrome note-taking surface with a split layout: the left column lists notes, while the right column provides a distraction-free editor. Notes persist to `localStorage`, can be archived, and support bulk actions via the sidebar menu.

## Development

```bash
npm install
npm start
```

- `npm start` — development server on `http://localhost:3000`
- `npm test` — run the unit tests once (CI mode)
- `npm run build` — create an optimized production bundle

## Project Structure

- `src/components` – sidebar, editor, shared UI pieces
- `src/hooks/useLocalStorage.js` – persistence helper
- `src/App.jsx` – orchestrates filters, selections, and layout

