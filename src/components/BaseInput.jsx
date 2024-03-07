import React from 'react'

export const BaseInput = (props) => {
  return (
    <div className={props.className} id={props.idField}>
      <p className="pt-4 mb-2">{props.text}</p>
      <input type={props.type || 'text'} name={props.name} id={props.id} value={props.value} onChange={props.onChange} className="input input-bordered w-full" />
    </div>
  )
}

export const InputColumn = (props) => {
  const required = () => {
    if (props.required) {
      return <span className='text-red-400'>*</span>
    }
  }
  return (
    <div className={'flex justify-between w-full mb-2 '+ props.className} id={props.idField}>
      <p className="pt-4 mb-2 mr-24">{props.text}{required()}</p>
      <div>
        <input type={props.type || 'text'} name={props.name} id={props.id} value={props.value} onChange={props.onChange} className="input input-bordered w-96" />
        <p className={'text-red-400 text-sm hidden '+props.classError} id={props.idError}>{props.errorText || 'Input tidak boleh kosong'}</p>
      </div>
    </div>
  )
}

export const SelectInput = (props) => {
  return (
    <div className='mb-2'>
      <p className="pt-4 mb-2">{props.text}</p>
      <select id={props.id} onChange={props.onChange} name={props.name} className={`${props.classInput || ''} select select-bordered w-full`}>
        <option>-</option>
        {props.option}
      </select>
    </div>
  )
}