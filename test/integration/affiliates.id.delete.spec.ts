import { describe, it, expect, vi } from 'vitest'

vi.mock('@/server/models/Affiliate.js', () => ({
  default: { findByIdAndDelete: vi.fn() }
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
let Affiliate: any
let connectDB: any
let disconnectDB: any

beforeAll(async () => {
  const mod = await import('@/server/api/affiliates/[id].delete.js')
  handler = mod.default
  Affiliate = (await import('@/server/models/Affiliate.js')).default
  connectDB = (await import('@/server/utils/dbConnect.js')).connectDB
  disconnectDB = (await import('@/server/utils/dbDisconnect.js')).disconnectDB
})

describe('DELETE /api/affiliates/[id]', () => {
  it('removes affiliate', async () => {
    ;(Affiliate.findByIdAndDelete as any).mockResolvedValue({ _id: 'a1' })
    const result = await handler({ context: { params: { id: 'a1' } } } as any)
    expect(connectDB).toHaveBeenCalled()
    expect(Affiliate.findByIdAndDelete).toHaveBeenCalledWith('a1')
    expect(disconnectDB).toHaveBeenCalled()
    expect(result).toEqual({ message: 'Service affiliate successfully deleted', affiliate: { _id: 'a1' } })
  })

  it('throws server error when missing', async () => {
    ;(Affiliate.findByIdAndDelete as any).mockResolvedValue(null)
    await expect(
      handler({ context: { params: { id: 'x' } } } as any)
    ).rejects.toMatchObject({ statusCode: 500 })
  })
})
