import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/server/models/Affiliate.js', () => ({
  default: { findById: vi.fn(), find: vi.fn() }
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
let Affiliate: any
let connectDB: any
let disconnectDB: any

beforeAll(async () => {
  const mod = await import('@/server/api/affiliates/index.get.js')
  handler = mod.default
  Affiliate = (await import('@/server/models/Affiliate.js')).default
  connectDB = (await import('@/server/utils/dbConnect.js')).connectDB
  disconnectDB = (await import('@/server/utils/dbDisconnect.js')).disconnectDB
})

beforeEach(() => {
  vi.resetAllMocks()
})

describe('GET /api/affiliates', () => {
  it('returns affiliate by id', async () => {
    ;(globalThis as any).getQuery.mockReturnValue({ _id: 'a1' })
    ;(Affiliate.findById as any).mockResolvedValue({ _id: 'a1' })
    const result = await handler({} as any)
    expect(connectDB).toHaveBeenCalled()
    expect(Affiliate.findById).toHaveBeenCalledWith('a1')
    expect(disconnectDB).toHaveBeenCalled()
    expect(result).toEqual({ _id: 'a1' })
  })

  it('returns all affiliates', async () => {
    ;(globalThis as any).getQuery.mockReturnValue({})
    ;(Affiliate.find as any).mockResolvedValue([{ _id: 'a1' }])
    const result = await handler({} as any)
    expect(Affiliate.find).toHaveBeenCalledWith({})
    expect(result).toEqual([{ _id: 'a1' }])
  })

  it('throws server error on failure', async () => {
    ;(globalThis as any).getQuery.mockReturnValue({ _id: 'a1' })
    ;(Affiliate.findById as any).mockRejectedValue(new Error('fail'))
    await expect(handler({} as any)).rejects.toMatchObject({ statusCode: 500 })
  })
})
