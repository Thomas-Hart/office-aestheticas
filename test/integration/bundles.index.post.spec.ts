import { describe, it, expect, vi } from 'vitest'

const save = vi.fn()

vi.mock('@/server/models/Bundle.js', () => ({
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
let Bundle: any
let connectDB: any
let disconnectDB: any

beforeAll(async () => {
  const mod = await import('@/server/api/bundles/index.post.js')
  handler = mod.default
  Bundle = (await import('@/server/models/Bundle.js')).default
  connectDB = (await import('@/server/utils/dbConnect.js')).connectDB
  disconnectDB = (await import('@/server/utils/dbDisconnect.js')).disconnectDB
})

describe('POST /api/bundles', () => {
  it('creates a new bundle', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({ name: 'Bundle' })
    save.mockResolvedValue(undefined)
    const result = await handler({} as any)
    expect(connectDB).toHaveBeenCalled()
    expect(Bundle).toHaveBeenCalledWith({ name: 'Bundle' })
    expect(save).toHaveBeenCalled()
    expect(disconnectDB).toHaveBeenCalled()
    expect(result).toEqual({ save })
  })

  it('throws server error on failure', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({ name: 'Bundle' })
    save.mockRejectedValue(new Error('fail'))
    await expect(handler({} as any)).rejects.toMatchObject({ statusCode: 500 })
  })
})
