import { describe, it, expect, vi } from 'vitest'

const save = vi.fn()

vi.mock('@/server/models/Blog.js', () => ({
  default: vi.fn(() => ({ save }))
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
let Blog: any
let connectDB: any
let disconnectDB: any

beforeAll(async () => {
  const mod = await import('@/server/api/blogs/index.post.js')
  handler = mod.default
  Blog = (await import('@/server/models/Blog.js')).default
  connectDB = (await import('@/server/utils/dbConnect.js')).connectDB
  disconnectDB = (await import('@/server/utils/dbDisconnect.js')).disconnectDB
})

describe('POST /api/blogs', () => {
  it('creates a new blog', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({ title: 'New' })
    save.mockResolvedValue(undefined)
    const result = await handler({} as any)
    expect(connectDB).toHaveBeenCalled()
    expect(Blog).toHaveBeenCalledWith({ title: 'New', _id: null })
    expect(save).toHaveBeenCalled()
    expect(disconnectDB).toHaveBeenCalled()
    expect(result).toEqual({ save: save })
  })

  it('throws server error on failure', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({ title: 'New' })
    save.mockRejectedValue(new Error('fail'))
    await expect(handler({} as any)).rejects.toMatchObject({ statusCode: 500 })
  })
})
