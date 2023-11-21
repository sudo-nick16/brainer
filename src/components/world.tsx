import { useEffect, useMemo, useState } from 'react';
import { useModal, useStore } from '../utils/context'
import { useNavigate, useParams } from 'react-router-dom'
import { loadImage } from '../utils/fileSystem';
import { Adventure } from '../types';

const World = () => {
    const { updateState } = useStore();
    const params = useParams();
    console.log("virtually rendered world.");
    const navigate = useNavigate();
    const { worlds, matrixView } = useStore();
    const world = useMemo(() => worlds.find(w => w.slug === params.world), [worlds]);
    const [img, setImg] = useState('');
    const modals = useModal();
    const { setState, open } = useMemo(() => modals.editAdventureModal, [])
    const { setState: setWorld } = useMemo(() => modals.editWorldModal, []);

    useEffect(() => {
        if (!world) {
            navigate("/");
            return;
        }
        loadImage(world.img).then(i => setImg(i));
        updateState({ currentWorld: world.name });
        setWorld(world);
        return () => {
            updateState({ currentWorld: '', showModal: false });
        }
    }, [world]);

    const onAdventureClick = (adventure: Adventure) => {
        setState(adventure);
        open();
    }

    return (
        world &&
        <>
            <img src={img} className='absolute top-0 left-0 opacity-40 -z-10 w-full h-full object-cover' />
            {
                !matrixView ?
                    <div className='container px-12 flex flex-wrap gap-3 p-4 text-sm'>
                        {
                            world.adventures.map((adv) => {
                                return (
                                    <div
                                        key={adv.createdAt}
                                        onClick={() => onAdventureClick(adv)}
                                        className='capitalize bg-white px-3 py-2 cursor-pointer line-clamp-2 text-black font-semibold rounded-md h-fit w-fit'
                                    >
                                        {adv.description}
                                    </div>
                                )
                            })
                        }
                    </div>
                    :
                    <>
                        <div className="h-[calc(100dvh-8rem)] text-sm container px-12 py-4 gap-4 grid grid-cols-2 grid-rows-2">
                            <div className='relative bg-black bg-opacity-40 border border-dashed rounded-lg p-4 gap-2 flex'>
                                <span className='absolute top-0 bg-black px-2 rounded-sm left-1/2 -translate-x-1/2 -translate-y-1/2'>Urgent</span>
                                <span className='absolute top-1/2 bg-black px-2 rounded-sm left-0 -translate-x-1/2 -translate-y-1/2 -rotate-90'>Important</span>
                                {
                                    world.adventures.map(adv => {
                                        if (adv.urgent && adv.important) {
                                            return (
                                                <div
                                                    key={adv.createdAt}
                                                    onClick={() => onAdventureClick(adv)}
                                                    className='capitalize bg-white px-3 py-2 cursor-pointer line-clamp-2 text-black font-semibold rounded-md h-fit w-fit'
                                                >
                                                    {adv.description}
                                                </div>
                                            )
                                        }
                                        return null
                                    })
                                }
                            </div>
                            <div className='relative bg-black bg-opacity-40 border border-dashed rounded-lg p-4 gap-2 flex'>
                                <span className='absolute top-0 bg-black px-2 rounded-sm left-1/2 -translate-x-1/2 -translate-y-1/2'>Not Urgent</span>
                                {
                                    world.adventures.map(adv => {
                                        if (!adv.urgent && adv.important) {
                                            return (
                                                <div
                                                    key={adv.createdAt}
                                                    onClick={() => onAdventureClick(adv)}
                                                    className='capitalize bg-white px-3 py-2 cursor-pointer line-clamp-2 text-black font-semibold rounded-md h-fit w-fit'
                                                >
                                                    {adv.description}
                                                </div>
                                            )
                                        }
                                        return null
                                    })
                                }
                            </div>
                            <div className='relative bg-black bg-opacity-40 border border-dashed rounded-lg p-4 gap-2 flex'>
                                <span className='absolute top-1/2 bg-black px-2 rounded-sm left-0 -translate-x-1/2 -translate-y-1/2 -rotate-90'>Not Important</span>
                                {
                                    world.adventures.map(adv => {
                                        if (adv.urgent && !adv.important) {
                                            return (
                                                <div
                                                    key={adv.createdAt}
                                                    onClick={() => onAdventureClick(adv)}
                                                    className='capitalize bg-white px-3 py-2 cursor-pointer line-clamp-2 text-black font-semibold rounded-md h-fit w-fit'
                                                >
                                                    {adv.description}
                                                </div>
                                            )
                                        }
                                        return null
                                    })
                                }
                            </div>
                            <div className='relative bg-black bg-opacity-40 border border-dashed rounded-lg p-4 gap-2 flex'>
                                {
                                    world.adventures.map(adv => {
                                        if (!adv.urgent && !adv.important) {
                                            return (
                                                <div
                                                    key={adv.createdAt}
                                                    onClick={() => onAdventureClick(adv)}
                                                    className='capitalize bg-white px-3 py-2 cursor-pointer line-clamp-2 text-black font-semibold rounded-md h-fit w-fit'
                                                >
                                                    {adv.description}
                                                </div>
                                            )
                                        }
                                        return null
                                    })
                                }
                            </div>
                        </div >
                    </>
            }
        </>
    )
}

export default World
