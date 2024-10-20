import moment from 'moment';
import React from 'react'
import { useRef } from 'react';
import { MdOutlinePushPin, MdCreate, MdDelete } from "react-icons/md";

const colors = ['#2596be','#e28743','#2E4052','#412234','#4E5340','#5E5768', '#5FBB97','#7B2D26','#E78F8E','#D0A98F'];
const NoteCard = ({title, date, content, tags, isPinned, onEdit, onDelete, onPinNote}) => {
    const tagColors = useRef({})

    const getRandomColor = () => {
        return colors[Math.floor(Math.random() * colors.length)]
    }

    return (
    <div className='border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out'>
        <div className='flex items-center justify-between'>
        <div>
            <h6 className='font-medium text-xl'>{title}</h6>
            <span className='text-xs text-slate-500'>{moment(date).format('D MMMM, YYYY')}</span>

        </div>
        <MdOutlinePushPin className={`icon-btn ${isPinned ? 'text-primary' : 'text-slate-300'}`} onClick={onPinNote}/>
        </div>
        
        <p className='text-sm text-slate-600 mt-2 font-medium'>{content ?.slice(0, 60)}</p>
        <div className='flex items-center justify-between mt-2'>
            <div className='text-slate-500 text-xs'>
                {tags.length > 0 && tags.map((tag,index) => {
                    if(!tagColors.current[tag]) {
                        tagColors.current[tag] = getRandomColor()
                    }
                    return <span key={index} className='text-white rounded px-2 mr-1' style={{backgroundColor : tagColors.current[tag]}}>{"#"}{tag}</span>
                })}
            </div>
            <div className='flex items-center gap-2'>
                <MdCreate className='icon-btn hover:text-green-600' onClick={onEdit}/>
                <MdDelete className='icon-btn hover:text-red-500' onClick={onDelete}/>
            </div>
        </div>
        </div>
    
    )
}

export default NoteCard