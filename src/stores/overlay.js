import { defineStore } from 'pinia';
import Overlay from '@/lib/Overlay';

export const useOverlayStore = defineStore('overlay', {
  state: () => ({
    overlays: [],
  }),
  actions: {
    /**
     * Ajoute un overlay au store.
     * @param {object} overlayData - Les données de l'overlay.
     */
    addOverlay(overlayData) {
      try {
        const newOverlay = new Overlay(overlayData);
        this.overlays.push(newOverlay);
      } catch (error) {
        console.error(error.message);
      }
    },
    /**
     * Supprime un overlay du store.
     * @param {string} overlayId - L'ID de l'overlay à supprimer.
     */
    removeOverlay(overlayId) {
      this.overlays = this.overlays.filter((overlay) => overlay.id !== overlayId);
    },
    /**
     * Met à jour un overlay dans le store.
     * @param {string} overlayId - L'ID de l'overlay à mettre à jour.
     * @param {object} updatedData - Les données mises à jour pour l'overlay.
     */
    updateOverlay(overlayId, updatedData) {
      const overlayIndex = this.overlays.findIndex((overlay) => overlay.id === overlayId);
      if (overlayIndex !== -1) {
        this.overlays[overlayIndex] = { ...this.overlays[overlayIndex], ...updatedData };
      }
    },
  },
});
