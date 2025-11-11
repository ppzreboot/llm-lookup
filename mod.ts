import { check_en_word, check_result } from './schema/check.ts'
import { I_word_details } from './schema/schema.ts'
import { make_format } from './schema/response-format.ts'

export
type I_error__llm_lookup
    = 'invalid word format'
    | 'llm - invalid word'
    | 'llm - invalid response format'

export
function make_llm_lookup(opts: {
    base_url: string
    model: string
    api_key: string
}) {
    const response_format = make_format()
    return async function llm_lookup(word: string): Promise<[I_error__llm_lookup, null] | [null, I_word_details[]]> {
        if (!check_en_word(word))
            return ['invalid word format', null]
        const response = await fetch(opts.base_url + '/chat/completions', {
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
                        content: 'You are a humble linguistics expert who assists English learners in understanding words accurately. '
                            + 'You have deep knowledge of English morphology, etymology, and usage, but you always acknowledge uncertainty instead of guessing. '
                            + 'If the information about a word’s origin, morphology, or meaning is unclear or disputed, respond with null or an empty list instead of speculation. '
                            + '\nYour task: Analyze the user-provided word and produce a structured JSON object.'
                    },
                    {
                        role: 'user',
                        content: `Teach me this word: "${word}"`,
                    },
                ],
            }),
        })
        const data = await response.json()
        const lookup_result = JSON.parse(data.choices[0].message.content)
        if (check_result(lookup_result)) {
            if (lookup_result.is_valid)
                return [null, lookup_result.details]
            else
                return ['llm - invalid word', null]
        } else
            return ['llm - invalid response format', null]
    }
}
