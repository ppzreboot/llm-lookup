import { check_en_word, check_result, type I_word } from './schema/check.ts'
import { make_format } from './schema/response-format.ts'
import type { I_error__llm_lookup } from './error.ts'

export
function make_llm_lookup(opts: {
    base_url: string
    model: string
    api_key: string
}): (word: string) =>
    Promise<[I_error__llm_lookup, null] | [null, {
        word: I_word
        body: object // typeof(body) === 'object' && body !== null
    }]> {
    const response_format = make_format()
    return async function llm_lookup(word) {
        if (!check_en_word(word))
            return [{ key: 'invalid word format', details: null }, null]
        let response: Response
        try {
            response = await _request(word)
        } catch(err) {
            return [{ key: 'network error', details: err as Error }, null]
        }
        if (!response.ok)
            return [{ key: 'llm call error', details: response }, null]
        let raw_body: string
        try {
            raw_body = await response.text()
        } catch(err) {
            return [{ key: 'failed to read response body', details: err as Error }, null]
        }
        const [invalid_body, data] = parse_json(raw_body)
        if (invalid_body)
            return [{ key: 'failed to parse json', details: {
                type: 'response',
                err: data,
            }}, null]
        const [invalid_content, lookup_result] = parse_json(
            // @ts-ignore:
            data?.choices?.[0]?.message?.content
        )
        if (invalid_content)
            return [{ key: 'failed to parse json', details: {
                type: 'content',
                err: lookup_result,
            }}, null]
        if (check_result(lookup_result))
            return [null, {
                word: lookup_result,
                body: data as object,
            }]
        else
            return [{
                key: 'wrong format of structured outputs',
                details: lookup_result,
            }, null]
    }

    async function _request(word: string) {
        return await fetch(opts.base_url + '/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${opts.api_key}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: opts.model,
                response_format,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a humble linguistics expert who assists Chinese-speaking English learners in understanding words accurately. '
                            + 'You have deep knowledge of English morphology, etymology, and usage, but you always acknowledge uncertainty instead of guessing. '
                            + 'If the information about a word’s origin, morphology, or meaning is unclear or disputed, respond with null or an empty list instead of speculation. '
                            + '\nYour task: Analyze the user-provided English word and produce a structured JSON object following the schema. '
                    },
                    {
                        role: 'user',
                        content: `请帮我讲解这个单词: "${word}"`,
                    },
                ],
            }),
        })
    }
}

function parse_json(raw: string): [true, SyntaxError] | [false, unknown] {
    try {
        return [false, JSON.parse(raw)]
    } catch(err) {
        return [true, err as SyntaxError]
    }
}
