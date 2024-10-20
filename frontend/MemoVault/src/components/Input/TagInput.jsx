import React, { useState, useRef } from 'react'
import { MdAdd, MdClose } from 'react-icons/md'


const colors = ['#FF5733', '#33FF57', '#3357FF', '#F39C12', '#8E44AD', '#1ABC9C', '#C0392B', '#3498DB'];
const TagInput = ({tags, setTags}) => {
    const [inputValue, setInputValue] = useState("")
    const tagColors = useRef({});

    const handleInputChange = (e) => {
        setInputValue(e.target.value)
    }
    const addNewTag = () => {
        if(inputValue.trim() != ""){
            setTags([...tags, inputValue.trim()]);
            setInputValue('')
        }
    }
    const handleKeyDown = (e) => {
        if(e.key === "Enter"){
            addNewTag();
        }
    }
    const handleRemoveTag = (tagRemove) => {
        setTags(tags.filter((tag) => tag !== tagRemove))
        delete tagColors.current[tagRemove]
    }
    const getRandomColor = () => {
        return colors[Math.floor(Math.random() * colors.length)]
    }
return (
    <div>
        {tags?.length > 0 && (<div className='flex items-center gap-2 flex-wrap mt-2'>
            {tags.map((tag, index) => {
            if(!tagColors.current[tag]){
                tagColors.current[tag] = getRandomColor()
            }
            return (
                <span key={index} className='flex items-center p-1 rounded text-xs text-white gap-2' style={{backgroundColor : tagColors.current[tag]}}>
                #{tag}
                <button onClick={() => {handleRemoveTag(tag)}}>
                    <MdClose/>
                </button>
                </span>
            )
})}
        </div>)}
        <div className='flex items-center gap-4 mt-3'>
            <input type="text" className='text-sm bg-transparent border px-3 py-2 rounded outline-none' placeholder='Add Tags' onChange={handleInputChange} onKeyDown={handleKeyDown} value={inputValue}/>
            <button className='w-8 h-8 flex items-center justify-center border border-primary hover:bg-primary rounded group' onClick={() => {
                addNewTag();
            }}>
            <MdAdd className='text-2xl text-primary group-hover:text-white transition-colors'/>
            </button>
        </div>
    </div>
  )
}

export default TagInput