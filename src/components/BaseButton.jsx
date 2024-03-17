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
    <button onClick={props.onClick} className={`${props.className} btn bg-gray-400 hover:bg-gray-300`} disabled={props.disabled}>
      {props.text}
      {props.icon ? <i className={`fa-solid ${props.icon}`}></i> : null}
    </button>
  )
}