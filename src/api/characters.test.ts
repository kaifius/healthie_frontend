import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchCharacters } from './characters'

const RICK = {
  id: '1',
  name: 'Rick Sanchez',
  image: 'https://example.test/1.jpeg',
  species: 'Human',
  status: 'Alive',
}

/** Stubs global fetch with one canned response. */
function stubFetch(body: unknown, init: { ok?: boolean; status?: number } = {}) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: () => Promise.resolve(body),
  })

  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchCharacters', () => {
  it('returns the characters from a successful response', async () => {
    stubFetch({ data: { characters: { results: [RICK] } } })

    await expect(fetchCharacters(null)).resolves.toEqual([RICK])
  })

  it('sends the name through as a GraphQL variable', async () => {
    const fetchMock = stubFetch({ data: { characters: { results: [] } } })

    await fetchCharacters('morty')

    const [, options] = fetchMock.mock.calls[0]
    expect(JSON.parse(options.body).variables).toEqual({ name: 'morty' })
  })

  it('throws on a failed HTTP response', async () => {
    stubFetch({}, { ok: false, status: 500 })

    await expect(fetchCharacters(null)).rejects.toThrow('500')
  })

  // GraphQL reports failures with a 200 and an errors array.
  it('throws when the body carries GraphQL errors', async () => {
    stubFetch({ errors: [{ message: 'Bad filter' }] })

    await expect(fetchCharacters(null)).rejects.toThrow('Bad filter')
  })

  it('throws when the body has no data', async () => {
    stubFetch({})

    await expect(fetchCharacters(null)).rejects.toThrow('no data')
  })

  // A filter matching nothing is an empty result, not a failure.
  it('returns an empty array when characters is null', async () => {
    stubFetch({ data: { characters: null } })

    await expect(fetchCharacters('zzzzzz')).resolves.toEqual([])
  })
})
