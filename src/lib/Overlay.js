import { v4 as uuidv4 } from 'uuid';

class Overlay {
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
}

export default Overlay;
