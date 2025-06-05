import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore.js'

globalThis.ref = ref

describe('userStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    globalThis.$fetch = vi.fn().mockResolvedValue([])
  })

  it('sets token and user then logs out', () => {
    const store = useUserStore()
    store.setToken('abc')
    store.setUser({ _id: 'u1', cart: [] })
    expect(store.token).toBe('abc')
    expect(store.user._id).toBe('u1')
    store.logout()
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
  })

  it('calculates cart count and subtotal and clears cart', async () => {
    const store = useUserStore()
    store.setUser({ _id: 'u1', cart: [{ _id: '1', name: 'Item', price: 5, quantity: 2 }] })
    expect(store.getCartItemCount()).toBe(2)
    expect(store.getCartSubtotal()).toBe(10)
    expect(store.isItemInCart('1')).toBe(true)
    await store.removeFromCart('1')
    expect(store.user.cart.length).toBe(0)
    store.clearCart()
    expect(store.getCartItemCount()).toBe(0)
    expect(store.isItemInCart('1')).toBe(false)
  })
})
