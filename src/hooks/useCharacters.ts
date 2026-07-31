import { useEffect, useMemo, useState } from 'react'
import type { Character } from '../types'
import { fetchCharacters } from '../api/characters'

export type CharactersState = {
  /** For the picker, in the order the API returned them. */
  list: Character[]
  /** For resolving the `characterId` stored on a card. */
  byId: Map<string, Character>
  loading: boolean
  error: string | null
}

export function useCharacters(): CharactersState {
  const [list, setList] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Aborts on unmount, and on StrictMode's deliberate double-run in dev.
    const controller = new AbortController()

    fetchCharacters(controller.signal)
      .then((characters) => {
        setList(characters)
        setError(null)
        setLoading(false)
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return
        setError(cause instanceof Error ? cause.message : 'Unknown error')
        setLoading(false)
      })

    return () => controller.abort()
  }, [])

  const byId = useMemo(
    () => new Map(list.map((character) => [character.id, character])),
    [list],
  )

  return { list, byId, loading, error }
}
