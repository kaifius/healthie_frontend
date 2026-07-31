import { useState, type FormEvent } from 'react'
import './AddCardForm.css'

type AddCardFormProps = {
  onAddCard: (text: string) => void
}

export function AddCardForm({ onAddCard }: AddCardFormProps) {
  const [text, setText] = useState('')
  const trimmed = text.trim()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!trimmed) return

    onAddCard(trimmed)
    setText('')
  }

  return (
    <form className="add-card-form" onSubmit={handleSubmit}>
      <input
        className="add-card-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Add a card…"
        aria-label="New card text"
      />
      <button className="add-card-button" type="submit" disabled={!trimmed}>
        Add
      </button>
    </form>
  )
}
