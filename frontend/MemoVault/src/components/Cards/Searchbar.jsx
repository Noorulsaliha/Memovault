import React from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'

const Searchbar = ({value, onChange, handleSearch, onClearSearch}) => {
    return (
    <div className='w-80 flex items-center bg-slate-100 px-4 rounded-md'>
        <input type="text" placeholder='Search Memo' className='w-full text-sm bg-transparent outline-none py-[11px]' value={value} onChange={onChange}/>
        {value && <IoMdClose  onClick={onClearSearch} className='text-slate-400 cursor-pointer hover:text-primary mr-3 text-xl'/>}
        
        <FaMagnifyingGlass className='text-slate-400 cursor-pointer hover:text-primary' onClick={handleSearch}/>
    </div>
    )
}

export default Searchbar