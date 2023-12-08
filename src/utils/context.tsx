import { createContext, useContext, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { getItem } from './storage';
import { Adventure, World } from '../types';

const initialState = {
  currentWorld: '',
  opacity: 50,
  animate: false,
  deleteMode: false,
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
  const [state, setState] = useLocalStorage(() => getItem('brainer', initialState));

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

const initialSettingsState = {
  devMode: false,
}

const initialCreateWorldState = {
  name: '',
  img: ''
}

const initialModalState = {
  createWorldModal: {} as ModalObj<typeof initialCreateWorldState>,
  editWorldModal: {} as ModalObj<World>,
  createAdventureModal: {} as ModalObj<Adventure>,
  editAdventureModal: {} as ModalObj<Adventure>,
  settingsModal: {} as ModalObj<Partial<typeof initialSettingsState>>,
}

const ModalContext = createContext(initialModalState);

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const createWorldModal = useGenericModal(initialCreateWorldState);
  const editWorldModal = useGenericModal<World>({ name: '', img: '', adventures: [], slug: '', createdAt: 0 })
  const createAdventureModal = useGenericModal<Adventure>({ description: '', urgent: false, important: false, createdAt: 0 })
  const editAdventureModal = useGenericModal<Adventure>({ description: '', urgent: false, important: false, createdAt: 0 })
  const settingsModal = useGenericModal<Partial<typeof initialSettingsState>>(initialSettingsState);

  return (
    <ModalContext.Provider value={{ createWorldModal, editWorldModal, createAdventureModal, editAdventureModal, settingsModal }}>
      {children}
    </ModalContext.Provider>
  )

}
