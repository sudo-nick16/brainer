import React from 'react'
import Input from './input';
import Button from './button';
import OutsideClickWrapper from './outside-click-wrapper';
import { useModal, useStore } from '../utils/context';
import { saveFileToFileSystem } from '../utils/fileSystem';
import { slugify } from '../utils/slugify';

const CreateWorldModal = ({ }) => {
    const { updateState, worlds } = useStore();
    const { show, state, setState, close } = useModal().createWorldModal;

    const setImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (state.name?.trim() === '') {
            alert("error: name is empty.");
            return;
        }
        if (event.target.files) {
            const imgReader = new FileReader();
            imgReader.onload = (e) => {
                if (e.target?.result) {
                    setState(curr => ({ ...curr, img: e.target!.result as string }));
                }
            }
            imgReader.readAsDataURL(event.target.files[0]);
        }
    }

    const onOutsideClick = () => {
        close();
    }

    const createWorld = () => {
        if (worlds.find(w => w.name.trim() === state.name?.trim())) {
            alert("error: already exists.");
            return;
        }
        if (state.name?.trim() === '') {
            alert("error: name is empty.");
            return;
        }
        if (!state.img) {
            alert("error: no image selected.");
            return;
        }
        let slug = slugify(state.name!);
        let imageName = `${slug}.png`;
        saveFileToFileSystem(imageName, state.img).then(() => {
            updateState({
                worlds: [...worlds, {
                    name: state.name!,
                    slug: slug,
                    img: imageName,
                    createdAt: Date.now(),
                    adventures: []
                }]
            })
            close();
        }).catch(error => {
            console.log("error: could not save image to the filesystem - ", error);
        });
    }

    return (
        show &&
        <OutsideClickWrapper
            onOutsideClick={onOutsideClick}
            className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20'
        >
            <div className='bg-black py-12 px-10 gap-4 flex flex-col w-full relative rounded-3xl border border-accent min-w-[350px] '>
                <h1 className='font-black text-2xl mb-3'>Create A New World !</h1>
                <Input placeholder='Name' value={state.name} onChange={(e) => setState(curr => ({ ...curr, name: e.target.value }))} />
                <div>
                    <label className='border border-dashed border-secondary h-36 flex justify-center items-center rounded-md cursor-pointer' htmlFor='world-img'>
                        {
                            state.img ? <img src={state.img} className='h-full w-full object-cover' /> : 'Choose background'
                        }
                    </label>
                    <input onChange={(e) => setImage(e)} type='file' id="world-img" className='hidden' />
                </div>
                <Button onClick={createWorld}>Create</Button>
                <Button className='absolute right-3 top-3 rounded-full h-8 w-8 !p-0' onClick={close}>x</Button>
            </div>
        </OutsideClickWrapper>
    )
}

export default CreateWorldModal;
