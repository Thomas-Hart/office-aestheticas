import { describe, it, expect, beforeEach, vi } from 'vitest'
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

  it('removes items from cart', () => {
    const store = useItemStore()
    const item = { _id: '1', name: 'Desk', price: 100, oldPrice: 120, image: '', variants: [] }
    store.setItems([item])
    store.addToCart(item)
    store.removeFromCart('1')
    expect(store.isItemInCart('1')).toBe(false)
  })

  it('updates quantity of existing item', () => {
    const store = useItemStore()
    const item = { _id: '1', name: 'Lamp', price: 20, oldPrice: 25, image: '', variants: [] }
    store.setItems([item])
    store.addToCart(item)
    store.updateQuantity({ itemId: '1', quantity: 3 })
    expect(store.cart[0].quantity).toBe(3)
    expect(store.getCartItemCount()).toBe(3)
  })

  it('clears cart and resets order details', () => {
    const store = useItemStore()
    const item = { _id: '1', name: 'Mouse', price: 30, oldPrice: 35, image: '', variants: [] }
    store.setItems([item])
    store.addToCart(item)
    store.setOrderDetails({ id: 'a' })
    store.clearCart()
    expect(store.cart.length).toBe(0)
    expect(store.orderDetails).toBeNull()
    expect(store.isCartEmpty()).toBe(true)
  })

  it('retrieves item by id', () => {
    const store = useItemStore()
    const item = { _id: '99', name: 'Keyboard', price: 80, oldPrice: 90, image: '', variants: [] }
    store.setItems([item])
    expect(store.getItemById('99')).toEqual(item)
  })

  it('validates cart items with updated variant data', () => {
    const store = useItemStore()
    const variant = { _id: 'v1', price: 10, oldPrice: 15, image: 'old.png', color: { name: 'Red' } }
    const item = { _id: '1', name: 'Chair', price: 9, oldPrice: 14, image: 'base.png', variants: [variant] }
    store.setItems([item])
    store.addToCart(item, variant)

    const updatedVariant = { _id: 'v1', price: 20, oldPrice: 25, image: 'new.png', color: { name: 'Blue' } }
    const updatedItem = { ...item, variants: [updatedVariant] }
    store.setItems([updatedItem])

    expect(store.cart[0].price).toBe(20)
    expect(store.cart[0].color).toBe('Blue')
  })

  it('keeps cart item when item no longer exists', () => {
    const store = useItemStore()
    const item = { _id: '2', name: 'Desk', price: 50, oldPrice: 60, image: '', variants: [] }
    store.setItems([item])
    store.addToCart(item)

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    store.setItems([])

    expect(store.cart[0]._id).toBe('2')
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })
})
