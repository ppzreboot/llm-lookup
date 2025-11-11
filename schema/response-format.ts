import { z } from 'zod'
import { z_schema__maybe_word } from './schema.ts'

export
function make_format() {
    return {
        type: 'json_schema',
        json_schema: {
            name: '"English word" recognition result',
            strict: true,
            schema: z.toJSONSchema(z_schema__maybe_word, {
                target: 'draft-7',
            }),
        }
    }
}
