import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import OverlayView from '../../src/views/OverlayView.vue'
import { useMainStore } from '../../src/stores/main'

vi.mock('vue-qrcode', () => ({
  default: {
    name: 'QrcodeVue',
    template: '<div class="mock-qrcode">Mock QR Code</div>'
  }
}))

describe('OverlayView.vue', () => {
  it('shows generating session message when roomId is null', () => {
    const store = useMainStore()
    store.roomId = null
    const wrapper = mount(OverlayView)
    expect(wrapper.text()).toContain('Generating session...')
  })

  it('displays QR code when roomId is available but not connected', async () => {
    const store = useMainStore()
    store.roomId = 'test-room'
    store.isConnected = false

    const wrapper = mount(OverlayView)

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.mock-qrcode').exists()).toBe(true)
    expect(wrapper.text()).toContain('Mock QR Code')
  })

  it('displays the message when connected', async () => {
    const store = useMainStore()
    store.isConnected = true
    store.message = 'Test Message'

    const wrapper = mount(OverlayView)

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.message').text()).toBe('Test Message')
    expect(wrapper.find('.mock-qrcode').exists()).toBe(false)
  })
})
