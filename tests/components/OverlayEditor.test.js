import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import OverlayEditor from '../../src/components/OverlayEditor.vue';
import { useOverlayStore } from '../../src/stores/overlay';
import Overlay from '../../src/lib/Overlay';

describe('OverlayEditor.vue', () => {
  let overlay;
  let wrapper;
  let overlayStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    overlay = new Overlay({
      name: 'Test Overlay',
      html: '<h1>Test</h1>',
      css: 'h1 { color: red; }',
      js: 'console.log("test")',
      props: {
        aString: 'hello',
        aNumber: 123,
        aBoolean: true,
        anObject: { nested: 'value' }
      }
    });

    wrapper = mount(OverlayEditor, {
      props: {
        overlay
      }
    });

    overlayStore = useOverlayStore();
  });

  it('renders all form fields with the correct initial values', () => {
    // Check main fields
    const nameInput = wrapper.findAll('input[type="text"]').find(i => i.element.value === 'Test Overlay');
    expect(nameInput.exists()).toBe(true);

    // Check dynamic props fields
    const propsGrid = wrapper.find('.props-grid');
    expect(propsGrid.exists()).toBe(true);

    // String prop
    const stringInput = propsGrid.findAll('input[type="text"]').find(i => i.element.value === 'hello');
    expect(stringInput.exists()).toBe(true);

    // Number prop
    const numberInput = propsGrid.find('input[type="number"]');
    expect(numberInput.element.value).toBe('123');

    // Boolean prop
    const booleanInput = propsGrid.find('input[type="checkbox"]');
    expect(booleanInput.element.checked).toBe(true);

    // Object prop (textarea)
    const objectTextarea = propsGrid.find('textarea');
    expect(JSON.parse(objectTextarea.element.value)).toEqual({ nested: 'value' });
  });

  it('calls updateOverlay on input', async () => {
    const updateOverlaySpy = vi.spyOn(overlayStore, 'updateOverlay');
    await wrapper.find('input[type="text"]').setValue('New Name');
    expect(updateOverlaySpy).toHaveBeenCalled();
  });

  it('updates the preview iframe when html, css, or js changes', async () => {
    const newHtml = '<div>New Content</div>';
    const newCss = 'div { font-size: 20px; }';
    const newJs = 'alert("new")';

    await wrapper.find('[data-testid="html-input"]').setValue(newHtml);
    await wrapper.find('[data-testid="css-input"]').setValue(newCss);
    await wrapper.find('[data-testid="js-input"]').setValue(newJs);

    await wrapper.vm.$nextTick();

    const iframe = wrapper.find('iframe');
    const srcdoc = iframe.attributes('srcdoc');

    expect(srcdoc).toContain(newHtml);
    expect(srcdoc).toContain(newCss);
    expect(srcdoc).toContain(newJs);
  });
});
