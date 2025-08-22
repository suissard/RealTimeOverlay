import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HomeView from '../src/views/HomeView.vue';
import { createRouter, createWebHistory } from 'vue-router';

// Mock the router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/remote', name: 'remote', component: { template: '<div>Remote</div>' } },
    { path: '/overlay', name: 'overlay', component: { template: '<div>Overlay</div>' } },
  ],
});

describe('HomeView.vue', () => {
  it('renders the main heading', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [router]
      }
    });
    expect(wrapper.find('h1').text()).toContain('Real-time Overlay');
  });
});
