import { useEffect, useMemo, useState } from 'react';
import { useModal, useStore } from '../utils/context'
import { useNavigate, useParams } from 'react-router-dom'
import { loadImage } from '../utils/fileSystem';
import { Adventure } from '../types';
import closeIcon from '../assets/close.png';

const matrixMap = [
  {
    u: true,
    i: true,
    legend:
      <>
        <span className='absolute select-none top-0 bg-black px-2 rounded-sm left-1/2 -translate-x-1/2 -translate-y-1/2'>Urgent</span>
        <span className='absolute select-none top-1/2 bg-black px-2 rounded-sm left-0 -translate-x-1/2 -translate-y-1/2 -rotate-90'>Important</span>
      </>
  },
  {
    u: false,
    i: true,
    legend:
      <>
        <span className='absolute select-none top-0 bg-black px-2 rounded-sm left-1/2 -translate-x-1/2 -translate-y-1/2'>Not Urgent</span>
      </>
  },
  {
    u: true,
    i: false,
    legend:
      <>
        <span className='absolute select-none top-1/2 bg-black px-2 rounded-sm left-0 -translate-x-1/2 -translate-y-1/2 -rotate-90'>Not Important</span>
      </>
  },
  {
    u: false,
    i: false,
    legend:
      <>
      </>
  }
]

const World = () => {
  const { updateState, currentWorld, deleteMode } = useStore();
  const params = useParams();
  const navigate = useNavigate();
  const { worlds, matrixView, opacity } = useStore();
  const world = useMemo(() => worlds.find(w => w.slug === params.world), [worlds, params.world]);
  const [img, setImg] = useState('');
  const { setState, open } = useModal().editAdventureModal;

  const deleteAdventure = (adv: Adventure) => {
    updateState((curr) => {
      const worlds = curr.worlds.map(w => {
        if (w.name === currentWorld) {
          return {
            ...w,
            adventures: w.adventures.filter(a => a.createdAt !== adv.createdAt)
          }
        }
        return w;
      })
      return {
        ...curr,
        worlds
      }
    })
  }

  useEffect(() => {
    if (!world) {
      navigate('/');
      return;
    }
    loadImage(world.img).then(i => setImg(i));
    updateState({ currentWorld: world.name });
    return () => {
      updateState({ currentWorld: '' });
    }
  }, [world]);

  const onAdventureClick = (adventure: Adventure) => {
    setState(adventure);
    open();
  }

  return (
    world &&
    <>
      <img src={img} style={{ opacity: `${opacity}%` }} className='absolute top-0 left-0 -z-10 w-full h-full object-cover' />
      {
        !matrixView ?
          <div className='container px-12 flex flex-wrap gap-3 p-4 text-sm'>
            {
              world.adventures.map((adv) => {
                return (
                  <div className='relative'>
                    <div
                      key={adv.createdAt}
                      onClick={() => onAdventureClick(adv)}
                      className='capitalize relative bg-white px-3 py-2 cursor-pointer line-clamp-2
                                        text-black font-semibold rounded-md h-fit w-fit'
                    >
                      {adv.description}
                    </div>
                    {
                      deleteMode &&
                      <img
                        onClick={() => deleteAdventure(adv)}
                        className='bg-background rounded-full absolute top-0 right-0 active:opacity-90 translate-x-1/2
                                        cursor-pointer -translate-y-1/2 h-5 w-5 z-50'
                        src={closeIcon}
                      />
                    }
                  </div>
                )
              })
            }
          </div>
          :
          <>
            <div className='h-[calc(100dvh-8rem)] text-sm container px-12 py-4 gap-4 grid grid-cols-2 grid-rows-2'>
              {
                matrixMap.map((mat, i) => {
                  return (
                    <div
                      key={i}
                      className='relative bg-black bg-opacity-40 border border-dashed rounded-lg'
                    >
                      <div className='rounded-lg p-4 gap-2 gap-x-3 flex flex-row flex-wrap max-h-[100%] overflow-y-auto'>
                        {mat.legend}
                        {
                          world.adventures.map(adv => {
                            if (adv.urgent === mat.u && adv.important === mat.i) {
                              return (
                                <div className='relative'>
                                  <div
                                    draggable
                                    key={adv.createdAt}
                                    onClick={() => onAdventureClick(adv)}
                                    className='capitalize bg-white px-2 md:px-3 py-1 md:py-2 cursor-pointer line-clamp-2 
                                                            text-black font-semibold rounded-md h-fit w-fit'
                                  >
                                    {adv.description}
                                  </div>
                                  {
                                    deleteMode &&
                                    <img
                                      onClick={() => deleteAdventure(adv)}
                                      className='bg-background rounded-full absolute top-0 right-0 active:opacity-90 translate-x-1/2
                                            cursor-pointer -translate-y-1/2 h-5 w-5 z-50'
                                      src={closeIcon}
                                    />
                                  }
                                </div>
                              )
                            }
                            return null
                          })
                        }
                      </div>
                    </div>
                  )
                })

              }
            </div >
          </>
      }
    </>
  )
}

export default World
