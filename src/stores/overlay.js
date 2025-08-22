import { defineStore } from 'pinia';
import Overlay from '@/lib/Overlay';

export const useOverlayStore = defineStore('overlay', {
  state: () => ({
    overlays: [],
  }),
  actions: {
    addOverlay(overlayData) {
      try {
        const newOverlay = new Overlay(overlayData);
        this.overlays.push(newOverlay);
      } catch (error) {
        console.error(error.message);
      }
    },
    removeOverlay(overlayId) {
      this.overlays = this.overlays.filter((overlay) => overlay.id !== overlayId);
    },
    updateOverlay(overlayId, updatedData) {
      const overlayIndex = this.overlays.findIndex((overlay) => overlay.id === overlayId);
      if (overlayIndex !== -1) {
        this.overlays[overlayIndex] = { ...this.overlays[overlayIndex], ...updatedData };
      }
    },
  },
});
