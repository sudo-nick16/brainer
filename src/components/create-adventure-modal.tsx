import Button from './button';
import OutsideClickWrapper from './outside-click-wrapper';
import { useModal, useStore } from '../utils/context';
import { slugify } from '../utils/slugify';

const CreateAdventureModal = () => {
  const { currentWorld, updateState } = useStore();
  const { close, show, state, setState } = useModal().createAdventureModal;

  const createAdventure = () => {
    if (!state.description?.trim()) {
      alert('error: empty adventure!');
      return;
    }
    const worldName = slugify(currentWorld);
    updateState((curr) => {
      const worlds = curr.worlds.map((w) => {
        if (w.slug === worldName) {
          return {
            ...w,
            adventures: [...w.adventures, {
              description: state.description!,
              urgent: state.urgent!,
              important: state.important!,
              createdAt: Date.now()
            }]
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
      <div className='bg-black py-10 px-10 gap-6 flex flex-col w-full relative rounded-3xl border border-accent min-w-[350px] '>
        <h1 className='font-black text-2xl mb-2'>Create A New Adventure !</h1>
        <textarea className='rounded-md bg-background border border-white p-2 h-36' placeholder='Adventure' value={state.description} onChange={(e) => setState({ description: e.target.value })} />
        <div className='flex items-center gap-4 justify-start'>
          <Button className={`${state.urgent ? '!bg-accent' : ''} !px-6 !py-2 flex-1`} onClick={() => setState(curr => ({ ...curr, urgent: !curr.urgent }))}>Urgent</Button>
          <Button className={`${state.important ? '!bg-accent' : ''} !px-6 !py-2 flex-1`} onClick={() => setState(curr => ({ ...curr, important: !curr.important }))}>Important</Button>
        </div>
        <Button className='' onClick={createAdventure}>Create</Button>
        <Button className='absolute right-3 top-3 !rounded-full h-8 w-8 !p-0' onClick={close}>x</Button>
      </div>
    </OutsideClickWrapper>
  )
}

export default CreateAdventureModal;
