import { describe, it, expect } from 'vitest'
import rates from '@/utils/stateTaxRates.js'

describe('stateTaxRates', () => {
  it('returns correct rate for CA', () => {
    expect(rates.CA).toBe(0.06)
  })

  it('returns zero for states without sales tax', () => {
    expect(rates.OR).toBe(0)
  })
})
