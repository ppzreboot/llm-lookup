import { assert, assertEquals, assertNotEquals } from '@std/assert'
import { make_llm_lookup } from './mod.ts'

const api_key = Deno.env.get('APIKEY')!

Deno.test('test for test - api key', () => {
    assertNotEquals(api_key, '')
    assertNotEquals(api_key, undefined)
})

const lookup = make_llm_lookup({
    api_key,
    base_url: 'https://api.x.ai/v1',
    model: 'grok-4-fast-reasoning',
})

Deno.test('llm_lookup - basic usage', async () => {
    const [err, result] = await lookup('dog')
    assert(err === null)
    assert(result.word.is_valid === true)
    assert(result.word.details instanceof Array)
})

Deno.test('llm_lookup - invalid word format - 1', async () => {
    const [err, result] = await lookup('')
    assert(err !== null)
    assert(err.key === 'invalid word format')
    assert(result === null)
})
Deno.test('llm_lookup - invalid word format - 2', async () => {
    const [err, result] = await lookup('abc.')
    assert(err !== null)
    assert(err.key === 'invalid word format')
    assert(result === null)
})

Deno.test('llm_lookup - unreal English word', async () => {
    const [err, result] = await lookup('llll')
    assert(err === null)
    assert(result.word.is_valid === false)
    assert(result.word.details === null)
})

Deno.test('llm_lookup - inflected => canonical - 1', async () => {
    const [err, result] = await lookup('went')
    assert(err === null)
    assert(result.word.is_valid)
    assert(result.word.details[0].canonical === 'go')
})

Deno.test('llm_lookup - inflected => canonical - 2', async () => {
    const [err, result] = await lookup('heroes')
    assert(err === null)
    assert(result.word.is_valid)
    assert(result.word.details[0].canonical === 'hero')
    // console.log(result.word.details)
})

Deno.test('llm_lookup - Homograph word - 1', async () => {
    const [err, result] = await lookup('tear')
    assert(err === null)
    assert(result.word.is_valid)
    assert(result.word.details.length > 1)
})

Deno.test('llm_lookup - Homograph word - 2', async () => {
    const [err, result] = await lookup('present')
    assert(err === null)
    assert(result.word.is_valid)
    assert(result.word.details.length > 1)
})
