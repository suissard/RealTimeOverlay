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
      js: 'console.log("test")'
    });

    wrapper = mount(OverlayEditor, {
      props: {
        overlay
      }
    });

    overlayStore = useOverlayStore();
  });

  it('renders all form fields with the correct initial values', () => {
    expect(wrapper.find('input[type="text"]').element.value).toBe('Test Overlay');
    expect(wrapper.find('input[type="number"]').element.value).toBe('0');
    expect(wrapper.find('[data-testid="props-input"]').element.value).toBe('');
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
