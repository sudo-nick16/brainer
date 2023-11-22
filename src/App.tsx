import Navbar from './components/navbar'
import Worlds from './components/worlds'
import { ModalProvider, StoreProvider } from './utils/context'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import World from './components/world'
import CreateAdventureModal from './components/create-adventure-modal'
import CreateWorldModal from './components/create-world-modal'
import EditWorldModal from './components/edit-world-modal'
import EditAdventureModal from './components/edit-adventure-modal'
import SettingsModal from './components/settings-modal'

function App() {
    return (
        <BrowserRouter>
            <StoreProvider>
                <ModalProvider>
                    <div className='relative min-h-[100dvh]'>
                        <Navbar />
                        <Routes>
                            <Route path='/' element={<Worlds className='!mb-10' />} />
                            <Route path='/:world' element={<World />} />
                        </Routes>
                        <EditAdventureModal />
                        <CreateAdventureModal />
                        <CreateWorldModal />
                        <EditWorldModal />
                        <SettingsModal />
                    </div>
                </ModalProvider>
            </StoreProvider>
        </BrowserRouter>
    )
}

export default App
