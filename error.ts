export
type I_error__llm_lookup
    = { key: 'invalid word format', details: null }
    | { key: 'network error', details: Error }
    | { key: 'llm call error', details: Response }
    | { key: 'failed to read response body', details: Error }
    | { key: 'failed to parse json', details: {
        type: 'response' | 'content'
        err: SyntaxError
    }}
    | { key: 'wrong format of structured outputs', details: unknown }
