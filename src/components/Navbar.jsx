import React from 'react'
import { useGlobalState } from '../state/state'

const Navbar = (props) => {
  const [usernameLogin, setUsernameLogin] = useGlobalState('usernameLogin')
  const [asideClass, setAsideClass] = useGlobalState('asideClass')

  return (
    <nav className="relative flex flex-wrap items-center justify-between px-0 py-2 mx-6 transition-all shadow-none duration-250 ease-soft-in rounded-2xl lg:flex-nowrap lg:justify-start">
      <div className="flex items-center justify-between w-full px-4 py-1 mx-auto ">
        <nav className='w-full'>
          <ol className="flex flex-wrap pt-1 mr-12 bg-transparent rounded-lg sm:mr-16">
            <li className="text-sm leading-normal">
              <a className="opacity-50 text-slate-700">Pages</a>
            </li>
            <li className="text-sm pl-2 capitalize leading-normal text-slate-700 before:float-left before:pr-2 before:text-gray-600 before:content-['/']" aria-current="page">
              {props.page}
            </li>
          </ol>
          <h6 className="mb-0 font-bold capitalize">{props.pageTitle || props.page}</h6>
        </nav>

        <div onClick={() => setAsideClass(asideClass === 'shadow-soft-xl' ? 'translate-x-0' : 'shadow-soft-xl')} className="cursor-pointer flex items-center mt-2 grow sm:mt-0 sm:mr-6 md:mr-0 lg:flex lg:basis-auto w-fit">
          <ul className="flex flex-row justify-end pl-0 mb-0 list-none md-max:w-full">
            <li className="flex items-center pl-4 xl:hidden">
              <a className="block p-0 text-sm transition-all ease-nav-brand text-slate-500">
                <div className="w-4.5 overflow-hidden">
                  <i className={`ease-soft mb-0.75 relative block h-0.5 rounded-sm bg-slate-500 transition-all ${asideClass === 'shadow-soft-xl' ? '' : 'translate-x-[5px]'}`}></i>
                  <i className="ease-soft mb-0.75 relative block h-0.5 rounded-sm bg-slate-500 transition-all"></i>
                  <i className={`ease-soft mb-0.75 relative block h-0.5 rounded-sm bg-slate-500 transition-all ${asideClass === 'shadow-soft-xl' ? '' : 'translate-x-[5px]'}`}></i>
                </div>
              </a>
            </li>
          </ul>
        </div>

        <div className='w-full text-end text-sm'>
          <i className="fa-solid fa-user"></i>
          <span className='ml-2'>{usernameLogin}</span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar