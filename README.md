# React Kanban Board

A frontend-only Kanban board with three columns — To Do, Doing, and Done.

- Cards are created through a form and must have a Rick and Morty character assigned to them. The character list is fetched from the [Rick and Morty GraphQL API](https://rickandmortyapi.com/graphql) on load.
- Cards can be dragged between columns and reordered within a column.
- Moving a card into Done fires confetti.

Board state lives in memory (a `useReducer` in `Board.tsx`) and resets on reload.

Built with React 19, TypeScript, and Vite. Drag and drop uses [@hello-pangea/dnd](https://github.com/hello-pangea/dnd); confetti uses [canvas-confetti](https://github.com/catdad/canvas-confetti).

## Running it

Requires Node 20+.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Other scripts

```bash
npm test           # run the unit tests once (Vitest)
npm run test:watch # re-run tests on change
npm run lint       # ESLint
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build
```

## Layout

```
src/
  components/   Board, Column, Card, AddCardForm, CharacterPicker
  state/        boardReducer — all board mutations, unit tested
  api/          Rick and Morty GraphQL client
  hooks/        useCharacters — fetch, loading, and error state
  data/         seedBoard — starting cards, Done-column rules
  celebrate.ts  confetti
```
