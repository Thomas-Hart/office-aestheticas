import { describe, it, expect } from 'vitest'
import { tagDescriptions } from '@/utils/tagDescriptions.js'

describe('tagDescriptions', () => {
  it('includes desks and tables description', () => {
    expect(tagDescriptions.DESKS_AND_TABLES).toBe('Desks and Tables')
  })
})
