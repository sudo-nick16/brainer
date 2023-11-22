import Button from './button';
import OutsideClickWrapper from './outside-click-wrapper';
import { useModal, useStore } from '../utils/context';
import { slugify } from '../utils/slugify';

const EditAdventureModal = () => {
  const { currentWorld, updateState } = useStore();
  const { show, close, state, setState } = useModal().editAdventureModal;

  const editAdventure = () => {
    if (!state.description?.trim()) {
      alert('error: empty adventure!');
      return;
    }
    const worldSlug = slugify(currentWorld);
    updateState((curr) => {
      const worlds = curr.worlds.map((w) => {
        if (w.slug === worldSlug) {
          return {
            ...w,
            adventures: w.adventures.map(adv => {
              if (adv.createdAt === state.createdAt) {
                return {
                  ...adv,
                  urgent: state.urgent!,
                  description: state.description!,
                  important: state.important!
                }
              }
              return adv;
            })
          }
        }
        return w;
      })
      return {
        ...curr,
        worlds
      }
    })
    close();
  }

  const deleteAdventure = () => {
    if (!confirm('You sure bud, you wanna delete this?')) {
      return;
    }
    updateState((curr) => {
      const worlds = curr.worlds.map(w => {
        if (w.name === currentWorld) {
          return {
            ...w,
            adventures: w.adventures.filter(a => a.createdAt !== state.createdAt)
          }
        }
        return w;
      })
      return {
        ...curr,
        worlds
      }
    })
    close();
  }

  return (
    show &&
    <OutsideClickWrapper
      listenerState={show}
      onOutsideClick={() => {
        close();
      }}
      className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20'
    >
      <div className='bg-black pt-10 pb-4 px-10 gap-3 flex flex-col w-full relative rounded-3xl border border-accent min-w-[350px] '>
        <h1 className='font-black text-2xl mb-2'>Edit Your Adventure !</h1>
        <div className='flex items-center gap-x-3 justify-start'>
          <Button className={`${state.urgent ? '!bg-accent' : ''} !px-4 !py-1 flex-1`} onClick={() => setState({ urgent: !state.urgent })}>Urgent</Button>
          <Button className={`${state.important ? '!bg-accent' : ''} !px-4 !py-1 flex-1`} onClick={() => setState({ important: !state.important })}>Important</Button>
        </div>
        <textarea className='rounded-md bg-background border border-white p-2 h-36' placeholder='Adventure' value={state.description} onChange={(e) => setState({ description: e.target.value })} />
        <div className='flex gap-4 justify-between mt-2'>
          <Button className='!py-1' onClick={deleteAdventure}>Delete</Button>
          <Button className='!py-1' onClick={editAdventure}>Save</Button>
        </div>
        <Button className='absolute right-3 top-3 !rounded-full h-8 w-8 !p-0' onClick={close}>x</Button>
      </div>
    </OutsideClickWrapper>
  )
}

export default EditAdventureModal;
