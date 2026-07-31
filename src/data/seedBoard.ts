import type { Board } from '../types'

export const seedBoard: Board = {
  title: 'Project Board',
  columns: [
    {
      id: 'todo',
      title: 'To Do',
      cards: [
        { id: 'c1', text: 'Write onboarding docs' },
        { id: 'c2', text: 'Audit unused dependencies' },
        {
          id: 'c3',
          text: 'Investigate the slow dashboard query',
        },
        { id: 'c4', text: 'Update the error page copy' },
      ],
    },
    {
      id: 'doing',
      title: 'Doing',
      cards: [
        { id: 'c5', text: 'Add keyboard shortcuts to the editor' },
        { id: 'c6', text: 'Fix flaky checkout test' },
        { id: 'c7', text: 'Review the API pagination PR' },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      cards: [{ id: 'c8', text: 'Set up CI on the new repo' }],
    },
  ],
}
