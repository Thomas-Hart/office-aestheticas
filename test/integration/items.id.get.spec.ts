import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/server/models/Item.js', () => ({
  default: { findById: vi.fn() }
}))
vi.mock('@/server/utils/dbConnect.js', () => ({
  connectDB: vi.fn()
}))
vi.mock('@/server/utils/dbDisconnect.js', () => ({
  disconnectDB: vi.fn()
}))

;(globalThis as any).defineEventHandler = (fn: any) => fn
;(globalThis as any).createError = (err: any) => err

let handler: any
let Item: any
let connectDB: any
let disconnectDB: any

beforeAll(async () => {
  const mod = await import('@/server/api/items/[id].get.js')
  handler = mod.default
  Item = (await import('@/server/models/Item.js')).default
  connectDB = (await import('@/server/utils/dbConnect.js')).connectDB
  disconnectDB = (await import('@/server/utils/dbDisconnect.js')).disconnectDB
})

beforeEach(() => {
  vi.resetAllMocks()
})

describe('GET /api/items/[id]', () => {
  it('returns item when found', async () => {
    const item = { _id: '1', name: 'Chair' }
    Item.findById.mockResolvedValue(item)
    const result = await handler({ context: { params: { id: '1' } } } as any)
    expect(connectDB).toHaveBeenCalled()
    expect(Item.findById).toHaveBeenCalledWith('1')
    expect(disconnectDB).toHaveBeenCalled()
    expect(result).toEqual(item)
  })

  it('throws server error when item missing', async () => {
    Item.findById.mockResolvedValue(null)
    await expect(
      handler({ context: { params: { id: '2' } } } as any)
    ).rejects.toMatchObject({ statusCode: 500 })
  })

  it('throws server error on failure', async () => {
    Item.findById.mockRejectedValue(new Error('fail'))
    await expect(
      handler({ context: { params: { id: '3' } } } as any)
    ).rejects.toMatchObject({ statusCode: 500 })
  })
})
