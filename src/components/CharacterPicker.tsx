import type { CharactersState } from '../hooks/useCharacters'
import './CharacterPicker.css'

type CharacterPickerProps = {
  characters: CharactersState
  value: string
  onChange: (characterId: string) => void
}

export function CharacterPicker({
  characters,
  value,
  onChange,
}: CharacterPickerProps) {
  const { list, loading, error } = characters

  return (
    <div className="character-picker">
      <select
        className="character-picker-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={loading || error !== null}
        aria-label="Assign a character"
      >
        <option value="">
          {loading ? 'Loading characters…' : 'Assign a character…'}
        </option>
        {list.map((character) => (
          <option key={character.id} value={character.id}>
            {character.name}
          </option>
        ))}
      </select>

      {error && (
        <p className="character-picker-error" role="alert">
          Couldn't load characters: {error}
        </p>
      )}
    </div>
  )
}
