import React, { useEffect, useState } from 'react'
import Input from './input';
import Button from './button';
import OutsideClickWrapper from './outside-click-wrapper';
import { useModal, useStore } from '../utils/context';
import { loadImage, saveFileToFileSystem } from '../utils/fileSystem';
import { slugify } from '../utils/slugify';
import { useNavigate } from 'react-router-dom';

const EditWorldModal = () => {
  const navigate = useNavigate();
  const { updateState, worlds } = useStore();
  const modal = useModal();
  const { show, close, state, setState } = modal.editWorldModal;
  const [selectedImage, setSelectedImage] = useState('');

  const setImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (state.name?.trim() === '') {
      alert('error: name is empty.');
      return;
    }
    if (event.target.files) {
      try {
        const imgReader = new FileReader();
        imgReader.onload = (e) => {
          if (e.target?.result) {
            setSelectedImage(e.target!.result as string);
          }
        }
        imgReader.readAsDataURL(event.target.files[0]);
      } catch (e) {
        console.log('error: could not read file. - ', e);
      }
    }
  }

  useEffect(() => {
    if (!state.img) {
      return;
    }
    loadImage(state.img!).then(img => {
      setSelectedImage(img)
    });
  }, [state.img])

  const resetInputs = () => {
    setSelectedImage('');
  }

  const editWorld = () => {
    if (!worlds.find(w => w.createdAt === state.createdAt)) {
      alert('error: world does not exists.');
      return;
    }
    if (state.name?.trim() === '') {
      alert('error: name is empty.');
      return;
    }
    if (!selectedImage) {
      alert('error: no image selected.');
      return;
    }
    const slug = slugify(state.name!);
    const imageName = `${slug}.png`;
    saveFileToFileSystem(imageName, selectedImage as string).then(() => {
      updateState(curr => {
        const worlds = curr.worlds.map(w => {
          if (w.createdAt === state.createdAt) {
            return {
              ...w,
              slug: slug,
              img: imageName,
              name: state.name!
            }
          }
          return w;
        })
        return { ...curr, worlds, currentWorld: state.name! };
      })
      resetInputs();
      close();
      navigate(`/${slug}`);
    }).catch(error => {
      console.log('error: could not save image to the filesystem - ', error);
    });
  }

  const deleteWorld = () => {
    if (!confirm('You sure bud, you wanna delete your world?')) {
      return;
    }
    updateState(curr => ({
      ...curr,
      worlds: curr.worlds.filter(w => w.createdAt !== state.createdAt)
    }))
    close();
    navigate('/');
  }

  return (
    show &&
    <OutsideClickWrapper
      listenerState={show}
      onOutsideClick={() => {
        close();
        resetInputs();
      }}
      className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20'
    >
      <div className='bg-black pt-12 pb-6 px-10 gap-3 flex flex-col w-full relative rounded-3xl border border-accent min-w-[350px] '>
        <h1 className='font-black text-2xl mb-3'>Edit Your World !</h1>
        <Input placeholder='Name' value={state.name} onChange={(e) => setState({ name: e.target.value })} />
        <div>
          <label className='border border-dashed border-secondary h-36 flex justify-center items-center rounded-md cursor-pointer' htmlFor='world-img'>
            {
              selectedImage ? <img src={selectedImage as string} className='h-full w-full object-cover' /> : 'Choose background'
            }
          </label>
          <input onChange={(e) => setImage(e)} type='file' id='world-img' className='hidden' />
        </div>
        <div className='flex gap-4 justify-between mt-2'>
          <Button className='!py-1' onClick={deleteWorld}>Delete</Button>
          <Button className='!py-1' onClick={editWorld}>Save</Button>
        </div>
        <Button className='absolute right-3 top-3 !rounded-full h-8 w-8 !p-0' onClick={close}>x</Button>
      </div>
    </OutsideClickWrapper>
  )
}

export default EditWorldModal;
