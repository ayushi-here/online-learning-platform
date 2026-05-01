import React from 'react'

function Hero() {
  return (
    <div className='mt-24 flex justify-center'>
        <div className='max-w-3xl w-full text-center space-y-6'>
            <h1 className='text-xl md:text-5xl font-bold'>Hey, I'm your personal <span className='text-primary'>Learning Assistant</span></h1>
            <p className='text-lg'>Tell me what you want to learn, and I’ll handle the rest: courses, chapters, topics, and videos — all in seconds</p>
        </div>
    </div>
  )
}

export default Hero