// test/example.spec.ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NuxtLogo from '@/components/NuxtLogo.vue'

describe('NuxtLogo component renders', () => {
  it('mounts without errors', () => {
    const wrapper = mount(NuxtLogo)
    expect(wrapper.exists()).toBe(true)
  })
})
