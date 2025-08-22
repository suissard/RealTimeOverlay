import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import OverlayView from '../../src/views/OverlayView.vue';
import { useOverlayStore } from '../../src/stores/overlay';
import OverlayObject from '../../src/components/OverlayObject.vue';

describe('OverlayView.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should render no overlays if the store is empty', () => {
    const wrapper = mount(OverlayView);
    expect(wrapper.findAllComponents(OverlayObject)).toHaveLength(0);
  });

  it('should render overlays from the store', () => {
    const overlayStore = useOverlayStore();
    overlayStore.addOverlay({ name: 'Test 1' });
    overlayStore.addOverlay({ name: 'Test 2' });

    const wrapper = mount(OverlayView);
    expect(wrapper.findAllComponents(OverlayObject)).toHaveLength(2);
  });
});
