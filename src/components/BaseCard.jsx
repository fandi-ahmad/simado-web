import React from 'react'

export const CardData = (props) => {
  return (
    <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
      <div className="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border">
        <div className="flex-auto p-4">
          <div className="flex flex-row -mx-3">
            <div className="flex-none w-2/3 max-w-full px-3">
              <div>
                <p className="mb-0 text-sm font-semibold leading-normal">{props.text}</p>
                <h5 className="mb-0 font-bold">{props.value}</h5>
              </div>
            </div>
            <div className="px-3 text-right basis-1/3">
              <div className="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500">
                <i className={`fa-solid ${props.icon || 'fa-file'} text-lg relative top-2.5 text-white`}></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const ContainerWhiteCard = (props) => {
  return (
    <div className="flex-none w-full max-w-full px-3">
      <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent border-solid shadow-soft-xl rounded-2xl bg-clip-border">
        <div className="p-6 pb-0 mb-0 bg-white border-b-0 border-b-solid rounded-t-2xl border-b-transparent">
          <h6>{props.name}</h6>
        </div>
        <div className="flex-auto px-0 pt-0 pb-2">
          <div className="p-0 overflow-x-auto px-6">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  )
}