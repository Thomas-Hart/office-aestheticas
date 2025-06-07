import { describe, it, expect, vi } from 'vitest'

const save = vi.fn()

vi.mock('@/server/models/Affiliate.js', () => ({
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
let Affiliate: any
let connectDB: any
let disconnectDB: any

beforeAll(async () => {
  const mod = await import('@/server/api/affiliates/index.post.js')
  handler = mod.default
  Affiliate = (await import('@/server/models/Affiliate.js')).default
  connectDB = (await import('@/server/utils/dbConnect.js')).connectDB
  disconnectDB = (await import('@/server/utils/dbDisconnect.js')).disconnectDB
})

describe('POST /api/affiliates', () => {
  it('creates a new affiliate', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({ name: 'A' })
    save.mockResolvedValue(undefined)
    const result = await handler({} as any)
    expect(connectDB).toHaveBeenCalled()
    expect(Affiliate).toHaveBeenCalledWith({ name: 'A' })
    expect(save).toHaveBeenCalled()
    expect(disconnectDB).toHaveBeenCalled()
    expect(result).toEqual({ save })
  })

  it('throws server error on failure', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({ name: 'A' })
    save.mockRejectedValue(new Error('fail'))
    await expect(handler({} as any)).rejects.toMatchObject({ statusCode: 500 })
  })
})
