import { v4 as uuidv4 } from 'uuid';
import Overlay from './Overlay.js';

class Screen {
  constructor({ name, id = uuidv4(), overlays = [] }) {
    if (!name) {
      throw new Error('Screen name is required');
    }

    this.id = id;
    this.name = name;
    this.overlays = overlays.map(overlayData => new Overlay(overlayData));
  }

  addOverlay(overlay) {
    if (!(overlay instanceof Overlay)) {
      throw new Error('Can only add Overlay objects to a screen.');
    }
    this.overlays.push(overlay);
  }

  removeOverlay(overlayId) {
    this.overlays = this.overlays.filter(overlay => overlay.id !== overlayId);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      overlays: this.overlays.map(overlay => overlay.toJSON())
    };
  }

  static fromJSON(json) {
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    return new Screen(data);
  }
}

export default Screen;
