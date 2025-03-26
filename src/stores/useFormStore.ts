import { create } from 'zustand';

type FormValues = Record<string, any>;

interface FormStore {
    values: FormValues;
    setValues: (values: FormValues) => void;
    updateValue: (name: string, value: any) => void;
}

const useFormStore = create<FormStore>((set) => ({
    values: {},
    setValues: (values) => set({ values }),
    updateValue: (name, value) => set((state) => ({ values: { ...state.values, [name]: value } })),
}));

export default useFormStore;