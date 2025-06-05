import { mount } from '@vue/test-utils'
import Poll from '@/components/Blog/Interactive/Poll.vue'
import { describe, it, expect } from 'vitest'

describe('Poll component', () => {
  it('emits updated poll data when an option is selected', async () => {
    const poll = {
      question: 'Best color?',
      options: [
        { option: 'Red', votes: 0, percentage: 0 },
        { option: 'Blue', votes: 0, percentage: 0 }
      ]
    }
    const wrapper = mount(Poll, {
      props: { poll }
    })

    await wrapper.find('button').trigger('click')

    const emitted = wrapper.emitted('updatePoll')
    expect(emitted).toBeTruthy()
    const updated = emitted?.[0][0]
    expect(updated.options[0].votes).toBe(1)
    expect(wrapper.find('.poll-option-button').classes()).toContain('selected')
  })
})
