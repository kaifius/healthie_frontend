import type { Character } from '../types'

const ENDPOINT = 'https://rickandmortyapi.com/graphql'

/** First page only — 20 of 826. Enough to pick from without paging. */
const QUERY = `
  query Characters {
    characters {
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
  data?: { characters: { results: Character[] } }
  errors?: { message: string }[]
}

export async function fetchCharacters(
  signal?: AbortSignal,
): Promise<Character[]> {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY }),
    signal,
  })

  if (!response.ok) {
    throw new Error(`Character request failed (${response.status})`)
  }

  // GraphQL reports its own errors with a 200, so the body still needs checking.
  const body = (await response.json()) as CharactersResponse

  if (body.errors?.length) throw new Error(body.errors[0].message)
  if (!body.data) throw new Error('Character request returned no data')

  return body.data.characters.results
}
