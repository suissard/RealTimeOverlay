import { describe, it, expect } from 'vitest';
import Overlay from '../../src/lib/Overlay';

describe('Overlay', () => {
  it('should create an overlay with default values', () => {
    const overlay = new Overlay({ name: 'Test' });
    expect(overlay.name).toBe('Test');
    expect(overlay.id).toBeTypeOf('string');
    expect(overlay.positionX).toBe(0);
    expect(overlay.positionY).toBe(0);
    expect(overlay.container).toEqual([1920, 1080]);
    expect(overlay.parent).toBeNull();
    expect(overlay.props).toBeNull();
    expect(overlay.html).toBe('<div></div>');
    expect(overlay.css).toBeNull();
    expect(overlay.js).toBeNull();
  });

  it('should throw an error if name is not provided', () => {
    expect(() => new Overlay({})).toThrow('Overlay name is required');
  });

  it('should throw an error if name is not a string', () => {
    expect(() => new Overlay({ name: 123 })).toThrow('Overlay name must be a string');
  });

  it('should throw an error for invalid positionX', () => {
    expect(() => new Overlay({ name: 'Test', positionX: 'invalid' })).toThrow('positionX must be a number');
  });

  it('should throw an error for invalid positionY', () => {
    expect(() => new Overlay({ name: 'Test', positionY: 'invalid' })).toThrow('positionY must be a number');
  });

  it('should throw an error for invalid container', () => {
    expect(() => new Overlay({ name: 'Test', container: 'invalid' })).toThrow('container must be an array of two numbers');
    expect(() => new Overlay({ name: 'Test', container: [1] })).toThrow('container must be an array of two numbers');
    expect(() => new Overlay({ name: 'Test', container: [1, '2'] })).toThrow('container must be an array of two numbers');
  });
});
