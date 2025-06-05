import { describe, it, expect } from 'vitest'
import { normalizeNewlines } from '@/composables/useNormalizeNewlines.js'

describe('normalizeNewlines', () => {
  it('converts CRLF to LF', () => {
    const input = 'a\r\nb\r\n'
    expect(normalizeNewlines(input)).toBe('a\nb\n')
  })
})
