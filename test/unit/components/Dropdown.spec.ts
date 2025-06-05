import { mount } from '@vue/test-utils'
import Dropdown from '@/components/Subcomponents/Dropdown.vue'
import { describe, it, expect } from 'vitest'
import { ref } from 'vue'

globalThis.ref = ref

describe('Dropdown component', () => {
  it('toggles dropdown visibility', async () => {
    const wrapper = mount(Dropdown, {
      props: { items: { a: 'Apple' }, selectedItems: [], label: 'Select' }
    })
    const button = wrapper.find('button')
    await button.trigger('click')
    expect(wrapper.vm.showDropdown).toBe(true)
    await button.trigger('click')
    expect(wrapper.vm.showDropdown).toBe(false)
  })

  it('emits selected items when option clicked', async () => {
    const wrapper = mount(Dropdown, {
      props: { items: { a: 'Apple' }, selectedItems: [], label: 'Fruit' }
    })
    await wrapper.find('button').trigger('click')
    await wrapper.find('.dropdown-item').trigger('click')
    expect(wrapper.emitted('update:selectedItems')?.[0][0]).toEqual(['a'])
  })

  it('closes when clicking outside', async () => {
    const wrapper = mount(Dropdown, {
      attachTo: document.body,
      props: { items: { a: 'Apple' }, selectedItems: [], label: 'Select' }
    })
    await wrapper.find('button').trigger('click')
    document.body.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.showDropdown).toBe(false)
    wrapper.unmount()
  })
})
