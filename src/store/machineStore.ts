import { create } from 'zustand';

interface MachineStore {
  order_idx: number;
  machine_order: string[];
  initOrderIdx: () => void;
  addOrderIdx: () => void;
  isFinished: () => boolean;
}

export const useMachineStore = create<MachineStore>((set, get) => ({
  order_idx: 0,  
  machine_order: ["1", "3", "2"],
  initOrderIdx: () => set({ order_idx: 0 }),
  addOrderIdx: () => set((state) => ({ order_idx: state.order_idx + 1 })),
  isFinished: () => {
    const state = get();
    return state.order_idx >= state.machine_order.length;
  },
}));