import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'
import { useItemStore } from '@/stores/itemStore.js'

// nuxt auto imports `ref`, but in tests we need to expose it globally
globalThis.ref = ref

describe('itemStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adds items to cart and calculates totals', () => {
    const store = useItemStore()
    const item = { _id: '1', name: 'Chair', price: 50, oldPrice: 60, image: '', variants: [] }
    store.setItems([item])
    store.addToCart(item)

    expect(store.isItemInCart('1')).toBe(true)
    expect(store.getCartItemCount()).toBe(1)
    expect(store.getCartSubtotal()).toBe(50)
  })
})
