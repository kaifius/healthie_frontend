import type { Board, Card, Column } from '../types'

/** An action that changes the board, and that undo knows how to reverse. */
export type UndoableAction =
  | {
      type: 'ADD_CARD'
      columnId: string
      /** Built by the caller so the reducer stays pure. */
      card: Card
    }
  | {
      type: 'MOVE_CARD'
      cardId: string
      /** Where the card came from — only used to reverse the move. */
      fromColumnId: string
      /** Index within the source column *before* the card is removed. */
      fromIndex: number
      toColumnId: string
      /** Index within the destination column *after* the card is removed. */
      toIndex: number
    }

export type BoardAction = UndoableAction | { type: 'UNDO' }

export type BoardState = {
  board: Board
  /** Applied actions, oldest first. The last one is the next to be undone. */
  history: UndoableAction[]
}

export function createBoardState(board: Board): BoardState {
  return { board, history: [] }
}

export function findColumnByCardId(
  board: Board,
  cardId: string,
): Column | undefined {
  return board.columns.find((column) =>
    column.cards.some((card) => card.id === cardId),
  )
}

export function findCard(board: Board, cardId: string): Card | undefined {
  return findColumnByCardId(board, cardId)?.cards.find(
    (card) => card.id === cardId,
  )
}

function insertAt(cards: Card[], index: number, card: Card): Card[] {
  const updatedCards = [...cards]
  updatedCards.splice(Math.min(Math.max(index, 0), updatedCards.length), 0, card)
  return updatedCards
}

/** Returns the board unchanged if the action cannot be applied. */
function applyAction(board: Board, action: UndoableAction): Board {
  switch (action.type) {
    case 'ADD_CARD': {
      const columnExists = board.columns.some(
        (column) => column.id === action.columnId,
      )
      if (!columnExists) return board

      return {
        ...board,
        columns: board.columns.map((column) =>
          column.id === action.columnId
            ? { ...column, cards: [...column.cards, action.card] }
            : column,
        ),
      }
    }

    case 'MOVE_CARD': {
      const card = findCard(board, action.cardId)
      if (!card) return board

      const destinationExists = board.columns.some(
        (column) => column.id === action.toColumnId,
      )
      if (!destinationExists) return board

      // Remove first, then insert — so a move within one column and a move
      // across two are the same operation.
      const withoutCard = board.columns.map((column) => ({
        ...column,
        cards: column.cards.filter((c) => c.id !== action.cardId),
      }))

      return {
        ...board,
        columns: withoutCard.map((column) =>
          column.id === action.toColumnId
            ? { ...column, cards: insertAt(column.cards, action.toIndex, card) }
            : column,
        ),
      }
    }

    default:
      return board
  }
}

/**
 * Applies the opposite of an action. Only correct for the action that was
 * applied last, which is the only one undo ever reverses.
 */
function reverseAction(board: Board, action: UndoableAction): Board {
  switch (action.type) {
    case 'ADD_CARD':
      return {
        ...board,
        columns: board.columns.map((column) =>
          column.id === action.columnId
            ? {
                ...column,
                cards: column.cards.filter((card) => card.id !== action.card.id),
              }
            : column,
        ),
      }

    case 'MOVE_CARD':
      // Put it back where it came from: the same move, the other way.
      return applyAction(board, {
        type: 'MOVE_CARD',
        cardId: action.cardId,
        fromColumnId: action.toColumnId,
        fromIndex: action.toIndex,
        toColumnId: action.fromColumnId,
        toIndex: action.fromIndex,
      })
  }
}

export function boardReducer(
  state: BoardState,
  action: BoardAction,
): BoardState {
  if (action.type === 'UNDO') {
    const lastAction = state.history.at(-1)
    if (!lastAction) return state

    return {
      board: reverseAction(state.board, lastAction),
      history: state.history.slice(0, -1),
    }
  }

  const board = applyAction(state.board, action)

  // A no-op action must not cost an undo step.
  if (board === state.board) return state

  return { board, history: [...state.history, action] }
}
