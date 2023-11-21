import React, { createContext, useContext, useState } from 'react'
import Button from './button';

function useModal<T>(initialState: T) {
    const [state, setState] = useState<T>(initialState);
    const [show, setShow] = useState(false);

    const open = () => {
        setShow(true);
    }

    const close = () => {
        setShow(false);
        setState(initialState);
    }

    return {
        show,
        open,
        close,
        state,
        setState
    }
}

const MCtx = createContext({
    createModal: {},
    editModal: {}
});

const useMCtx = () => useContext(MCtx);

function useCreateModal() { return useMCtx().createModal }

function useEditModal() { return useMCtx().editModal }

function MCtxProvider({ children }: { children?: React.ReactNode }) {
    const createModal = useModal({ name: '' });
    const editModal = useModal({ name: 'nikit' });
    return (
        <MCtx.Provider value={{ createModal, editModal }}>
            {children}
        </MCtx.Provider>
    )
}

function Modal({ children }: { children: React.ReactNode }) {
    return (
        <div>
            {children}
        </div>
    )
}


export function Controls() {

    const { show, open } = useCreateModal();
    const { show: eShow, open: eOpen } = useEditModal();

    return (
        <div className='flex gap-4'>
            <Button onClick={open}>create</Button>
            <Button onClick={eOpen}>edit</Button>
        </div>
    )
}

export function DummyChild() {
    const { show, open, close, state, setState } = useCreateModal();
    const { show: eShow, open: eOpen, close: eClose, state: eState, setState: eSetState } = useEditModal();

    console.log({ eState });

    return (
        <div className='flex flex-col items-center bg-white p-4 gap-6 border w-60 mx-auto'>
            <Controls />
            {
                eShow &&
                <Modal>
                    <div className='flex flex-col gap-4 bg-black p-4 w-56'>
                        <h1>edit modal</h1>
                        <input value={eState.name} onChange={(e) => eSetState(s => ({ ...s, name: e.target.value }))} />
                        <Button onClick={() => { alert("saved: " + eState.name) }}>save</Button>
                        <Button onClick={eClose}>x</Button>
                    </div>
                </Modal>
            }
            {
                show &&
                <Modal>
                    <div className='flex flex-col gap-4 bg-black p-4 w-56'>
                        <h1>create modal</h1>
                        <input value={state.name} onChange={(e) => setState(s => ({ ...s, name: e.target.value }))} />
                        <Button onClick={() => { alert("created") }}>create</Button>
                        <Button onClick={close}>x</Button>
                    </div>
                </Modal>
            }
        </div>
    )

}

export function Dummy() {
    return (
        <MCtxProvider>
            <DummyChild />
        </MCtxProvider>
    )
}

export default Dummy;
