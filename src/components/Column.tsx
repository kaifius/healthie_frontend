import { Droppable } from '@hello-pangea/dnd'
import type { Column } from '../types'
import type { CharactersState } from '../hooks/useCharacters'
import { Card } from './Card'
import { AddCardForm } from './AddCardForm'
import './Column.css'

type ColumnProps = {
  column: Column
  characters: CharactersState
  onAddCard: (text: string, characterId: string) => void
}

export function Column({ column, characters, onAddCard }: ColumnProps) {
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
              <Card
                key={card.id}
                card={card}
                index={index}
                character={characters.byId.get(card.characterId)}
              />
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>

      <AddCardForm characters={characters} onAddCard={onAddCard} />
    </section>
  )
}
