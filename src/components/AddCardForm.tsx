import { useState, type FormEvent } from 'react'
import type { CharactersState } from '../hooks/useCharacters'
import { CharacterPicker } from './CharacterPicker'
import './AddCardForm.css'

type AddCardFormProps = {
  characters: CharactersState
  onAddCard: (text: string, characterId: string) => void
}

export function AddCardForm({ characters, onAddCard }: AddCardFormProps) {
  const [text, setText] = useState('')
  const [characterId, setCharacterId] = useState('')

  const trimmed = text.trim()
  // Every card must have a character, so both fields are required.
  const canSubmit = trimmed !== '' && characterId !== ''

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!canSubmit) return

    onAddCard(trimmed, characterId)
    setText('')
    setCharacterId('')
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

      <CharacterPicker
        characters={characters}
        value={characterId}
        onChange={setCharacterId}
      />

      <button className="add-card-button" type="submit" disabled={!canSubmit}>
        Add card
      </button>
    </form>
  )
}
