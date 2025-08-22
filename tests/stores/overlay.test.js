import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useOverlayStore } from '../../src/stores/overlay';

describe('Overlay Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should add an overlay', () => {
    const store = useOverlayStore();
    store.addOverlay({ name: 'Test Overlay' });
    expect(store.overlays).toHaveLength(1);
    expect(store.overlays[0].name).toBe('Test Overlay');
  });

  it('should not add an overlay with invalid data', () => {
    const store = useOverlayStore();
    store.addOverlay({ name: 123 });
    expect(store.overlays).toHaveLength(0);
  });

  it('should remove an overlay', () => {
    const store = useOverlayStore();
    store.addOverlay({ name: 'Test Overlay' });
    const overlayId = store.overlays[0].id;
    store.removeOverlay(overlayId);
    expect(store.overlays).toHaveLength(0);
  });

  it('should update an overlay', () => {
    const store = useOverlayStore();
    store.addOverlay({ name: 'Test Overlay' });
    const overlayId = store.overlays[0].id;
    store.updateOverlay(overlayId, { name: 'Updated Overlay' });
    expect(store.overlays[0].name).toBe('Updated Overlay');
  });
});
