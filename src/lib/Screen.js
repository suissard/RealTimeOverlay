import { v4 as uuidv4 } from 'uuid';
import Overlay from './Overlay.js';

class Screen {
  /**
   * Crée une instance de Screen.
   * @param {object} options - Les options pour l'écran.
   * @param {string} options.name - Le nom de l'écran.
   * @param {string} [options.id=uuidv4()] - L'ID de l'écran.
   * @param {Array<object>} [options.overlays=[]] - La liste des overlays de l'écran.
   */
  constructor({ name, id = uuidv4(), overlays = [] }) {
    if (!name) {
      throw new Error('Screen name is required');
    }

    this.id = id;
    this.name = name;
    this.overlays = overlays.map(overlayData => new Overlay(overlayData));
  }

  /**
   * Ajoute un overlay à l'écran.
   * @param {Overlay} overlay - L'overlay à ajouter.
   */
  addOverlay(overlay) {
    if (!(overlay instanceof Overlay)) {
      throw new Error('Can only add Overlay objects to a screen.');
    }
    this.overlays.push(overlay);
  }

  /**
   * Supprime un overlay de l'écran.
   * @param {string} overlayId - L'ID de l'overlay à supprimer.
   */
  removeOverlay(overlayId) {
    this.overlays = this.overlays.filter(overlay => overlay.id !== overlayId);
  }

  /**
   * Retourne une représentation JSON de l'écran.
   * @returns {object} La représentation JSON de l'écran.
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      overlays: this.overlays.map(overlay => overlay.toJSON())
    };
  }

  /**
   * Crée une instance de Screen à partir d'une représentation JSON.
   * @param {string|object} json - La représentation JSON de l'écran.
   * @returns {Screen} Une nouvelle instance de Screen.
   */
  static fromJSON(json) {
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    return new Screen(data);
  }
}

export default Screen;
