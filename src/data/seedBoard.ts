import type { Board } from '../types'

/** The one column with behaviour attached to it — reaching it is celebrated. */
export const DONE_COLUMN_ID = 'done'

/**
 * True only when a card *arrives* in Done. Reordering inside Done, leaving it,
 * or any move that doesn't involve it are all silent.
 */
export function isEnteringDone(fromColumnId: string, toColumnId: string) {
  return fromColumnId !== DONE_COLUMN_ID && toColumnId === DONE_COLUMN_ID
}

export const seedBoard: Board = {
  title: 'Project Board',
  columns: [
    {
      id: 'todo',
      title: 'To Do',
      cards: [
        { id: 'c1', text: 'Write onboarding docs', characterId: '1' },
        { id: 'c2', text: 'Audit unused dependencies', characterId: '2' },
        {
          id: 'c3',
          text: 'Investigate the slow dashboard query',
          characterId: '3',
        },
        { id: 'c4', text: 'Update the error page copy', characterId: '4' },
      ],
    },
    {
      id: 'doing',
      title: 'Doing',
      cards: [
        {
          id: 'c5',
          text: 'Add keyboard shortcuts to the editor',
          characterId: '5',
        },
        { id: 'c6', text: 'Fix flaky checkout test', characterId: '6' },
        { id: 'c7', text: 'Review the API pagination PR', characterId: '7' },
      ],
    },
    {
      id: DONE_COLUMN_ID,
      title: 'Done',
      cards: [
        { id: 'c8', text: 'Set up CI on the new repo', characterId: '8' },
      ],
    },
  ],
}
