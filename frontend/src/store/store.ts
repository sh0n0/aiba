import { type UserSlice, createUserSlice, initialUserSlice } from "@/store/user";
import { devtools } from "zustand/middleware";
import { create } from "zustand/react";

export type State = UserSlice & {
	clearAll: () => void;
};

export const useAppStore = create<State>()(
	devtools((...args) => {
		return {
			...createUserSlice(...args),
			clearAll: () => {
				const set = args[0];
				set(() => ({
					...initialUserSlice,
				}));
				localStorage.clear();
			},
		};
	}),
);
