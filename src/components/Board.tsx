import { useReducer } from 'react'
import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import type { Board } from '../types'
import { boardReducer } from '../state/boardReducer'
import { DONE_COLUMN_ID } from '../data/seedBoard'
import { celebrate } from '../celebrate'
import { Column } from './Column'
import './Board.css'

type BoardProps = {
  /** Only read on first render; later changes to this prop are ignored. */
  initialBoard: Board
}

export function Board({ initialBoard }: BoardProps) {
  const [board, dispatch] = useReducer(boardReducer, initialBoard)

  function handleAddCard(columnId: string, text: string) {
    dispatch({
      type: 'ADD_CARD',
      columnId,
      card: { id: crypto.randomUUID(), text },
    })

    if (columnId === DONE_COLUMN_ID) celebrate()
  }

  function handleDragEnd({ draggableId, source, destination }: DropResult) {
    if (!destination) return // dropped outside a column

    dispatch({
      type: 'MOVE_CARD',
      cardId: draggableId,
      toColumnId: destination.droppableId,
      toIndex: destination.index,
    })

    // Entering Done, not merely being reordered inside it.
    if (
      source.droppableId !== DONE_COLUMN_ID &&
      destination.droppableId === DONE_COLUMN_ID
    ) {
      celebrate()
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
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
    </DragDropContext>
  )
}
