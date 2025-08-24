import { describe, it, expect } from 'vitest';
import Screen from '../../src/lib/Screen';
import Overlay from '../../src/lib/Overlay';

describe('Screen', () => {
  it('should create a screen with default values', () => {
    const screen = new Screen({ name: 'Test Screen' });
    expect(screen.name).toBe('Test Screen');
    expect(screen.id).toBeTypeOf('string');
    expect(screen.overlays).toEqual([]);
  });

  it('should throw an error if name is not provided', () => {
    expect(() => new Screen({})).toThrow('Screen name is required');
  });

  it('should add an overlay to the screen', () => {
    const screen = new Screen({ name: 'Test Screen' });
    const overlay = new Overlay({ name: 'Test Overlay' });
    screen.addOverlay(overlay);
    expect(screen.overlays.length).toBe(1);
    expect(screen.overlays[0]).toBe(overlay);
  });

  it('should remove an overlay from the screen', () => {
    const screen = new Screen({ name: 'Test Screen' });
    const overlay = new Overlay({ name: 'Test Overlay' });
    screen.addOverlay(overlay);
    screen.removeOverlay(overlay.id);
    expect(screen.overlays.length).toBe(0);
  });

  it('should serialize to JSON', () => {
    const screen = new Screen({ name: 'Test Screen' });
    const overlay = new Overlay({ name: 'Test Overlay' });
    screen.addOverlay(overlay);
    const json = screen.toJSON();
    expect(json.name).toBe('Test Screen');
    expect(json.id).toBe(screen.id);
    expect(json.overlays.length).toBe(1);
    expect(json.overlays[0].name).toBe('Test Overlay');
  });

  it('should deserialize from JSON', () => {
    const overlayData = { name: 'Test Overlay', positionX: 100, positionY: 100 };
    const screenData = {
      name: 'Test Screen',
      overlays: [overlayData],
    };
    const screen = Screen.fromJSON(screenData);
    expect(screen.name).toBe('Test Screen');
    expect(screen.overlays.length).toBe(1);
    expect(screen.overlays[0].name).toBe('Test Overlay');
    expect(screen.overlays[0].positionX).toBe(100);
    expect(screen.overlays[0]).toBeInstanceOf(Overlay);
  });
});
