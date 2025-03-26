import { create } from 'zustand';

interface StoreState {
  count: number;
  increaseCount: () => void;
  decreaseCount: () => void;
  data: any;
  fetchData: () => Promise<void>;
}

const useStore = create<StoreState>(set => ({
  count: 0,
  increaseCount: () => set(state => ({ count: state.count + 1 })),
  decreaseCount: () => set(state => ({ count: state.count - 1 })),
  data: null,
  fetchData: async () => {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    set({ data });
  },
}));

export default useStore;