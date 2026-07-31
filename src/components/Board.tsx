import { useReducer } from 'react'
import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import type { Board } from '../types'
import { boardReducer } from '../state/boardReducer'
import { useCharacters } from '../hooks/useCharacters'
import { DONE_COLUMN_ID, isEnteringDone } from '../data/seedBoard'
import { celebrate } from '../celebrate'
import { Column } from './Column'
import './Board.css'

type BoardProps = {
  /** Only read on first render; later changes to this prop are ignored. */
  initialBoard: Board
}

export function Board({ initialBoard }: BoardProps) {
  const [board, dispatch] = useReducer(boardReducer, initialBoard)
  const characters = useCharacters()

  function handleAddCard(columnId: string, text: string, characterId: string) {
    dispatch({
      type: 'ADD_CARD',
      columnId,
      card: { id: crypto.randomUUID(), text, characterId },
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

    if (isEnteringDone(source.droppableId, destination.droppableId)) {
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
              characters={characters}
              onAddCard={(text, characterId) =>
                handleAddCard(column.id, text, characterId)
              }
            />
          ))}
        </div>
      </div>
    </DragDropContext>
  )
}
