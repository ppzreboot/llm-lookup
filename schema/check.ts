import z from 'zod'
import { type I_word_details, z_schema__maybe_word } from './schema.ts'

export
type I_word = {
    is_valid: false
    details: null
} | {
    is_valid: true
    details: I_word_details[]
}

export
function check_result(raw: unknown): raw is I_word {
    try {
        const word = z_schema__maybe_word.parse(raw)
        return (word.is_valid && word.details !== null)
            || (!word.is_valid && word.details === null)
    } catch(err) {
        if (err instanceof z.ZodError)
            return false
        else
            throw err
    }
}

export
function check_en_word(word: string) {
    if (word.length === 0 || word.length > 50) return false
    return /^[A-Za-z]+(-[A-Za-z]+)*$/.test(word)
}
