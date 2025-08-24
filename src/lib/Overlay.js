import { v4 as uuidv4 } from 'uuid';

class Overlay {
  /**
   * Crée une instance d'Overlay.
   * @param {object} options - Les options pour l'overlay.
   * @param {string} options.name - Le nom de l'overlay.
   * @param {string} [options.id=uuidv4()] - L'ID de l'overlay.
   * @param {number} [options.positionX=0] - La position X de l'overlay.
   * @param {number} [options.positionY=0] - La position Y de l'overlay.
   * @param {Array<number>} [options.container=[1920, 1080]] - La taille du conteneur.
   * @param {string|null} [options.parent=null] - Le parent de l'overlay.
   * @param {object|null} [options.props=null] - Les props de l'overlay.
   * @param {string} [options.html='<div></div>'] - Le contenu HTML de l'overlay.
   * @param {string|null} [options.css=null] - Le contenu CSS de l'overlay.
   * @param {string|null} [options.js=null] - Le contenu JS de l'overlay.
   */
  constructor({
    name,
    id = uuidv4(),
    positionX = 0,
    positionY = 0,
    container = [1920, 1080],
    parent = null,
    props = null,
    html = '<div></div>',
    css = null,
    js = null,
  }) {
    if (!name) {
      throw new Error('Overlay name is required');
    }

    if (typeof name !== 'string') {
      throw new Error('Overlay name must be a string');
    }

    if (typeof positionX !== 'number') {
      throw new Error('positionX must be a number');
    }

    if (typeof positionY !== 'number') {
      throw new Error('positionY must be a number');
    }

    if (!Array.isArray(container) || container.length !== 2 || !container.every(item => typeof item === 'number')) {
      throw new Error('container must be an array of two numbers');
    }

    this.name = name;
    this.id = id;
    this.positionX = positionX;
    this.positionY = positionY;
    this.container = container;
    this.parent = parent;
    this.props = props;
    this.html = html;
    this.css = css;
    this.js = js;
  }

  /**
   * Retourne une représentation JSON de l'overlay.
   * @returns {object} La représentation JSON de l'overlay.
   */
  toJSON() {
    return {
      name: this.name,
      id: this.id,
      positionX: this.positionX,
      positionY: this.positionY,
      container: this.container,
      parent: this.parent,
      props: this.props,
      html: this.html,
      css: this.css,
      js: this.js,
    };
  }
}

export default Overlay;
