import { useState } from 'react'
import type { Board } from '../types'
import { Column } from './Column'
import './Board.css'

type BoardProps = {
  /** Only read on first render; later changes to this prop are ignored. */
  initialBoard: Board
}

export function Board({ initialBoard }: BoardProps) {
  const [board, setBoard] = useState(initialBoard)

  function handleAddCard(columnId: string, text: string) {
    const card = { id: crypto.randomUUID(), text }

    setBoard((current) => ({
      ...current,
      columns: current.columns.map((column) =>
        column.id === columnId
          ? { ...column, cards: [...column.cards, card] }
          : column,
      ),
    }))
  }

  return (
    <div className="board">
      <header className="board-header">
        <h1 className="board-title">{board.title}</h1>
      </header>

      <div className="board-columns">
        {board.columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            onAddCard={(text) => handleAddCard(column.id, text)}
          />
        ))}
      </div>
    </div>
  )
}
