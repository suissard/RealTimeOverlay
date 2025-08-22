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
  });
});
