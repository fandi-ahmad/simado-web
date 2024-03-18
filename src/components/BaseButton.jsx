import { BaseDropdownUl } from "./Dropdown"

const btnClass = 'btn text-white capitalize bg-gradient-to-tl from-purple-700 to-pink-500 border-0 hover:opacity-85'

export const ButtonPrimary = (props) => {
  return (
    <button className={`${props.className} ${btnClass}`} onClick={props.onClick}>
      {props.text}
      {props.icon ? <i className={`fa-solid ${props.icon}`}></i> : null}
    </button>
  )
}

export const BaseButton = (props) => {
  return (
    <div className="tooltip w-fit" data-tip={props.tooltip}>
      <button onClick={props.onClick} className={`${props.className} btn text-gray-700 ${props.bgClassName || 'bg-gray-400 hover:bg-gray-300'}`} disabled={props.disabled}>
        {props.text}
        {props.icon ? <i className={`fa-solid ${props.icon}`}></i> : null}
      </button>
    </div>
  )
}

export const ButtonDropdown = (props) => {
  return (
    <div className={`rounded-md mt-2 flex justify-between items-center cursor-pointer hovered ${props.className}`}>
      <span onClick={props.onClick} className={`font-semibold text-sm pl-2 ${props.textClassName}`}>{props.text}</span>
      <BaseDropdownUl icon='fa-ellipsis-vertical fa-vertical' btnClassName='bg-transparent border-0 hover:bg-gray-200' className='w-32'>
        {props.children}
      </BaseDropdownUl>
    </div>
  )
}