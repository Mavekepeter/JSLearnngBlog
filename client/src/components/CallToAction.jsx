import { Button } from 'flowbite-react'
import React from 'react'

const CallToAction = () => {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
      <div className="flex-1">
        <h2 className='text-2xl'>What to learn more about javascript?</h2>
        <p className='text-gray-500 my-2'>Check out this resources with 100 javascript resources</p>
        <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none'>
            <a href="https://www.100jsprojects.com" target='_blank' rel='noopener noreferrer'>
            100 javascript Projects</a>
        </Button>
      </div>
      <div className="p-7 flex-1 flex flex-col justify-center">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1DmLCy9PSJfFqO55mNTYOQLx3x8THsbokkw&s" alt="" />
      </div>
    </div>
  )
}

export default CallToAction
