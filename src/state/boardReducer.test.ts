import { describe, expect, it } from 'vitest'
import type { Board } from '../types'
import {
  boardReducer,
  createBoardState,
  type BoardAction,
  type BoardState,
  type UndoableAction,
} from './boardReducer'

function makeBoard(): Board {
  return {
    title: 'Test Board',
    columns: [
      {
        id: 'todo',
        title: 'To Do',
        cards: [
          { id: 'a', text: 'a', characterId: 'cha' },
          { id: 'b', text: 'b', characterId: 'chb' },
          { id: 'c', text: 'c', characterId: 'chc' },
        ],
      },
      {
        id: 'doing',
        title: 'Doing',
        cards: [
          { id: 'x', text: 'x', characterId: 'chx' },
          { id: 'y', text: 'y', characterId: 'chy' },
        ],
      },
      { id: 'done', title: 'Done', cards: [] },
    ],
  }
}

function makeState(): BoardState {
  return createBoardState(makeBoard())
}

/** Runs actions in order, starting from a fresh board. */
function apply(...actions: BoardAction[]): BoardState {
  return actions.reduce(boardReducer, makeState())
}

/** Compact view of where every card sits, e.g. `todo[a,b] doing[x] done[]`. */
function layout(board: Board): string {
  return board.columns
    .map((column) => `${column.id}[${column.cards.map((c) => c.id).join(',')}]`)
    .join(' ')
}

describe('ADD_CARD', () => {
  it('appends the card to the named column', () => {
    const next = apply({
      type: 'ADD_CARD',
      columnId: 'doing',
      card: { id: 'new', text: 'new', characterId: 'chnew' },
    })

    expect(layout(next.board)).toBe('todo[a,b,c] doing[x,y,new] done[]')
  })

  it('adds to an empty column', () => {
    const next = apply({
      type: 'ADD_CARD',
      columnId: 'done',
      card: { id: 'new', text: 'new', characterId: 'chnew' },
    })

    expect(layout(next.board)).toBe('todo[a,b,c] doing[x,y] done[new]')
  })

  it('ignores an unknown column', () => {
    const next = apply({
      type: 'ADD_CARD',
      columnId: 'nope',
      card: { id: 'new', text: 'new', characterId: 'chnew' },
    })

    expect(layout(next.board)).toBe(layout(makeBoard()))
  })
})

describe('MOVE_CARD', () => {
  it('reorders downward within a column', () => {
    const next = apply({
      type: 'MOVE_CARD',
      cardId: 'a',
      fromColumnId: 'todo',
      fromIndex: 0,
      toColumnId: 'todo',
      toIndex: 2,
    })

    expect(layout(next.board)).toBe('todo[b,c,a] doing[x,y] done[]')
  })

  it('reorders upward within a column', () => {
    const next = apply({
      type: 'MOVE_CARD',
      cardId: 'c',
      fromColumnId: 'todo',
      fromIndex: 2,
      toColumnId: 'todo',
      toIndex: 0,
    })

    expect(layout(next.board)).toBe('todo[c,a,b] doing[x,y] done[]')
  })

  it('moves to another column at the given index', () => {
    const next = apply({
      type: 'MOVE_CARD',
      cardId: 'a',
      fromColumnId: 'todo',
      fromIndex: 0,
      toColumnId: 'doing',
      toIndex: 1,
    })

    expect(layout(next.board)).toBe('todo[b,c] doing[x,a,y] done[]')
  })

  it('moves into an empty column', () => {
    const next = apply({
      type: 'MOVE_CARD',
      cardId: 'b',
      fromColumnId: 'todo',
      fromIndex: 1,
      toColumnId: 'done',
      toIndex: 0,
    })

    expect(layout(next.board)).toBe('todo[a,c] doing[x,y] done[b]')
  })

  it('clamps an index past the end of the column', () => {
    const next = apply({
      type: 'MOVE_CARD',
      cardId: 'a',
      fromColumnId: 'todo',
      fromIndex: 0,
      toColumnId: 'todo',
      toIndex: 99,
    })

    expect(layout(next.board)).toBe('todo[b,c,a] doing[x,y] done[]')
  })

  it('ignores an unknown card', () => {
    const next = apply({
      type: 'MOVE_CARD',
      cardId: 'missing',
      fromColumnId: 'todo',
      fromIndex: 0,
      toColumnId: 'done',
      toIndex: 0,
    })

    expect(layout(next.board)).toBe(layout(makeBoard()))
  })

  it('ignores an unknown destination column', () => {
    const next = apply({
      type: 'MOVE_CARD',
      cardId: 'a',
      fromColumnId: 'todo',
      fromIndex: 0,
      toColumnId: 'nope',
      toIndex: 0,
    })

    // The card must not be dropped on the floor just because the
    // destination is bogus.
    expect(layout(next.board)).toBe(layout(makeBoard()))
  })
})

describe('history', () => {
  it('starts empty', () => {
    expect(makeState().history).toEqual([])
  })

  it('records applied actions, oldest first', () => {
    const add: BoardAction = {
      type: 'ADD_CARD',
      columnId: 'done',
      card: { id: 'new', text: 'new', characterId: 'chnew' },
    }
    const move: BoardAction = {
      type: 'MOVE_CARD',
      cardId: 'a',
      fromColumnId: 'todo',
      fromIndex: 0,
      toColumnId: 'doing',
      toIndex: 0,
    }

    expect(apply(add, move).history).toEqual([add, move])
  })

  it('does not record an action that changed nothing', () => {
    const next = apply({
      type: 'ADD_CARD',
      columnId: 'nope',
      card: { id: 'new', text: 'new', characterId: 'chnew' },
    })

    expect(next.history).toEqual([])
  })

  it('keeps the same state object when nothing changed', () => {
    const state = makeState()

    expect(
      boardReducer(state, {
        type: 'MOVE_CARD',
        cardId: 'missing',
        fromColumnId: 'todo',
        fromIndex: 0,
        toColumnId: 'done',
        toIndex: 0,
      }),
    ).toBe(state)
  })
})

describe('UNDO', () => {
  const UNDO = { type: 'UNDO' } as const

  it('removes a card that was added', () => {
    const next = apply(
      {
        type: 'ADD_CARD',
        columnId: 'doing',
        card: { id: 'new', text: 'new', characterId: 'chnew' },
      },
      UNDO,
    )

    expect(layout(next.board)).toBe(layout(makeBoard()))
  })

  it('puts a card moved to another column back at its old index', () => {
    const next = apply(
      {
        type: 'MOVE_CARD',
        cardId: 'b',
        fromColumnId: 'todo',
        fromIndex: 1,
        toColumnId: 'done',
        toIndex: 0,
      },
      UNDO,
    )

    expect(layout(next.board)).toBe(layout(makeBoard()))
  })

  it('undoes a reorder downward within a column', () => {
    const next = apply(
      {
        type: 'MOVE_CARD',
        cardId: 'a',
        fromColumnId: 'todo',
        fromIndex: 0,
        toColumnId: 'todo',
        toIndex: 2,
      },
      UNDO,
    )

    expect(layout(next.board)).toBe(layout(makeBoard()))
  })

  it('undoes a reorder upward within a column', () => {
    const next = apply(
      {
        type: 'MOVE_CARD',
        cardId: 'c',
        fromColumnId: 'todo',
        fromIndex: 2,
        toColumnId: 'todo',
        toIndex: 0,
      },
      UNDO,
    )

    expect(layout(next.board)).toBe(layout(makeBoard()))
  })

  it('drops the undone action from the history', () => {
    const add: UndoableAction = {
      type: 'ADD_CARD',
      columnId: 'doing',
      card: { id: 'new', text: 'new', characterId: 'chnew' },
    }
    const move: UndoableAction = {
      type: 'MOVE_CARD',
      cardId: 'a',
      fromColumnId: 'todo',
      fromIndex: 0,
      toColumnId: 'done',
      toIndex: 0,
    }

    expect(apply(add, move, UNDO).history).toEqual([add])
  })

  it('is not itself recorded in the history', () => {
    const next = apply(
      {
        type: 'ADD_CARD',
        columnId: 'doing',
        card: { id: 'new', text: 'new', characterId: 'chnew' },
      },
      UNDO,
    )

    expect(next.history).toEqual([])
  })

  it('walks back through several actions, newest first', () => {
    const state = apply(
      {
        type: 'ADD_CARD',
        columnId: 'done',
        card: { id: 'new', text: 'new', characterId: 'chnew' },
      },
      {
        type: 'MOVE_CARD',
        cardId: 'a',
        fromColumnId: 'todo',
        fromIndex: 0,
        toColumnId: 'doing',
        toIndex: 0,
      },
      {
        type: 'MOVE_CARD',
        cardId: 'y',
        fromColumnId: 'doing',
        fromIndex: 2,
        toColumnId: 'todo',
        toIndex: 1,
      },
    )
    expect(layout(state.board)).toBe('todo[b,y,c] doing[a,x] done[new]')

    const once = boardReducer(state, UNDO)
    expect(layout(once.board)).toBe('todo[b,c] doing[a,x,y] done[new]')

    const twice = boardReducer(once, UNDO)
    expect(layout(twice.board)).toBe('todo[a,b,c] doing[x,y] done[new]')

    const thrice = boardReducer(twice, UNDO)
    expect(layout(thrice.board)).toBe(layout(makeBoard()))
    expect(thrice.history).toEqual([])
  })

  it('does nothing when there is nothing to undo', () => {
    const state = makeState()

    expect(boardReducer(state, UNDO)).toBe(state)
  })

  it('does not mutate the state it is given', () => {
    const state = apply({
      type: 'ADD_CARD',
      columnId: 'doing',
      card: { id: 'new', text: 'new', characterId: 'chnew' },
    })

    boardReducer(state, UNDO)

    expect(layout(state.board)).toBe('todo[a,b,c] doing[x,y,new] done[]')
    expect(state.history).toHaveLength(1)
  })
})

describe('purity', () => {
  it('does not mutate the board it is given', () => {
    const state = makeState()

    boardReducer(state, {
      type: 'MOVE_CARD',
      cardId: 'a',
      fromColumnId: 'todo',
      fromIndex: 0,
      toColumnId: 'done',
      toIndex: 0,
    })

    expect(layout(state.board)).toBe('todo[a,b,c] doing[x,y] done[]')
    expect(state.history).toEqual([])
  })

  it('returns the same result for the same input', () => {
    const action = {
      type: 'MOVE_CARD',
      cardId: 'a',
      fromColumnId: 'todo',
      fromIndex: 0,
      toColumnId: 'done',
      toIndex: 0,
    } as const

    expect(layout(boardReducer(makeState(), action).board)).toBe(
      layout(boardReducer(makeState(), action).board),
    )
  })
})
