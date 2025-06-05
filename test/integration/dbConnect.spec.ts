import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('mongoose', () => ({
  default: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    connection: { readyState: 0, once: vi.fn() }
  }
}))

import mongoose from 'mongoose'
import { connectDB } from '@/server/utils/dbConnect.js'
import { disconnectDB } from '@/server/utils/dbDisconnect.js'
import { incrementConnectionCount, decrementConnectionCount, getConnectionCount } from '@/server/utils/dbConnectionState.js'

globalThis.useRuntimeConfig = () => ({ private: { DB_URI: 'mongodb://test' } })

describe('dbConnect and dbDisconnect', () => {
  beforeEach(() => {
    mongoose.connect.mockClear()
    mongoose.disconnect.mockClear()
    mongoose.connection.once.mockReset()
    mongoose.connection.readyState = 0
    while (getConnectionCount() > 0) decrementConnectionCount()
  })

  it('connects when not already connected', async () => {
    await connectDB()
    expect(mongoose.connect).toHaveBeenCalledWith('mongodb://test')
    expect(getConnectionCount()).toBe(1)
  })

  it('skips connect when already connected', async () => {
    mongoose.connection.readyState = 1
    await connectDB()
    expect(mongoose.connect).not.toHaveBeenCalled()
  })

  it('disconnects if connected and only one connection', async () => {
    mongoose.connection.readyState = 1
    incrementConnectionCount()
    await disconnectDB()
    expect(mongoose.disconnect).toHaveBeenCalled()
    expect(getConnectionCount()).toBe(0)
  })

  it('does not disconnect with multiple connections', async () => {
    mongoose.connection.readyState = 1
    incrementConnectionCount()
    incrementConnectionCount()
    await disconnectDB()
    expect(mongoose.disconnect).not.toHaveBeenCalled()
    expect(getConnectionCount()).toBe(1)
  })
})
