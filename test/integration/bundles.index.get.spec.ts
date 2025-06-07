import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/server/models/Bundle.js', () => ({
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
let Bundle: any
let connectDB: any
let disconnectDB: any

beforeAll(async () => {
  const mod = await import('@/server/api/bundles/index.get.js')
  handler = mod.default
  Bundle = (await import('@/server/models/Bundle.js')).default
  connectDB = (await import('@/server/utils/dbConnect.js')).connectDB
  disconnectDB = (await import('@/server/utils/dbDisconnect.js')).disconnectDB
})

beforeEach(() => {
  vi.resetAllMocks()
})

describe('GET /api/bundles', () => {
  it('returns bundle by id', async () => {
    ;(globalThis as any).getQuery.mockReturnValue({ _id: 'b1' })
    ;(Bundle.findById as any).mockResolvedValue({ _id: 'b1' })
    const result = await handler({} as any)
    expect(connectDB).toHaveBeenCalled()
    expect(Bundle.findById).toHaveBeenCalledWith('b1')
    expect(disconnectDB).toHaveBeenCalled()
    expect(result).toEqual({ _id: 'b1' })
  })

  it('returns all bundles', async () => {
    ;(globalThis as any).getQuery.mockReturnValue({})
    ;(Bundle.find as any).mockResolvedValue([{ _id: 'b1' }])
    const result = await handler({} as any)
    expect(Bundle.find).toHaveBeenCalledWith({})
    expect(result).toEqual([{ _id: 'b1' }])
  })

  it('throws server error on failure', async () => {
    ;(globalThis as any).getQuery.mockReturnValue({ _id: 'b1' })
    ;(Bundle.findById as any).mockRejectedValue(new Error('fail'))
    await expect(handler({} as any)).rejects.toMatchObject({ statusCode: 500 })
  })
})
