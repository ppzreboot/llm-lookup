import { assertEquals, assertNotEquals } from '@std/assert'
import { make_llm_lookup } from './mod.ts'

const lookup = make_llm_lookup({
    base_url: 'https://api.x.ai/v1',
    model: 'grok-4-fast-reasoning',
    api_key: Deno.env.get('APIKEY')!,
})

Deno.test('llm_lookup - basic usage', async () => {
    const [err, details] = await lookup('dog')
    assertEquals(err, null)
    assertNotEquals(details, null)
    // console.log(details!.length)
    // console.log(details![0])
})

Deno.test('llm_lookup - invalid word format - 1', async () => {
    const [err, details] = await lookup('')
    assertEquals(err, 'invalid word format')
    assertEquals(details, null)
})
Deno.test('llm_lookup - invalid word format - 2', async () => {
    const [err, details] = await lookup('abc.')
    assertEquals(err, 'invalid word format')
    assertEquals(details, null)
})

Deno.test('llm_lookup - "llm - invalid word"', async () => {
    const [err, details] = await lookup('llll')
    assertEquals(err, 'llm - invalid word')
    assertEquals(details, null)
})
