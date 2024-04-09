import { createContext, useContext } from "react";
import { RootStore } from "../stores/root-store";



// 
export const RootStoreContext = createContext<RootStore | null>(null);

export const RootStoreProvider = RootStoreContext.Provider;

export const useStore = () => {
    const context = useContext(RootStoreContext);

    if (context === null) {
        throw new Error('');
    }

    return context;
}
