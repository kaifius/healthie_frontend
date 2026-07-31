import type { Character } from '../types'

const ENDPOINT = 'https://rickandmortyapi.com/graphql'

/**
 * Returns the first page of matches — 20 at most, out of 826.
 * A null name means no filter, i.e. the first page of everything.
 */
const QUERY = `
  query Characters($name: String) {
    characters(filter: { name: $name }) {
      results {
        id
        name
        image
        species
        status
      }
    }
  }
`

type CharactersResponse = {
  data?: { characters: { results: Character[] } | null }
  errors?: { message: string }[]
}

export async function fetchCharacters(
  name: string | null,
  signal?: AbortSignal,
): Promise<Character[]> {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY, variables: { name } }),
    signal,
  })

  if (!response.ok) {
    throw new Error(`Character request failed (${response.status})`)
  }

  // GraphQL reports its own errors with a 200, so the body still needs checking.
  const body = (await response.json()) as CharactersResponse

  if (body.errors?.length) throw new Error(body.errors[0].message)
  if (!body.data) throw new Error('Character request returned no data')

  return body.data.characters?.results ?? []
}
