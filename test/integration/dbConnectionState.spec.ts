import { describe, it, expect } from 'vitest'
import { getConnectionCount, incrementConnectionCount, decrementConnectionCount } from '@/server/utils/dbConnectionState.js'

describe('dbConnectionState', () => {
  it('increments and decrements connection count', () => {
    expect(getConnectionCount()).toBe(0)
    incrementConnectionCount()
    expect(getConnectionCount()).toBe(1)
    decrementConnectionCount()
    expect(getConnectionCount()).toBe(0)
  })
})
