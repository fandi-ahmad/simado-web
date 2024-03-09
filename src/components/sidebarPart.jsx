import { useNavigate } from "react-router-dom"

const aClass = 'py-2.7 text-sm ease-nav-brand my-0 flex items-center whitespace-nowrap px-4 transition-colors hover:text-gray-600 hover:font-semibold'
const aClassActive = 'py-2.7 shadow-soft-xl text-sm ease-nav-brand my-0 flex items-center whitespace-nowrap rounded-lg bg-white px-4 font-semibold text-slate-700 transition-colors'
const divClass = 'shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 text-center xl:p-2.5'
const divClassActive = 'bg-gradient-to-tl text-white from-purple-700 to-pink-500 shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 text-center xl:p-2.5'

export const ListMenu = (props) => {
  const navigate = useNavigate()
  const path = location.pathname

  return (
    <li className="mt-0.5 w-full cursor-pointer">
      <a  onClick={() => navigate(props.to)} className={path === props.to ? aClassActive : aClass}>
        <div className={path === props.to ? divClassActive : divClass}>
          <i className={"fa-solid " + props.icon}></i>
        </div>
        <span className="ml-1 duration-300 opacity-100 pointer-events-none ease-soft">{props.text}</span>
      </a>
    </li>
  )
}

export const SubListMenu = (props) => {
  return (
    <li className={`w-full ${props.className || 'mt-4'}`}>
      <h6 className="pl-4 text-xs font-bold leading-tight uppercase opacity-60">
        {props.text}
      </h6>
    </li>
  )
}

export const ListMenuChild = (props) => {
  const navigate = useNavigate()
  return (
    <li className='w-full cursor-pointer px-4 text-sm'>
      <div className={props.className || 'hover:text-gray-700 hover:font-semibold flex justify-between items-center hovered'}>
        <div onClick={() => navigate(props.to)} className='py-1 w-full'>
          <i className={`fa-solid ${props.icon || 'fa-caret-right'}`}></i>
          <span className='pl-4'>{props.text}</span>
        </div>
      </div>
    </li>
  )
}