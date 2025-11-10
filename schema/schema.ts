import { z } from 'zod'

export
const z_schema__word_details = z.object({
    canonical: z.string().describe('the canonical form if the queried word is an inflected form, e.g., "running" → "run", "dogs" → "dog", "faster" → "fast"'),
    root_and_affixes: z.object({
        root: z.string().describe('the root or stem of the word'),
        prefixes: z.array(z.string()).describe('the prefixes of the word, e.g., "un-" for "unhappy"'),
        suffixes: z.array(z.string()).describe('the suffixes of the word, e.g., "-ly" for "quickly"'),
    }).nullable().describe('null if the word is a root or has no affixes'),
    meaning: z.array(
        z.object({
            definition: z.string().describe('Dictionary-style explanation'),
            example: z.string().describe('an example sentence using the word'),
        })
    ),
    mnemonic: z.string().describe('Creative associative memory technique'),
    word_family: z.array(z.string()).describe('Related words derived from the base word or compound components'),
})

export
type I_word_details = z.infer<typeof z_schema__word_details>

export
const z_schema__maybe_word = z.object({
    is_valid: z.boolean().describe('Whether this is a valid English word'),
    details: z.array(z_schema__word_details).nullable()
        .describe(
            'An array of detailed analyses for the input word.    '
            + 'Each element corresponds to a distinct base word that shares the same spelling but may have a different origin (i.e., homographs or same-spelling words with different derivations).    '
            + 'Most words have a single origin. Only provide multiple elements in the details array if the spelling genuinely corresponds to multiple base words with different origins.    '
            + 'If the input is not a valid English word, this field is null.'
        ),
})

export
type I_maybe_word = z.infer<typeof z_schema__maybe_word>
