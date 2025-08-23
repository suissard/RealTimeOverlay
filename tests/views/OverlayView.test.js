import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import OverlayView from '../../src/views/OverlayView.vue';
import { useMainStore } from '../../src/stores/main';
import OverlayObject from '../../src/components/OverlayObject.vue';
import { nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Mock the vue-router module
vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(),
}));

describe('OverlayView.vue', () => {
  let mainStore;
  let mockRouter;
  let generateRoomIdSpy;
  let connectSpy;

  beforeEach(() => {
    setActivePinia(createPinia());
    mainStore = useMainStore();

    // Spy on store actions
    generateRoomIdSpy = vi.spyOn(mainStore, 'generateRoomId').mockImplementation(() => {
      mainStore.roomId = 'mock-room-id';
    });
    connectSpy = vi.spyOn(mainStore, 'connect');

    mockRouter = {
      push: vi.fn(),
    };

    useRouter.mockReturnValue(mockRouter);
  });

  it('should generate a roomId and redirect if none is in the query', async () => {
    useRoute.mockReturnValue({ query: {} });

    const wrapper = mount(OverlayView);

    expect(generateRoomIdSpy).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith({ query: { roomId: 'mock-room-id' } });
  });

  it('should connect with the roomId from the query', async () => {
    const roomId = 'test-room-123';
    useRoute.mockReturnValue({ query: { roomId } });

    const wrapper = mount(OverlayView);

    expect(mainStore.roomId).toBe(roomId);
    expect(connectSpy).toHaveBeenCalledWith(roomId, false);
  });

  it('should display QR code and ready message when connected', async () => {
    const roomId = 'test-room-123';
    useRoute.mockReturnValue({ query: { roomId } });

    const wrapper = mount(OverlayView);
    // Manually update the store state for the test
    mainStore.roomId = roomId;

    await nextTick();

    expect(wrapper.text()).toContain('Overlay Ready');
    expect(wrapper.find('canvas').exists()).toBe(true); // qrcode.vue renders to a canvas
    expect(wrapper.text()).toContain(roomId);
  });

  it('should render OverlayObject when an overlay message is received', async () => {
    const roomId = 'test-room-123';
    useRoute.mockReturnValue({ query: { roomId } });

    const wrapper = mount(OverlayView);
    mainStore.roomId = roomId;

    const overlayData = {
      id: '1',
      name: 'Test Overlay',
      html: '<div>Hello</div>',
      positionX: 0,
      positionY: 0,
      container: [1920, 1080],
      props: {},
      css: '',
      js: '',
    };
    mainStore.message = { type: 'overlay', content: overlayData };

    await nextTick();

    expect(wrapper.findComponent(OverlayObject).exists()).toBe(true);
    expect(wrapper.findComponent(OverlayObject).props('overlay')).toEqual(overlayData);
    expect(wrapper.text()).not.toContain('Overlay Ready');
  });
});
