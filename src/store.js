// src/store.js
import { create } from 'zustand';

const useStore = create((set) => ({
  userRole: null,
  setUserRole: (role) => set({ userRole: role }),
  activeSection: 'home',
  setActiveSection: (section) => set({ activeSection: section }),
  modals: {
    EditModal: false,
    DeleteModal: false,
    TeamModal: false,
    DocumentModal: false,
    PhotoModal: false,
    EventModal: false,
    QuickModal: false,
    AnnouncementModal: false,
    BenefitsModal: false,
    PhotoViewerModal: false,
  },
  openModal: (modalName) => set((state) => ({
    modals: { ...state.modals, [modalName]: true },
  })),
  closeModal: (modalName) => set((state) => ({
    modals: { ...state.modals, [modalName]: false },
  })),
}));

export default useStore;