import { useState, type FormEvent } from 'react'
import type { CharactersState } from '../hooks/useCharacters'
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

      <select
        className="add-card-select"
        value={characterId}
        onChange={(event) => setCharacterId(event.target.value)}
        disabled={characters.loading || characters.error !== null}
        aria-label="Assign a character"
      >
        <option value="">
          {characters.loading ? 'Loading characters…' : 'Assign a character…'}
        </option>
        {characters.list.map((character) => (
          <option key={character.id} value={character.id}>
            {character.name}
          </option>
        ))}
      </select>

      {characters.error && (
        <p className="add-card-error" role="alert">
          Couldn’t load characters: {characters.error}
        </p>
      )}

      <button className="add-card-button" type="submit" disabled={!canSubmit}>
        Add card
      </button>
    </form>
  )
}
