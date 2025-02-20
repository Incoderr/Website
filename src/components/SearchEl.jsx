import React from 'react'

function SearchEl() {
  return (
    <div className='p-3'>
      <div className='flex flex-col sm:flex-row justify-center mt-15 mb-5 sm:mb-8 gap-2'>
      <input type="text" className='bg-gray-700 w-full sm:w-120 h-11 text-white text-lg pl-2 outline-none focus:ring-blue-600 focus:ring-1 focus:shadow-lg focus:shadow-blue-600/30 rounded-md sm:duration-300 hover:scale-101'/>
      <button type="button" className='cursor-pointer h-10 sm:h-11 bg-gray-700 rounded-md pl-2 pr-2 duration-300 hover:scale-105'>Найти</button>
      </div>
      <div className='flex gap-2 sm:gap-3 justify-center max-w-500 sm:max-w-500 flex-wrap'>
        <div className='bg-gray-700 w-47 h-40 sm:w-73 sm:h-50  duration-300 cursor-pointer hover:scale-105 flex justify-center items-center'>box</div>
        <div className='bg-gray-700 w-47 h-40 sm:w-73 sm:h-50  duration-300 cursor-pointer hover:scale-105 flex justify-center items-center'>box</div>
        <div className='bg-gray-700 w-47 h-40 sm:w-73 sm:h-50  duration-300 cursor-pointer hover:scale-105 flex justify-center items-center'>box</div>
        <div className='bg-gray-700 w-47 h-40 sm:w-73 sm:h-50  duration-300 cursor-pointer hover:scale-105 flex justify-center items-center'>box</div>
        <div className='bg-gray-700 w-47 h-40 sm:w-73 sm:h-50  duration-300 cursor-pointer hover:scale-105 flex justify-center items-center'>box</div>
        <div className='bg-gray-700 w-47 h-40 sm:w-73 sm:h-50  duration-300 cursor-pointer hover:scale-105 flex justify-center items-center'>box</div>
        <div className='bg-gray-700 w-47 h-40 sm:w-73 sm:h-50  duration-300 cursor-pointer hover:scale-105 flex justify-center items-center'>box</div>
      </div>
    </div>
  )
}

export default SearchEl