import React from 'react'

function Louder() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="relative">
        <div className="relative w-16 h-16">
          <div
            className="absolute w-full h-full rounded-full border-[2px] border-gray-300/20 border-r-black border-b-black animate-spin"
            style={{animationDuration: '1.5s'}}
          ></div>
          
          <div
            className="absolute w-full h-full rounded-full border-[2px] border-gray-300/20 border-t-black animate-spin"
            style={{animationDuration: '1s', animationDirection: 'reverse'}}
          ></div>
        </div>
        
        <div
          className="absolute inset-0 bg-gradient-to-tr from-[#0ff]/20 via-transparent to-[#0ff]/10 animate-pulse rounded-full blur-sm"
        ></div>
      </div>
    </div>
  )
}

export default Louder