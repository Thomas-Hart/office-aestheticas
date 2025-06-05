import { mount } from '@vue/test-utils'
import Quiz from '@/components/Blog/Interactive/Quiz.vue'
import { describe, it, expect, beforeEach } from 'vitest'
import { ref } from 'vue'

const quiz = {
  question: 'Best color?',
  options: ['Red', 'Blue'],
  correctAnswer: 0
}

describe('Quiz component', () => {
  beforeEach(() => {
    globalThis.ref = ref
  })
  it('applies correct class when right option selected', async () => {
    const wrapper = mount(Quiz, { props: { quiz } })
    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')
    expect(buttons[0].classes()).toContain('correct')
  })

  it('applies incorrect class when wrong option selected', async () => {
    const wrapper = mount(Quiz, { props: { quiz } })
    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click')
    expect(buttons[1].classes()).toContain('incorrect')
  })
})
