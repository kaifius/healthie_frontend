import { describe, expect, it } from 'vitest'
import type { Board } from '../types'
import { boardReducer } from './boardReducer'

function makeBoard(): Board {
  return {
    title: 'Test Board',
    columns: [
      {
        id: 'todo',
        title: 'To Do',
        cards: [
          { id: 'a', text: 'a' },
          { id: 'b', text: 'b' },
          { id: 'c', text: 'c' },
        ],
      },
      {
        id: 'doing',
        title: 'Doing',
        cards: [
          { id: 'x', text: 'x' },
          { id: 'y', text: 'y' },
        ],
      },
      { id: 'done', title: 'Done', cards: [] },
    ],
  }
}

/** Compact view of where every card sits, e.g. `todo[a,b] doing[x] done[]`. */
function layout(board: Board): string {
  return board.columns
    .map((column) => `${column.id}[${column.cards.map((c) => c.id).join(',')}]`)
    .join(' ')
}

describe('ADD_CARD', () => {
  it('appends the card to the named column', () => {
    const next = boardReducer(makeBoard(), {
      type: 'ADD_CARD',
      columnId: 'doing',
      card: { id: 'new', text: 'new' },
    })

    expect(layout(next)).toBe('todo[a,b,c] doing[x,y,new] done[]')
  })

  it('adds to an empty column', () => {
    const next = boardReducer(makeBoard(), {
      type: 'ADD_CARD',
      columnId: 'done',
      card: { id: 'new', text: 'new' },
    })

    expect(layout(next)).toBe('todo[a,b,c] doing[x,y] done[new]')
  })

  it('ignores an unknown column', () => {
    const next = boardReducer(makeBoard(), {
      type: 'ADD_CARD',
      columnId: 'nope',
      card: { id: 'new', text: 'new' },
    })

    expect(layout(next)).toBe(layout(makeBoard()))
  })
})

describe('MOVE_CARD', () => {
  it('reorders downward within a column', () => {
    const next = boardReducer(makeBoard(), {
      type: 'MOVE_CARD',
      cardId: 'a',
      toColumnId: 'todo',
      toIndex: 2,
    })

    expect(layout(next)).toBe('todo[b,c,a] doing[x,y] done[]')
  })

  it('reorders upward within a column', () => {
    const next = boardReducer(makeBoard(), {
      type: 'MOVE_CARD',
      cardId: 'c',
      toColumnId: 'todo',
      toIndex: 0,
    })

    expect(layout(next)).toBe('todo[c,a,b] doing[x,y] done[]')
  })

  it('moves to another column at the given index', () => {
    const next = boardReducer(makeBoard(), {
      type: 'MOVE_CARD',
      cardId: 'a',
      toColumnId: 'doing',
      toIndex: 1,
    })

    expect(layout(next)).toBe('todo[b,c] doing[x,a,y] done[]')
  })

  it('moves into an empty column', () => {
    const next = boardReducer(makeBoard(), {
      type: 'MOVE_CARD',
      cardId: 'b',
      toColumnId: 'done',
      toIndex: 0,
    })

    expect(layout(next)).toBe('todo[a,c] doing[x,y] done[b]')
  })

  it('clamps an index past the end of the column', () => {
    const next = boardReducer(makeBoard(), {
      type: 'MOVE_CARD',
      cardId: 'a',
      toColumnId: 'todo',
      toIndex: 99,
    })

    expect(layout(next)).toBe('todo[b,c,a] doing[x,y] done[]')
  })

  it('ignores an unknown card', () => {
    const next = boardReducer(makeBoard(), {
      type: 'MOVE_CARD',
      cardId: 'missing',
      toColumnId: 'done',
      toIndex: 0,
    })

    expect(layout(next)).toBe(layout(makeBoard()))
  })

  it('ignores an unknown destination column', () => {
    const next = boardReducer(makeBoard(), {
      type: 'MOVE_CARD',
      cardId: 'a',
      toColumnId: 'nope',
      toIndex: 0,
    })

    // The card must not be dropped on the floor just because the
    // destination is bogus.
    expect(layout(next)).toBe(layout(makeBoard()))
  })
})

describe('purity', () => {
  it('does not mutate the board it is given', () => {
    const board = makeBoard()

    boardReducer(board, {
      type: 'MOVE_CARD',
      cardId: 'a',
      toColumnId: 'done',
      toIndex: 0,
    })

    expect(layout(board)).toBe('todo[a,b,c] doing[x,y] done[]')
  })

  it('returns the same result for the same input', () => {
    const action = {
      type: 'MOVE_CARD',
      cardId: 'a',
      toColumnId: 'done',
      toIndex: 0,
    } as const

    expect(layout(boardReducer(makeBoard(), action))).toBe(
      layout(boardReducer(makeBoard(), action)),
    )
  })
})
