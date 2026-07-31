import { describe, expect, it } from 'vitest'
import { DONE_COLUMN_ID, isEnteringDone, seedBoard } from './seedBoard'

describe('isEnteringDone', () => {
  it('is true when a card arrives in Done', () => {
    expect(isEnteringDone('todo', DONE_COLUMN_ID)).toBe(true)
    expect(isEnteringDone('doing', DONE_COLUMN_ID)).toBe(true)
  })

  it('is false when a card is reordered within Done', () => {
    expect(isEnteringDone(DONE_COLUMN_ID, DONE_COLUMN_ID)).toBe(false)
  })

  it('is false when a card leaves Done', () => {
    expect(isEnteringDone(DONE_COLUMN_ID, 'doing')).toBe(false)
  })

  it('is false for a move that does not involve Done', () => {
    expect(isEnteringDone('todo', 'doing')).toBe(false)
  })
})

describe('seedBoard', () => {
  const columns = seedBoard.columns
  const cards = columns.flatMap((column) => column.cards)

  it('has a column matching DONE_COLUMN_ID', () => {
    expect(columns.some((column) => column.id === DONE_COLUMN_ID)).toBe(true)
  })

  // Duplicate ids would surface as a confusing drag bug rather than an error.
  it('gives every column a unique id', () => {
    const ids = columns.map((column) => column.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every card a unique id', () => {
    const ids = cards.map((card) => card.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('assigns every card a character', () => {
    expect(cards.every((card) => card.characterId !== '')).toBe(true)
  })
})
