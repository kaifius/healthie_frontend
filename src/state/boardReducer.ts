import type { Board, Card, Column } from '../types'

export type BoardAction =
  | {
      type: 'ADD_CARD'
      columnId: string
      /** Built by the caller so the reducer stays pure. */
      card: Card
    }
  | {
      type: 'MOVE_CARD'
      cardId: string
      toColumnId: string
      /** Index within the destination column *after* the card is removed. */
      toIndex: number
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

export function boardReducer(board: Board, action: BoardAction): Board {
  switch (action.type) {
    case 'ADD_CARD':
      return {
        ...board,
        columns: board.columns.map((column) =>
          column.id === action.columnId
            ? { ...column, cards: [...column.cards, action.card] }
            : column,
        ),
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
