import React, { useState } from 'react'
import TagInput from '../../components/Input/TagInput'
import { MdClose } from 'react-icons/md'
import AxiosInstance from '../../utils/AxiosInstance'

const AddEditNotes = ({onClose, memoData, type, getAllMemos, showToastMessage}) => {

    const [title, setTitle ] = useState(memoData?.title || "")
    const [content, setContent] = useState(memoData?.content || "")
    const [tags, setTags] = useState(memoData?.tags || [])
    const [error, setError] = useState(null)

    //add note
    const addNewNote = async() => {
        try{
            const response = await AxiosInstance.post('/add-memo', {
                title,
                content, 
                tags
            })
            if(response.data && response.data.memo){
                showToastMessage("Memo Added Succesfully!")
                getAllMemos();
                onClose()
            }
        }
        catch(error){
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message)
            }
        }
    }
    //edit note
    const editNote = async() => {
        const memoId = memoData._id;
        try{
            const response = await AxiosInstance.put(`/edit-memo/${memoId}`, {
                title,
                content,
                tags
        })
        if(response.data && response.data.memo){
            showToastMessage("Memo Updated Succesfully!")
            getAllMemos();
            onClose()
        }
    }
    catch(error){
        if(error.response && error.response.data && error.response.data.message){
            setError(error.response.data.message)
        }
    }
    }

    const handleAddNote = () => {
        if(!title){
            setError("Please Enter the title")
            return
        }
        if(!content){
            setError("Please Enter the content")
            return
        }
        setError("")

        if(type === 'edit'){
            editNote()
        }else{
            addNewNote()
        }
    }
    return (
    <div className='relative'>
        <button onClick={onClose} className='flex w-10 h-10 rounded-full hover:bg-primary items-center justify-center absolute -top-3 -right-3 group'>
            <MdClose className='text-xl text-slate-400 group-hover:text-white transition-colors'/>
        </button>
        <div className='flex flex-col gap-2'>
            <label className="input-label">TITLE</label>
            <input type="text" className='text-2xl text-slate-950 outline-none placeholder-slate-300' placeholder='Attend the Lecture' value={title} onChange={(e) => {setTitle(e.target.value)}}/>
        </div> 
        <div className='flex flex-col gap-2 mt-4'>
            <label className='input-label'>THINGS TO DO</label> 
            <textarea type="text" className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded placeholder-slate-300' placeholder='Type Something...' rows={10} value={content} onChange={(e) => {setContent(e.target.value)}}/>
        </div>
        <div className='mt-3'>
            <label className='input-label'>TAGS</label>
            <TagInput tags={tags} setTags={setTags}/>
        </div>
        {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}
        <button className='btn-primary font-medium mt-5 p-3' onClick={handleAddNote}>{type === 'edit' ? 'UPDATE' : 'ADD'}</button>
    </div>
    )
}

export default AddEditNotes;