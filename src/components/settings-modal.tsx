import { useModal, useStore } from '../utils/context'
import { clearFileSystem } from '../utils/fileSystem';
import Button from './button';
import OutsideClickWrapper from './outside-click-wrapper';

const SettingsModal = () => {
  const { close, show } = useModal().settingsModal;
  const { opacity, animate, updateState } = useStore();

  return (
    show &&
    <OutsideClickWrapper
      listenerState={show}
      onOutsideClick={close}
      className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20'
    >
      <div className='relative bg-black font-semibold py-10 px-10 min-w-[350px] rounded-xl border border-accent flex flex-col gap-5'>
        <h1 className='text-2xl font-black mb-4'>Settings</h1>
        <div className='w-full grid grid-cols-2 grid-rows-1'>
          <label>Opacity</label>
          <input className='w-full cursor-pointer' onChange={(e) => updateState({ opacity: parseInt(e.target.value) })} type='range' value={opacity} />
        </div>
        <div className='w-full grid grid-cols-2 grid-rows-1'>
          <label>Animate</label>
          <input className='mr-auto w-4 h-4 cursor-pointer' onChange={(e) => updateState({ animate: e.target.checked })} type='checkbox' checked={animate} />
        </div>
        <Button className='absolute right-3 top-3 !rounded-full h-8 w-8 !p-0' onClick={close}>x</Button>
        <Button className='' onClick={clearFileSystem}>clear</Button>
      </div>
    </OutsideClickWrapper>
  )
}

export default SettingsModal
