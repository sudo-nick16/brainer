import { useModal, useStore } from '../utils/context';
import Button from './button';
import { Link, matchPath, useLocation } from 'react-router-dom';
import settingsIcon from '../assets/gear.png';
import editIcon from '../assets/edit.png';
import gridIcon from '../assets/grid.png';
import plusIcon from '../assets/plus.png';
import binIcon from '../assets/bin.png';

const Navbar = () => {
    const world = matchPath('/:world', useLocation().pathname)?.params.world;
    const createWorldModal = useModal().createWorldModal;
    const editWorldModal = useModal().editWorldModal;
    const createAdventureModal = useModal().createAdventureModal;
    const settingsModal = useModal().settingsModal;
    const { currentWorld, worlds, matrixView, updateState, deleteMode } = useStore();

    const showModal = () => {
        if (!currentWorld) {
            createWorldModal.open();
            return;
        }
        createAdventureModal.open();
        return;
    }

    return (
        <div className='bg-background h-32 bg-opacity-40 backdrop-blur-md sticky top-0 z-50 flex flex-col justify-center'>
            <div className='container px-12 flex flex-row items-center'>
                <div className='font-black text-lg xs:text-xl sm:text-2xl max-w-fit'>
                    <Link to='/'>
                        <span>
                            My Worlds
                        </span>
                    </Link>
                    {
                        world ? <>
                            <span className='text-accent mx-2'>&gt;</span>
                            <Link to={world}>
                                <span>
                                    {currentWorld}
                                </span>
                            </Link>
                        </> : <></>
                    }
                </div>
                <Button variant='gray' onClick={showModal} className='ml-2'>
                    <img src={plusIcon} className='w-5 h-5' />
                </Button>
                {
                    world && <Button variant='gray' className='ml-2' onClick={() => {
                        const w = worlds.find(w => w.slug === world);
                        if (!w) {
                            alert('error: no world found.');
                            return;
                        }
                        editWorldModal.setState(w);
                        editWorldModal.open();
                    }}>
                        <img src={editIcon} className='w-5 h-5' />
                    </Button>
                }
                <Button onClick={() => updateState({ matrixView: !matrixView })} variant='gray' className={`ml-2 ${matrixView ? 'bg-secondary' : ''}`}>
                    <img src={gridIcon} className='w-5 h-5' />
                </Button>
                <Button variant='gray' onClick={() => updateState({ deleteMode: !deleteMode })} className={`ml-auto ${deleteMode ? 'bg-secondary' : ''}`}>
                    <img src={binIcon} className='w-5 h-5' />
                </Button>
                <Button variant='gray' onClick={settingsModal.open} className='ml-2'>
                    <img src={settingsIcon} className='w-5 h-5' />
                </Button>
            </div>
        </div>
    )
}

export default Navbar
