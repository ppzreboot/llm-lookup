import { assertEquals } from '@std/assert'
import { check_result } from './check.ts'

Deno.test('check_result - basic', () => {
    assertEquals(true,
        check_result({
            is_valid: false,
            details: null,
        })
    )
    assertEquals(false,
        check_result({
            is_valid: true,
            details: null,
        })
    )
})
