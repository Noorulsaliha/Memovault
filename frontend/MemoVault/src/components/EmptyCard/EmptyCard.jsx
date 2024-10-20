import React from 'react'

const EmptyCard = ({imgSrc, message}) => {
return (
    <div className='flex flex-col p-5 items-center justify-center mt-20'>
        <img src={imgSrc} alt='Add Memo' className='w-40 h-40 md:w-80 md:h-80'/>
        <p className='w-1/2 text-sm md:text-xl font-medium text-slate-700 text-center leading-6 mt-5'>{message}</p>
    </div>
)
}

export default EmptyCard