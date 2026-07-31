export type Card = {
  id: string
  text: string
}

export type Column = {
  id: string
  title: string
  /** Array order is the top-to-bottom order of cards in the column. */
  cards: Card[]
}

export type Board = {
  title: string
  /** Array order is the left-to-right order of columns on the board. */
  columns: Column[]
}
