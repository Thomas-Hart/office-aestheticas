import { mount } from '@vue/test-utils'
import StickyCTA from '@/components/Subcomponents/StickyCTA.vue'
import { describe, it, expect } from 'vitest'
import { ref, onMounted } from 'vue'

globalThis.ref = ref
globalThis.onMounted = onMounted

describe('StickyCTA component', () => {
  it('changes size based on scroll direction', async () => {
    const wrapper = mount(StickyCTA, { attachTo: document.body })
    expect(wrapper.vm.isLarge).toBe(true)
    window.pageYOffset = 100
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isLarge).toBe(false)
    window.pageYOffset = 0
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isLarge).toBe(true)
    wrapper.unmount()
  })
})
