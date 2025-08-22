import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import RemoteView from '../../src/views/RemoteView.vue'
import { useMainStore } from '../../src/stores/main'

const mockUseRoute = { query: {} }
vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useRoute: () => mockUseRoute,
  }
})

describe('RemoteView.vue', () => {
  beforeEach(() => {
    mockUseRoute.query = {}
    const store = useMainStore()
    // Manually reset spies on store actions
    if (vi.isMockFunction(store.sendMessage)) {
      store.sendMessage.mockClear()
    }
    if (vi.isMockFunction(store.manageSlots)) {
      store.manageSlots.mockClear()
    }
  })

  it('shows an error if no roomId is provided', async () => {
    const wrapper = mount(RemoteView)
    await wrapper.vm.$nextTick() // Wait for onMounted to run
    expect(wrapper.find('.error').text()).toContain('No Room ID was provided')
  })

  it('shows "Connecting to room..." message initially', () => {
    mockUseRoute.query = { roomId: 'test-room' }
    const wrapper = mount(RemoteView)
    expect(wrapper.text()).toContain('Connecting to room...')
  })

  it('displays controls when connected', async () => {
    mockUseRoute.query = { roomId: 'test-room' }
    const store = useMainStore()
    store.isConnected = true
    store.roomId = 'test-room'
    store.room = { users: [], capacity: 2 }

    const wrapper = mount(RemoteView)

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.controls').exists()).toBe(true)
    expect(wrapper.text()).toContain('Connected to room: test-room')
  })

  it('calls sendMessage on input', async () => {
    mockUseRoute.query = { roomId: 'test-room' }
    const store = useMainStore()
    const sendMessageSpy = vi.spyOn(store, 'sendMessage')
    store.isConnected = true

    const wrapper = mount(RemoteView)

    await wrapper.vm.$nextTick()

    const input = wrapper.find('input[type="text"]')
    await input.setValue('hello')

    expect(sendMessageSpy).toHaveBeenCalledWith('hello')
  })

  it('calls manageSlots on button click', async () => {
    mockUseRoute.query = { roomId: 'test-room' }
    const store = useMainStore()
    const manageSlotsSpy = vi.spyOn(store, 'manageSlots')
    store.isConnected = true
    store.room = { users: [], capacity: 2 }

    const wrapper = mount(RemoteView)

    await wrapper.vm.$nextTick()

    const buttons = wrapper.findAll('button')
    const addButton = buttons.find(b => b.text() === 'Add Slot')
    const removeButton = buttons.find(b => b.text() === 'Remove Slot')

    await addButton.trigger('click')
    expect(manageSlotsSpy).toHaveBeenCalledWith('add')

    await removeButton.trigger('click')
    expect(manageSlotsSpy).toHaveBeenCalledWith('remove')
  })
})
