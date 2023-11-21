import { useModal, useStore } from '../utils/context';
import Button from './button';
import { Link, matchPath, useLocation } from 'react-router-dom';

const Navbar = () => {
    const world = matchPath("/:world", useLocation().pathname)?.params.world;
    const createWorldModal = useModal().createWorldModal;
    const editWorldModal = useModal().editWorldModal;
    const createAdventureModal = useModal().createAdventureModal;
    const { currentWorld, worlds, matrixView, updateState } = useStore();

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
                <div className='font-black text-2xl max-w-fit'>
                    <Link to="/">
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
                <div
                    onClick={showModal}
                    className='ml-3 text-2xl font-black bg-secondary px-3 rounded-md cursor-pointer active:bg-opacity-75'
                >
                    +
                </div>
                {
                    world && <Button className='ml-3 py-1' onClick={() => {
                        const w = worlds.find(w => w.slug === world);
                        if (!w) {
                            alert("error: no world found.");
                            return;
                        }
                        editWorldModal.setState({ name: w.name, img: w.img });
                        editWorldModal.open();
                    }}>Edit</Button>
                }
                <Button onClick={() => updateState({ matrixView: !matrixView })} variant='gray' className='py-1 ml-2'>
                    {matrixView ? 'matrix' : 'soy'}
                </Button>
            </div>
        </div>
    )
}

export default Navbar
