import React from 'react'

export const Main = (props) => {
  return <div className='ease-soft-in-out xl:ml-68.5 relative min-h-screen rounded-xl transition-all duration-200 bg-slate-300'>{props.children}</div>
}

export const Container = (props) => {
  return <div className='w-full px-6 py-6 mx-auto'>{props.children}</div>
}

export const ContainerRow = (props) => {
  return <div className={`flex flex-wrap ${props.className}`}>{props.children}</div>
}
