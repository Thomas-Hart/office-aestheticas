import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'
import { useItemStore } from '@/stores/itemStore.js'
import { useUserStore } from '@/stores/userStore.js'

globalThis.ref = ref

describe('cart flow e2e', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    globalThis.$fetch = vi.fn().mockResolvedValue([])
  })

  it('moves guest cart to user after login', async () => {
    const itemStore = useItemStore()
    const userStore = useUserStore()

    const item = { _id: '1', name: 'Desk', price: 50, oldPrice: 60, image: '', variants: [] }

    itemStore.setItems([item])
    itemStore.addToCart(item)

    userStore.setUser({ _id: 'u1', cart: [] })
    userStore.setToken('abc')

    userStore.user.cart = [...itemStore.cart]

    expect(userStore.getCartItemCount()).toBe(1)
    expect(itemStore.getCartSubtotal()).toBe(50)
  })
})
