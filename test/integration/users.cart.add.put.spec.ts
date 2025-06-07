import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('mongoose', () => {
  const ObjectId = vi.fn(function (v: any) {
    return { toString: () => String(v) }
  })
  return { default: { Types: { ObjectId } } }
})
vi.mock('@/server/models/User.js', () => ({
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
let User: any
let connectDB: any
let disconnectDB: any
let userDoc: any

beforeAll(async () => {
  const mod = await import('@/server/api/users/cart/add/[id].put.js')
  handler = mod.default
  User = (await import('@/server/models/User.js')).default
  connectDB = (await import('@/server/utils/dbConnect.js')).connectDB
  disconnectDB = (await import('@/server/utils/dbDisconnect.js')).disconnectDB
})

beforeEach(() => {
  vi.resetAllMocks()
  userDoc = { cart: [], save: vi.fn().mockResolvedValue(undefined) }
  ;(User.findById as any).mockResolvedValue(userDoc)
})

describe('PUT /api/users/cart/add/[id]', () => {
  it('adds new item to cart', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({ items: [{ _id: '1', quantity: 2 }] })
    const result = await handler({ context: { params: { id: 'u1' } } } as any)
    expect(userDoc.cart.length).toBe(1)
    expect(userDoc.cart[0].quantity).toBe(2)
    expect(userDoc.save).toHaveBeenCalled()
    expect(result).toEqual(userDoc.cart)
  })

  it('increments quantity when item exists', async () => {
    userDoc.cart = [{ _id: '1', variantId: null, quantity: 1 }]
    ;(globalThis as any).readBody.mockResolvedValue({ items: [{ _id: '1', quantity: 3 }] })
    const result = await handler({ context: { params: { id: 'u1' } } } as any)
    expect(result.length).toBe(2)
    expect(userDoc.cart.length).toBe(2)
  })

  it('throws 400 for invalid body', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({ foo: 'bar' })
    await expect(
      handler({ context: { params: { id: 'u1' } } } as any)
    ).rejects.toMatchObject({ statusCode: 400 })
  })
})
