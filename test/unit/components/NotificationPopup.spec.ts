import { ref, watch } from 'vue'
import { mount } from '@vue/test-utils'
import NotificationPopup from '@/components/Subcomponents/NotificationPopup.vue'
import { describe, it, expect, vi } from 'vitest'

globalThis.ref = ref
globalThis.watch = watch

describe('NotificationPopup component', () => {
  it('closes when close button is clicked', async () => {
    const wrapper = mount(NotificationPopup, { props: { message: 'Hello' } })
    await wrapper.find('button.close-button').trigger('click')
    expect(wrapper.vm.visible).toBe(false)
  })

  it('automatically hides after the duration', async () => {
    vi.useFakeTimers()
    const wrapper = mount(NotificationPopup, { props: { message: '', duration: 500 } })
    await wrapper.setProps({ message: 'Hi' })
    vi.advanceTimersByTime(500)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.visible).toBe(false)
    vi.useRealTimers()
  })
})
