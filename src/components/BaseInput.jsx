import React from 'react'

export const BaseInput = (props) => {
  return (
    <div className={props.className} id={props.idField}>
      <p className="pt-4 mb-2">{props.text}</p>
      <input type={props.type || 'text'} name={props.name} id={props.id} value={props.value} onChange={props.onChange} className="input input-bordered w-full" />
    </div>
  )
}


export const SelectInput = (props) => {
  return (
    <div className={props.className}>
      <p className="pt-4 mb-2">{props.text}</p>
      <select id={props.id} onChange={props.onChange} name={props.name} className={`${props.classInput || ''} select select-bordered w-full`}>
        <option>-</option>
        {props.option}
      </select>
    </div>
  )
}