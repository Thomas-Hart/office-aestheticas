import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/server/models/Affiliate.js', () => ({
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
;(globalThis as any).readBody = vi.fn()

let handler: any
let Affiliate: any
let connectDB: any
let disconnectDB: any
let doc: any

beforeAll(async () => {
  const mod = await import('@/server/api/affiliates/[id].put.js')
  handler = mod.default
  Affiliate = (await import('@/server/models/Affiliate.js')).default
  connectDB = (await import('@/server/utils/dbConnect.js')).connectDB
  disconnectDB = (await import('@/server/utils/dbDisconnect.js')).disconnectDB
})

beforeEach(() => {
  vi.resetAllMocks()
  doc = { save: vi.fn().mockResolvedValue(undefined) }
  ;(Affiliate.findById as any).mockResolvedValue(doc)
})

describe('PUT /api/affiliates/[id]', () => {
  it('updates existing affiliate', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({ name: 'New' })
    const result = await handler({ context: { params: { id: 'a1' } } } as any)
    expect(connectDB).toHaveBeenCalled()
    expect(Affiliate.findById).toHaveBeenCalledWith('a1')
    expect(doc.save).toHaveBeenCalled()
    expect(disconnectDB).toHaveBeenCalled()
    expect(result).toEqual(doc)
  })

  it('throws server error when affiliate missing', async () => {
    ;(Affiliate.findById as any).mockResolvedValue(null)
    await expect(
      handler({ context: { params: { id: 'x' } } } as any)
    ).rejects.toMatchObject({ statusCode: 500 })
  })
})
