import { mount } from '@vue/test-utils'
import StarSvgSingle from '@/components/Subcomponents/StarSvgSingle.vue'
import { describe, it, expect } from 'vitest'

describe('StarSvgSingle component', () => {
  it('renders with correct attributes', () => {
    const wrapper = mount(StarSvgSingle, { props: { fillWidth: 30, fillColor: '#000', unfilledColor: '#fff' } })
    const rects = wrapper.findAll('rect')
    expect(rects[0].attributes('fill')).toBe('#fff')
    expect(rects[1].attributes('fill')).toBe('#000')
    expect(rects[1].attributes('width')).toBe('30')
    expect(wrapper.html()).toContain('url(#star-clip-')
  })
})
