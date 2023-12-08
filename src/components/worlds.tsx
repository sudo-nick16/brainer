import React, { useEffect, useState } from 'react'
import { useStore } from '../utils/context'
import { loadImage } from '../utils/fileSystem';
import { World } from '../types';
import { Link } from 'react-router-dom';
import closeIcon from '../assets/close.png';

interface WorldsProps {
    className?: string
}

const WorldItem = ({ world }: { world: World }) => {
    const [img, setImg] = useState<string | undefined>(undefined);
    const { updateState } = useStore();

    useEffect(() => {
        const handleImage = async () => {
            const img = await loadImage(world.img);
            setImg(img);
        }
        handleImage();
    }, [world.img])


    return (
        img &&
        <Link onClick={() => updateState({ currentWorld: world.name })} to={world.slug}>
            <div key={world.slug} className='h-40 rounded-lg overflow-hidden bg-black cursor-pointer relative'>
                <img src={img} className='w-full h-full object-cover' />
                <div
                    className='z-10 px-3 line-clamp-2 bg-black bg-opacity-40 hover:bg-opacity-70 absolute top-0 left-0 w-full h-full font-black text-2xl flex justify-center items-center'
                >
                    {world.name}
                </div>
            </div>
        </Link>
    )
}

const Worlds: React.FC<WorldsProps> = ({ className }) => {
    const { worlds, updateState, deleteMode } = useStore();
    const deleteWorld = (world: World) => {
        updateState(curr => ({
            ...curr,
            worlds: curr.worlds.filter(w => w.createdAt !== world.createdAt)
        }))
    }
    return (
        <div className={`${className} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 grid-flow-row gap-8 container px-12`}>
            {
                worlds.map((world) =>
                    <div key={world.slug} className='relative cool-border p-[1px] rounded-lg'>
                        <WorldItem world={world} />
                        {
                            deleteMode &&
                            <img
                                onClick={() => deleteWorld(world)}
                                className='absolute top-0 right-0 active:opacity-75 translate-x-1/3 cursor-pointer -translate-y-1/3 h-8 w-8 z-50'
                                src={closeIcon}
                            />
                        }
                    </div>
                )
            }
        </div>
    )
}

export default Worlds
