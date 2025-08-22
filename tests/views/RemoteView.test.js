import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import RemoteView from '../../src/views/RemoteView.vue';
import { useOverlayStore } from '../../src/stores/overlay';

// Mock lodash throttle to execute immediately
vi.mock('lodash', () => ({
  throttle: (fn) => fn,
}));

describe('RemoteView.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should create a new overlay', async () => {
    const overlayStore = useOverlayStore();
    const wrapper = mount(RemoteView);

    await wrapper.find('input[id="newName"]').setValue('My New Overlay');
    await wrapper.find('form').trigger('submit.prevent');

    expect(overlayStore.overlays).toHaveLength(1);
    expect(overlayStore.overlays[0].name).toBe('My New Overlay');
  });

  it('should display existing overlays', () => {
    const overlayStore = useOverlayStore();
    overlayStore.addOverlay({ name: 'Existing Overlay' });

    const wrapper = mount(RemoteView);

    expect(wrapper.text()).toContain('Existing Overlay');
  });

  it('should update an existing overlay', async () => {
    const overlayStore = useOverlayStore();
    overlayStore.addOverlay({ name: 'Original Name' });
    const overlayId = overlayStore.overlays[0].id;

    const wrapper = mount(RemoteView);

    const nameInput = wrapper.find(`input[id="name-${overlayId}"]`);
    await nameInput.setValue('Updated Name');

    // Find the correct button to trigger the update
    const updateButton = wrapper.find('.overlay-editor .button-group button');
    await updateButton.trigger('click');

    expect(overlayStore.overlays[0].name).toBe('Updated Name');
  });

  it('should delete an overlay', async () => {
    const overlayStore = useOverlayStore();
    overlayStore.addOverlay({ name: 'To Be Deleted' });

    const wrapper = mount(RemoteView);

    const deleteButton = wrapper.find('button.danger');
    await deleteButton.trigger('click');

    expect(overlayStore.overlays).toHaveLength(0);

    
    
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

  it('displays controls when connected with an overlay', async () => {
    mockUseRoute.query = { roomId: 'test-room' }
    const store = useMainStore()
    store.isConnected = true
    store.roomId = 'test-room'
    store.room = { users: [{ id: 'overlay1', isRemote: false }], capacity: 2 } // Mock an overlay user

    const wrapper = mount(RemoteView)

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.controls').exists()).toBe(true)
    expect(wrapper.text()).toContain('Connected to room: test-room')
  })

  it('shows "Waiting for an overlay..." message when connected but no overlays are present', async () => {
    mockUseRoute.query = { roomId: 'test-room' }
    const store = useMainStore()
    store.isConnected = true
    store.roomId = 'test-room'
    store.room = { users: [{ id: 'remote1', isRemote: true }], capacity: 2 } // Only remote user

    const wrapper = mount(RemoteView)

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.controls').exists()).toBe(false)
    expect(wrapper.text()).toContain('En attente de connexion à un overlay...')
  })

  it('calls sendMessage on input', async () => {
    mockUseRoute.query = { roomId: 'test-room' }
    const store = useMainStore()
    const sendMessageSpy = vi.spyOn(store, 'sendMessage')
    store.isConnected = true
    store.room = { users: [{ id: 'overlay1', isRemote: false }], capacity: 2 } // Mock an overlay user

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
    store.room = { users: [{ id: 'overlay1', isRemote: false }], capacity: 2 } // Mock an overlay user

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

