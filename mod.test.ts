import { assertEquals, assertNotEquals } from '@std/assert'
import { make_llm_lookup } from './mod.ts'

Deno.test('llm_lookup - basic usage', async () => {
    const lookup = make_llm_lookup({
        base_url: 'https://api.x.ai/v1',
        model: 'grok-4-fast-reasoning',
        api_key: Deno.env.get('APIKEY')!,
    })
    const [err, details] = await lookup('hello')
    assertEquals(err, null)
    assertNotEquals(details, null)
})
