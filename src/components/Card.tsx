import { Draggable } from '@hello-pangea/dnd'
import type { Card } from '../types'
import './Card.css'

type CardProps = {
  card: Card
  index: number
}

export function Card({ card, index }: CardProps) {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <li
          ref={provided.innerRef}
          className={snapshot.isDragging ? 'card card--dragging' : 'card'}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {card.text}
        </li>
      )}
    </Draggable>
  )
}
