import { mount } from '@vue/test-utils'
import StarRating from '@/components/Subcomponents/StarRating.vue'
import { describe, it, expect } from 'vitest'

describe('StarRating component', () => {
  it('calculates fill width based on rating', () => {
    const wrapper = mount(StarRating, {
      props: { rating: 3.5 },
      global: { stubs: { SubcomponentsStarSvgSingle: true } }
    })
    expect(wrapper.vm.getFillWidth(0)).toBe(50)
    expect(wrapper.vm.getFillWidth(3)).toBe(25)
  })
})
