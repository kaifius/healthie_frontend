import { Droppable } from '@hello-pangea/dnd'
import type { Column } from '../types'
import { Card } from './Card'
import { AddCardForm } from './AddCardForm'
import './Column.css'

type ColumnProps = {
  column: Column
  onAddCard: (text: string) => void
}

export function Column({ column, onAddCard }: ColumnProps) {
  return (
    <section className="column">
      <header className="column-header">
        <h2 className="column-title">{column.title}</h2>
        <span className="column-count">{column.cards.length}</span>
      </header>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <ul
            ref={provided.innerRef}
            className={
              snapshot.isDraggingOver
                ? 'column-cards column-cards--over'
                : 'column-cards'
            }
            {...provided.droppableProps}
          >
            {column.cards.map((card, index) => (
              <Card key={card.id} card={card} index={index} />
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>

      <AddCardForm onAddCard={onAddCard} />
    </section>
  )
}
