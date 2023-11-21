import React, { useEffect, useState } from 'react'
import { useStore } from '../utils/context'
import { loadImage } from '../utils/fileSystem';
import { World } from '../types';
import { Link } from 'react-router-dom';

interface WorldsProps {
    className?: string
}

const WorldItem = ({ world }: { world: World }) => {
    const [img, setImg] = useState<string | undefined>(undefined);
    const { updateState } = useStore();

    useEffect(() => {
        loadImage(world.img).then(img => {
            setImg(img);
        }).catch(error => {
            console.log("error: could not load image. - ", error);
        });
    }, [])

    return (
        img &&
        <Link onClick={() => updateState({ currentWorld: world.name })} to={world.slug}>
            <div className='cool-border p-[1px] rounded-lg'>
                <div key={world.slug} className='h-40 rounded-lg overflow-hidden bg-black cursor-pointer relative'>
                    <img src={img} className='w-full h-full object-cover' />
                    <div
                        className='z-10 px-3 line-clamp-2 bg-black bg-opacity-40 hover:bg-opacity-70 absolute top-0 left-0 w-full h-full font-black text-2xl flex justify-center items-center'
                    >
                        {world.name}
                    </div>
                </div>
            </div>
        </Link>
    )
}

const Worlds: React.FC<WorldsProps> = ({ className }) => {
    const worlds = useStore().worlds;
    return (
        <div className={`${className} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 grid-flow-row gap-8 container px-12`}>
            {
                worlds.map((world) => <WorldItem key={world.slug} world={world} />)
            }
        </div>
    )
}

export default Worlds
