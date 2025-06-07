import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/server/models/Blog.js', () => ({
  default: { findById: vi.fn(), find: vi.fn(), countDocuments: vi.fn() }
}))
vi.mock('@/server/utils/dbConnect.js', () => ({
  connectDB: vi.fn()
}))
vi.mock('@/server/utils/dbDisconnect.js', () => ({
  disconnectDB: vi.fn()
}))

;(globalThis as any).defineEventHandler = (fn: any) => fn
;(globalThis as any).createError = (err: any) => err
;(globalThis as any).getQuery = vi.fn()

let handler: any
let Blog: any
let connectDB: any
let disconnectDB: any

beforeAll(async () => {
  const mod = await import('@/server/api/blogs/index.get.js')
  handler = mod.default
  Blog = (await import('@/server/models/Blog.js')).default
  connectDB = (await import('@/server/utils/dbConnect.js')).connectDB
  disconnectDB = (await import('@/server/utils/dbDisconnect.js')).disconnectDB
})

beforeEach(() => {
  vi.resetAllMocks()
})

describe('GET /api/blogs', () => {
  it('returns blog by id', async () => {
    ;(globalThis as any).getQuery.mockReturnValue({ _id: 'b1' })
    ;(Blog.findById as any).mockResolvedValue({ _id: 'b1' })
    const result = await handler({} as any)
    expect(connectDB).toHaveBeenCalled()
    expect(Blog.findById).toHaveBeenCalledWith('b1')
    expect(disconnectDB).toHaveBeenCalled()
    expect(result).toEqual({ _id: 'b1' })
  })

  it('returns featured and regular blogs', async () => {
    ;(globalThis as any).getQuery.mockReturnValue({})
    const featuredLimit = vi.fn().mockResolvedValue([{ _id: 'f1' }])
    const featuredSort = vi.fn().mockReturnValue({ limit: featuredLimit })
    const regularLimit = vi.fn().mockResolvedValue([{ _id: 'r1' }])
    const regularSkip = vi.fn().mockReturnValue({ limit: regularLimit })
    const regularSort = vi.fn().mockReturnValue({ skip: regularSkip })
    ;(Blog.find as any).mockReturnValueOnce({ sort: featuredSort })
    ;(Blog.find as any).mockReturnValueOnce({ sort: regularSort })
    ;(Blog.countDocuments as any).mockResolvedValue(1)
    const result = await handler({} as any)
    expect(Blog.find).toHaveBeenNthCalledWith(1, {})
    expect(featuredSort).toHaveBeenCalledWith({ views: -1 })
    expect(featuredLimit).toHaveBeenCalledWith(3)
    expect(Blog.find).toHaveBeenNthCalledWith(2, { _id: { $nin: ['f1'] } })
    expect(regularSort).toHaveBeenCalledWith({ date: -1 })
    expect(regularSkip).toHaveBeenCalledWith(0)
    expect(regularLimit).toHaveBeenCalledWith(5)
    expect(result).toEqual({ featured: [{ _id: 'f1' }], regular: [{ _id: 'r1' }], totalRegular: 1 })
  })

  it('throws server error on failure', async () => {
    ;(globalThis as any).getQuery.mockReturnValue({ _id: 'b1' })
    ;(Blog.findById as any).mockRejectedValue(new Error('fail'))
    await expect(handler({} as any)).rejects.toMatchObject({ statusCode: 500 })
  })
})
