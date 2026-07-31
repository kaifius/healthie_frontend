import { Draggable } from '@hello-pangea/dnd'
import type { Card, Character } from '../types'
import './Card.css'

type CardProps = {
  card: Card
  index: number
  /** Undefined while characters are still loading, or if the fetch failed. */
  character: Character | undefined
}

export function Card({ card, index, character }: CardProps) {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <li
          ref={provided.innerRef}
          className={snapshot.isDragging ? 'card card--dragging' : 'card'}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <p className="card-text">{card.text}</p>

          {character && (
            <span className="card-character">
              <img
                className="card-avatar"
                src={character.image}
                alt=""
                width={24}
                height={24}
              />
              {character.name}
            </span>
          )}
        </li>
      )}
    </Draggable>
  )
}
