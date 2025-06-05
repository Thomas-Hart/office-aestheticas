import { mount } from '@vue/test-utils'
import LoadingButton from '@/components/Subcomponents/LoadingButton.vue'
import { describe, it, expect } from 'vitest'

describe('LoadingButton component', () => {
  it('emits submit event when clicked', async () => {
    const wrapper = mount(LoadingButton, { props: { text: 'Send' } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('submit')).toBeTruthy()
  })

  it('disables button and shows spinner when loading', () => {
    const wrapper = mount(LoadingButton, { props: { isLoading: true } })
    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
    expect(wrapper.find('.spinner').exists()).toBe(true)
  })
})
