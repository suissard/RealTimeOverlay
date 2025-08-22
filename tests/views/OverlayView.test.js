import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import OverlayView from '../../src/views/OverlayView.vue';
import { useMainStore } from '../../src/stores/main';
import OverlayObject from '../../src/components/OverlayObject.vue';
import { nextTick } from 'vue';

// Mock the useRoute hook
vi.mock('vue-router', () => ({
  useRoute: () => ({
    query: {
      roomId: 'test-room'
    }
  })
}));

describe('OverlayView.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should display a waiting message when no overlay is active', () => {
    const wrapper = mount(OverlayView);
    expect(wrapper.text()).toContain("En attente d'un overlay...");
    expect(wrapper.findComponent(OverlayObject).exists()).toBe(false);
  });

  it('should render OverlayObject when an overlay message is received', async () => {
    const wrapper = mount(OverlayView);
    const mainStore = useMainStore();

    const overlayData = {
      id: '1',
      name: 'Test Overlay',
      positionX: 0,
      positionY: 0,
      container: [1920, 1080],
      parent: null,
      props: null,
      html: '<div></div>',
      css: null,
      js: null,
    };
    mainStore.message = { type: 'overlay', content: overlayData };

    await nextTick();

    expect(wrapper.findComponent(OverlayObject).exists()).toBe(true);
    expect(wrapper.findComponent(OverlayObject).props('overlay')).toEqual(overlayData);
    expect(wrapper.text()).not.toContain("En attente d'un overlay...");
  });
});
