import { describe, it, expect, vi } from 'vitest'

vi.mock('@/server/models/Review.js', () => ({
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

let handler: any
let Review: any
let connectDB: any
let disconnectDB: any

beforeAll(async () => {
  const mod = await import('@/server/api/reviews/[id].get.js')
  handler = mod.default
  Review = (await import('@/server/models/Review.js')).default
  connectDB = (await import('@/server/utils/dbConnect.js')).connectDB
  disconnectDB = (await import('@/server/utils/dbDisconnect.js')).disconnectDB
})

describe('GET /api/reviews/[id]', () => {
  it('returns reviews for item', async () => {
    const reviews = [{ itemId: 'i1' }]
    ;(Review.find as any).mockResolvedValue(reviews)
    const result = await handler({ context: { params: { id: 'i1' } } } as any)
    expect(connectDB).toHaveBeenCalled()
    expect(Review.find).toHaveBeenCalledWith({ itemId: 'i1' })
    expect(disconnectDB).toHaveBeenCalled()
    expect(result).toEqual(reviews)
  })

  it('throws server error on failure', async () => {
    ;(Review.find as any).mockRejectedValue(new Error('fail'))
    await expect(
      handler({ context: { params: { id: 'i1' } } } as any)
    ).rejects.toMatchObject({ statusCode: 500 })
  })
})
