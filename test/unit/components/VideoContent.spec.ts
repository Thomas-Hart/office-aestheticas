import { mount } from '@vue/test-utils'
import VideoContent from '@/components/Blog/Interactive/VideoContent.vue'
import { describe, it, expect } from 'vitest'

describe('VideoContent component', () => {
  it('renders video url and caption', () => {
    const video = { url: 'https://example.com', caption: 'Caption text' }
    const wrapper = mount(VideoContent, { props: { video } })
    expect(wrapper.find('iframe').attributes('src')).toBe(video.url)
    expect(wrapper.text()).toContain(video.caption)
  })
})
