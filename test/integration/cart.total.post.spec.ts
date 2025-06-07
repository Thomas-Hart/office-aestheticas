import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'

vi.mock('@/server/models/Item.js', () => ({
  default: { find: vi.fn() }
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
let Item: any
let connectDB: any
let disconnectDB: any

beforeAll(async () => {
  const mod = await import('@/server/api/cart/total.post.js')
  handler = mod.default
  Item = (await import('@/server/models/Item.js')).default
  connectDB = (await import('@/server/utils/dbConnect.js')).connectDB
  disconnectDB = (await import('@/server/utils/dbDisconnect.js')).disconnectDB
})

beforeEach(() => {
  vi.resetAllMocks()
})

describe('POST /api/cart/total', () => {
  it('returns 0 when cart empty', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({ cartItems: [] })
    const result = await handler({} as any)
    expect(result).toBe('0.00')
  })

  it('sums item prices', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({ cartItems: [{ _id: '1', quantity: 2 }] })
    const lean = vi.fn().mockResolvedValue([{ _id: '1', price: 5, variants: [] }])
    ;(Item.find as any).mockReturnValue({ lean })
    const result = await handler({} as any)
    expect(Item.find).toHaveBeenCalledWith({ _id: { $in: ['1'] } })
    expect(lean).toHaveBeenCalled()
    expect(result).toBe('10.00')
  })

  it('uses variant price', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({ cartItems: [{ _id: '1', variantId: 'v1', quantity: 1 }] })
    const lean = vi.fn().mockResolvedValue([
      { _id: '1', price: 5, variants: [{ _id: 'v1', price: 3 }] }
    ])
    ;(Item.find as any).mockReturnValue({ lean })
    const result = await handler({} as any)
    expect(result).toBe('3.00')
  })

  it('throws server error when items missing', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({ cartItems: [{ _id: '1', quantity: 1 }] })
    const lean = vi.fn().mockResolvedValue([])
    ;(Item.find as any).mockReturnValue({ lean })
    await expect(handler({} as any)).rejects.toMatchObject({ statusCode: 500 })
  })
})
