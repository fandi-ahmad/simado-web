export const BaseDropdownUl = (props) => {
  return (
    <div className='dropdown dropdown-end'>
      
      {props.text ? <span className='mr-2'>{props.text}</span> : null}

      <button tabIndex={1} role='button' className={`btn btn-sm text-gray-600  ${props.btnClassName}`}>
        {props.btnText}
        {props.icon ? <i className={`fa-solid ${props.icon}`}></i> : null}
      </button>

      <ul tabIndex={10} className={`${props.className || 'w-52'} dropdown-content z-10 absolute menu p-2 shadow bg-base-100 rounded-md border border-gray-300 font-medium`}>
        {props.children}
      </ul>
      
    </div>
  )
}

export const DropdownListData = (props) => {
  return (
    <li onClick={props.onClick}>
      <a className='py-1'>
        {props.icon ? <i className={`fa-solid ${props.icon} w-4`}></i> : null}
        <span className='pb-1'>{props.text}</span>
      </a>
    </li>
  )
}