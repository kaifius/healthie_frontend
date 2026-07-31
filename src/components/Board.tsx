import type { Board } from '../types'
import { Column } from './Column'
import './Board.css'

type BoardProps = {
  board: Board
}

export function Board({ board }: BoardProps) {
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
