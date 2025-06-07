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
  const mod = await import('@/server/api/reviews/index.get.js')
  handler = mod.default
  Review = (await import('@/server/models/Review.js')).default
  connectDB = (await import('@/server/utils/dbConnect.js')).connectDB
  disconnectDB = (await import('@/server/utils/dbDisconnect.js')).disconnectDB
})

describe('GET /api/reviews', () => {
  it('returns reviews from database', async () => {
    const reviews = [{ title: 'Great' }]
    ;(Review.find as any).mockResolvedValue(reviews)
    const result = await handler({} as any)
    expect(connectDB).toHaveBeenCalled()
    expect(Review.find).toHaveBeenCalled()
    expect(disconnectDB).toHaveBeenCalled()
    expect(result).toEqual(reviews)
  })

  it('throws server error on failure', async () => {
    ;(Review.find as any).mockRejectedValue(new Error('fail'))
    await expect(handler({} as any)).rejects.toMatchObject({ statusCode: 500 })
  })
})
