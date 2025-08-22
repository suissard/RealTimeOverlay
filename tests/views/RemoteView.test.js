import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import RemoteView from '../../src/views/RemoteView.vue';
import { useOverlayStore } from '../../src/stores/overlay';
import { useMainStore } from '../../src/stores/main';

// Mock lodash throttle to execute immediately
vi.mock('lodash', () => ({
  throttle: (fn) => fn,
}));

// Mock socket.io-client
const mockSocket = {
  on: vi.fn(),
  emit: vi.fn(),
};
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => mockSocket),
}));

// Mock vue-router
const mockUseRoute = {
  query: {}
};
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => mockUseRoute)
}));

describe('RemoteView.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // Reset mocks before each test
    mockUseRoute.query = {};
    vi.clearAllMocks();
    mockSocket.on.mockClear();
    mockSocket.emit.mockClear();
  });

  it('should create a new overlay', async () => {
    const overlayStore = useOverlayStore();
    const wrapper = mount(RemoteView);

    await wrapper.find('input[id="newName"]').setValue('My New Overlay');
    await wrapper.find('form').trigger('submit.prevent');

    expect(overlayStore.overlays).toHaveLength(1);
    expect(overlayStore.overlays[0].name).toBe('My New Overlay');
  });

  it('should display existing overlays', async () => {
    mockUseRoute.query = { roomId: 'test-room' };
    const overlayStore = useOverlayStore();
    const mainStore = useMainStore();
    mainStore.isConnected = true;
    // Set a room so that hasOverlay is true
    mainStore.room = { users: [{ id: 'overlay1', isRemote: false }], capacity: 2 };
    overlayStore.addOverlay({ name: 'Existing Overlay' });
    const overlayId = overlayStore.overlays[0].id;

    const wrapper = mount(RemoteView);
    await wrapper.vm.$nextTick();

    const nameInput = wrapper.find(`input[id="name-${overlayId}"]`);
    expect(nameInput.exists()).toBe(true);
    expect(nameInput.element.value).toBe('Existing Overlay');
  });

  it('should update an existing overlay', async () => {
    const overlayStore = useOverlayStore();
    const spy = vi.spyOn(overlayStore, 'updateOverlay');
    overlayStore.addOverlay({ name: 'Original Name' });
    const overlayId = overlayStore.overlays[0].id;

    const wrapper = mount(RemoteView);

    const nameInput = wrapper.find(`input[id="name-${overlayId}"]`);
    await nameInput.setValue('Updated Name');

    expect(spy).toHaveBeenCalledWith(overlayId, { name: 'Updated Name' });
  });

  it('should delete an overlay', async () => {
    const overlayStore = useOverlayStore();
    const spy = vi.spyOn(overlayStore, 'removeOverlay');
    overlayStore.addOverlay({ name: 'To Be Deleted' });
    const overlayId = overlayStore.overlays[0].id;

    const wrapper = mount(RemoteView);

    const deleteButton = wrapper.find(`[data-overlay-id="${overlayId}"] .button-group button`);
    await deleteButton.trigger('click');

    expect(spy).toHaveBeenCalledWith(overlayId);
  });

  it('shows an error if no roomId is provided', async () => {
    const wrapper = mount(RemoteView);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.alert-error').text()).toContain('No Room ID was provided');
  });

  it('shows "Connecting to room..." message initially', () => {
    mockUseRoute.query = { roomId: 'test-room' };
    const mainStore = useMainStore();
    mainStore.isConnected = false;

    const wrapper = mount(RemoteView);
    expect(wrapper.text()).toContain('Connecting to room...');
  });

  it('displays controls when connected with an overlay', async () => {
    mockUseRoute.query = { roomId: 'test-room' };
    const store = useMainStore();
    store.isConnected = true;
    store.roomId = 'test-room';
    store.room = { users: [{ id: 'overlay1', isRemote: false }], capacity: 2 };

    const wrapper = mount(RemoteView);
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.controls').exists()).toBe(true);
  });

  it('shows "Waiting for an overlay..." message when connected but no overlays are present', async () => {
    mockUseRoute.query = { roomId: 'test-room' };
    const store = useMainStore();
    store.isConnected = true;
    store.roomId = 'test-room';
    store.room = { users: [{ id: 'remote1', isRemote: true }], capacity: 2 };

    const wrapper = mount(RemoteView);
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.controls').exists()).toBe(false);
    expect(wrapper.text()).toContain('En attente de connexion à un overlay...');
  });

  it('calls sendMessage on input', async () => {
    mockUseRoute.query = { roomId: 'test-room' };
    const store = useMainStore();
    const sendMessageSpy = vi.spyOn(store, 'sendMessage');
    store.isConnected = true;
    store.room = { users: [{ id: 'overlay1', isRemote: false }], capacity: 2 };

    const wrapper = mount(RemoteView);
    await wrapper.vm.$nextTick();

    const input = wrapper.find('.controls input[type="text"]');
    await input.setValue('hello');

    expect(sendMessageSpy).toHaveBeenCalledWith('hello');
  });

  it('calls manageSlots on button click', async () => {
    mockUseRoute.query = { roomId: 'test-room' };
    const store = useMainStore();
    const manageSlotsSpy = vi.spyOn(store, 'manageSlots');
    store.isConnected = true;
    store.room = { users: [{ id: 'overlay1', isRemote: false }], capacity: 2 };

    const wrapper = mount(RemoteView);
    await wrapper.vm.$nextTick();

    const addButton = wrapper.find('.controls .btn-primary');
    const removeButton = wrapper.find('.controls .btn-secondary');

    await addButton.trigger('click');
    expect(manageSlotsSpy).toHaveBeenCalledWith('add');

    await removeButton.trigger('click');
    expect(manageSlotsSpy).toHaveBeenCalledWith('remove');
  });
});
