import { describe, it, expect, vi } from 'vitest'

vi.mock('@/server/models/Blog.js', () => ({
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
let Blog: any
let connectDB: any
let disconnectDB: any

beforeAll(async () => {
  const mod = await import('@/server/api/blogs/popular.get.js')
  handler = mod.default
  Blog = (await import('@/server/models/Blog.js')).default
  connectDB = (await import('@/server/utils/dbConnect.js')).connectDB
  disconnectDB = (await import('@/server/utils/dbDisconnect.js')).disconnectDB
})

describe('GET /api/blogs/popular', () => {
  it('returns two most viewed blogs', async () => {
    const limit = vi.fn().mockResolvedValue([{ _id: 'b1' }, { _id: 'b2' }])
    const sort = vi.fn().mockReturnValue({ limit })
    ;(Blog.find as any).mockReturnValue({ sort })
    const result = await handler({} as any)
    expect(connectDB).toHaveBeenCalled()
    expect(Blog.find).toHaveBeenCalledWith({})
    expect(sort).toHaveBeenCalledWith({ views: -1 })
    expect(limit).toHaveBeenCalledWith(2)
    expect(disconnectDB).toHaveBeenCalled()
    expect(result).toEqual([{ _id: 'b1' }, { _id: 'b2' }])
  })

  it('throws server error on failure', async () => {
    const limit = vi.fn().mockRejectedValue(new Error('fail'))
    const sort = vi.fn().mockReturnValue({ limit })
    ;(Blog.find as any).mockReturnValue({ sort })
    await expect(handler({} as any)).rejects.toMatchObject({ statusCode: 500 })
  })
})
