import { useState } from 'react'
import type { Board } from '../types'
import { Column } from './Column'
import './Board.css'

type BoardProps = {
  /** Only read on first render; later changes to this prop are ignored. */
  initialBoard: Board
}

export function Board({ initialBoard }: BoardProps) {
  const [board] = useState(initialBoard)

  return (
    <div className="board">
      <header className="board-header">
        <h1 className="board-title">{board.title}</h1>
      </header>

      <div className="board-columns">
        {board.columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}
      </div>
    </div>
  )
}
