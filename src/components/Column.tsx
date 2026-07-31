import type { Column } from '../types'
import { Card } from './Card'
import './Column.css'

type ColumnProps = {
  column: Column
}

export function Column({ column }: ColumnProps) {
  return (
    <section className="column">
      <header className="column-header">
        <h2 className="column-title">{column.title}</h2>
        <span className="column-count">{column.cards.length}</span>
      </header>

      <ul className="column-cards">
        {column.cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </ul>
    </section>
  )
}
