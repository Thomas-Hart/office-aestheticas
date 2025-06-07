import { describe, it, expect, vi } from 'vitest'

vi.mock('@/server/models/Item.js', () => ({
  default: { find: vi.fn() }
}))
vi.mock('@/server/utils/dbConnect.js', () => ({
  connectDB: vi.fn()
}))
vi.mock('@/server/utils/dbDisconnect.js', () => ({
  disconnectDB: vi.fn()
}))

// Nuxt injects these helpers globally in production
;(globalThis as any).defineEventHandler = (fn: any) => fn
;(globalThis as any).createError = (err: any) => err

let handler: any
let Item: any
let connectDB: any
let disconnectDB: any

beforeAll(async () => {
  const mod = await import('@/server/api/items/index.get.js')
  handler = mod.default
  Item = (await import('@/server/models/Item.js')).default
  connectDB = (await import('@/server/utils/dbConnect.js')).connectDB
  disconnectDB = (await import('@/server/utils/dbDisconnect.js')).disconnectDB
})

describe('GET /api/items', () => {
  it('returns items from database', async () => {
    const items = [{ name: 'Chair' }]
    ;(Item.find as any).mockResolvedValue(items)
    const result = await handler({} as any)
    expect(connectDB).toHaveBeenCalled()
    expect(Item.find).toHaveBeenCalled()
    expect(disconnectDB).toHaveBeenCalled()
    expect(result).toEqual(items)
  })

  it('throws server error on failure', async () => {
    ;(Item.find as any).mockRejectedValue(new Error('fail'))
    await expect(handler({} as any)).rejects.toMatchObject({ statusCode: 500 })
  })
})
