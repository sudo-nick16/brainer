import Navbar from './components/navbar'
import Worlds from './components/worlds'
import { ModalProvider, StoreProvider, useModal } from './utils/context'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import World from './components/world'
import CreateAdventureModal from './components/create-adventure-modal'
import CreateWorldModal from './components/create-world-modal'
import EditWorldModal from './components/edit-world-modal'
import EditAdventureModal from './components/edit-adventure-modal'

function Modals() {
    const { createAdventureModal, editAdventureModal, createWorldModal, editWorldModal } = useModal();
    return (
        <>
            {
                createWorldModal.show && <CreateWorldModal />
            }
            {
                editWorldModal.show && <EditWorldModal />
            }
            {
                createAdventureModal.show && <CreateAdventureModal />
            }
            {
                editAdventureModal.show && <EditAdventureModal />
            }
        </>
    )
}

function App() {
    return (
        <BrowserRouter>
            <StoreProvider>
                <ModalProvider>
                    <div className='relative min-h-[100dvh]'>
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<Worlds className='!mb-10' />} />
                            <Route path="/:world" element={<World />} />
                        </Routes>
                        <EditAdventureModal />
                        <CreateAdventureModal />
                        <CreateWorldModal />
                        <EditWorldModal />
                    </div>
                </ModalProvider>
            </StoreProvider>
        </BrowserRouter>
    )
}

export default App
