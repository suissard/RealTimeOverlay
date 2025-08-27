import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import RemoteView from '../../src/views/RemoteView.vue';
import { useOverlayStore } from '../../src/stores/overlay';
import { useMainStore } from '../../src/stores/main';

// Mock lodash
vi.mock('lodash', async () => {
  const lodash = await vi.importActual('lodash');
  return {
    ...lodash,
    throttle: vi.fn(fn => fn),
    cloneDeep: lodash.cloneDeep, // Explicitly include cloneDeep
  };
});

// Mock socket.io-client
const mockSocket = {
  on: vi.fn(),
  emit: vi.fn(),
};
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => mockSocket),
}));

// Mock vue-router
const mockUseRoute = {
  query: {}
};
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => mockUseRoute)
}));

vi.mock('@/lib/presets', () => ({
  presets: [
    {
      name: 'Score Bar',
      type: 'score_bar',
      initialData: {
        name: 'Score Bar',
        props: {
          team1Name: 'Team A',
          team2Name: 'Team B',
          team1Score: 0,
          team2Score: 0,
          team1Logo: '',
          team2Logo: '',
          backgroundColor: 'rgba(29, 38, 51, 0.8)',
          textColor: '#ffffff',
        },
        html: `<div>Scoreboard</div>`,
        css: ``,
        js: null,
        positionX: 560,
        positionY: 20,
        container: [800, 60],
      },
    },
    {
      name: 'Sponsor Carousel',
      type: 'sponsor_carousel',
      initialData: {
        name: 'Sponsors',
        props: {
          sponsors: [],
          duration: 3000,
        },
        html: `<div>Sponsors</div>`,
        css: ``,
        js: ``,
        positionX: 810,
        positionY: 950,
        container: [300, 80],
      },
    },
  ]
}));

describe('RemoteView.vue', () => {
  let mainStore;
  let wrapper;

  beforeEach(() => {
    setActivePinia(createPinia());
    mockUseRoute.query = {};
    vi.clearAllMocks();
    mockSocket.on.mockClear();
    mockSocket.emit.mockClear();

    mainStore = useMainStore();
    // Simulate connected state for most tests
    mainStore.isConnected = true;
    mainStore.roomId = 'test-room';
    mockUseRoute.query = { roomId: 'test-room' };

    wrapper = mount(RemoteView, {
      global: {
        stubs: {
          OverlayEditor: {
            template: '<div class="mock-overlay-editor"></div>',
            props: ['overlay']
          }
        }
      }
    });
  });

  describe('Editor Tab', () => {
    let overlayStore;

    beforeEach(async () => {
      overlayStore = useOverlayStore();
      overlayStore.addOverlay({ name: 'Existing Overlay' });
      // The view now defaults to the editor tab, so no click is needed
      // await wrapper.find('.tabs a:nth-child(2)').trigger('click');
    });

    it('should create a new overlay from a preset', async () => {
      const addOverlaySpy = vi.spyOn(overlayStore, 'addOverlay');

      // The create form is now in the editor tab
      await wrapper.find('input[id="newName"]').setValue('My Scoreboard');
      // No need to select a preset, the first one is selected by default
      await wrapper.find('form').trigger('submit.prevent');

      expect(addOverlaySpy).toHaveBeenCalledTimes(1);

      // Check that the created overlay has the correct properties from the preset
      const callArgument = addOverlaySpy.mock.calls[0][0];
      expect(callArgument.name).toBe('My Scoreboard');
      expect(callArgument.props).toBeDefined();
      expect(callArgument.props.team1Name).toBe('Team A');
    });

    it('should display a list of overlays', () => {
      expect(wrapper.find('.menu').text()).toContain('Existing Overlay');
    });

    it('should show the overlay editor when an overlay is selected', async () => {
      expect(wrapper.find('.mock-overlay-editor').exists()).toBe(false);
      await wrapper.find('.menu a').trigger('click');
      expect(wrapper.find('.mock-overlay-editor').exists()).toBe(true);
    });
  });

  describe('Connection Status', () => {
    it('shows an error if no roomId is provided', async () => {
      mockUseRoute.query = {};
      const freshWrapper = mount(RemoteView);
      await freshWrapper.vm.$nextTick();
      expect(freshWrapper.find('.alert-error').text()).toContain('No Room ID was provided');
    });

    it('shows "Connecting to room..." message initially', () => {
      mainStore.isConnected = false;
      const freshWrapper = mount(RemoteView);
      expect(freshWrapper.text()).toContain('Connecting to room...');
    });

    it('shows "Waiting for an overlay..." message when connected but no overlays are present', async () => {
      mainStore.room = { users: [{ id: 'remote1', isRemote: true }], capacity: 2 };
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.controls').exists()).toBe(false);
      expect(wrapper.text()).toContain('En attente de connexion à un overlay...');
    });
  });
});
