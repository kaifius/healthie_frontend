import type { Card } from '../types'
import './Card.css'

type CardProps = {
  card: Card
}

export function Card({ card }: CardProps) {
  return <li className="card">{card.text}</li>
}
