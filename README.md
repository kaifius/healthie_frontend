# React Kanban Board

A frontend-only Kanban board with three columns — To Do, Doing, and Done.

- Cards are created through a form and must have a Rick and Morty character assigned. The character list is fetched from the [Rick and Morty GraphQL API](https://rickandmortyapi.com/graphql) on load.
- Cards can be dragged between columns and reordered within a column.
- Moving a card into Done (or creating one there) fires confetti.
- Adds and moves can be undone, one at a time, with the Undo button or ⌘Z / Ctrl+Z.

Board state lives in memory (a `useReducer` in `Board.tsx`) and resets on reload.

## Running it

Requires Node 20.19+ or 22.12+ (Vite 8's minimum).

```bash
npm install
npm run dev
```

Then open the URL Vite prints, usually http://localhost:5173.

## Other scripts

| Command | What it does |
| --- | --- |
| `npm test` | Runs the unit tests once |
| `npm run test:watch` | Runs them in watch mode |
| `npm run build` | Type-checks and builds for production |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint |

## Structure

```
src/
  components/    Board, Column, Card, AddCardForm, CharacterPicker, Undo
  state/         boardReducer — every change to the board, plus its tests
  hooks/         useCharacters — fetches the character list
  api/           the GraphQL call
  data/          seed board and the Done-column helpers
```

`Board` owns the board data and passes it down; `Column` and `Card` render what they're given. All state changes go through `boardReducer`, which is a plain function and is unit tested.

## Built with

React 19, TypeScript, Vite, [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) for drag and drop, [canvas-confetti](https://github.com/catdad/canvas-confetti), and Vitest.
