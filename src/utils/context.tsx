import { createContext, useContext, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { getItem } from "./storage";
import { Adventure, World } from "../types";

const initialState = {
    currentWorld: "",
    editMode: false,
    showModal: false,
    worlds: [] as World[],
    matrixView: false,
}

type InitalState = typeof initialState;

const Store = createContext<{
    updateState: (arg: Partial<InitalState> | ((arg: InitalState) => InitalState)) => void
} & typeof initialState>({
    ...initialState,
    updateState: () => { }
});

export const useStore = () => useContext(Store)!;

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useLocalStorage(() => getItem("brainer", initialState));

    const updateState = (arg: Partial<InitalState> | ((arg: InitalState) => InitalState)) => {
        if (typeof arg === 'function') {
            setState((s) => arg(s));
            return;
        }
        setState(curr => ({ ...curr, ...arg }));
    }

    return (
        <Store.Provider value={{ ...state, updateState }}>
            {children}
        </Store.Provider>
    )
}

export const useGenericModal = <T,>(initialState: T) => {
    const [state, setState] = useState<T>(initialState);
    const [show, setShow] = useState(false);

    const open = () => {
        setShow(true);
    }

    const updateState = (arg: Partial<T> | ((obj: T) => T)) => {
        if (typeof arg === 'function') {
            setState(curr => arg(curr));
            return;
        }
        setState(curr => ({
            ...curr,
            ...arg
        }));
    }

    const close = () => {
        setShow(false);
        setState(initialState);
    }

    return {
        open,
        close,
        show,
        setShow,
        state,
        setState: updateState,
    }
}

type ModalObj<T> = ReturnType<typeof useGenericModal<T>>


const initialModalState = {
    createWorldModal: {} as ModalObj<Partial<World>>,
    editWorldModal: {} as ModalObj<Partial<World>>,
    createAdventureModal: {} as ModalObj<Partial<Adventure>>,
    editAdventureModal: {} as ModalObj<Partial<Adventure>>,
}

export type InitialModalState = typeof initialModalState;

const ModalContext = createContext(initialModalState);

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const createWorldModal = useGenericModal<Partial<World>>({ name: '', img: '' });
    const editWorldModal = useGenericModal<Partial<World>>({ name: '', img: '' })
    const createAdventureModal = useGenericModal<Partial<Adventure>>({ description: '', urgent: false, important: false })
    const editAdventureModal = useGenericModal<Partial<Adventure>>({ description: '', urgent: false, important: false })

    return (
        <ModalContext.Provider value={{ createWorldModal, editWorldModal, createAdventureModal, editAdventureModal }}>
            {children}
        </ModalContext.Provider>
    )

}
