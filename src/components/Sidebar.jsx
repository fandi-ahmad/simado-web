import { React, useEffect, useState } from 'react'
import logoCt from '../assets/img/logo-ct.png'
import { useNavigate } from 'react-router-dom'
import { useGlobalState } from '../state/state'
import { GetAllCategory } from '../api/category'

const aClass = 'py-2.7 text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap px-4 transition-colors hover:text-gray-700'
const aClassActive = 'py-2.7 shadow-soft-xl text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap rounded-lg bg-white px-4 font-semibold text-slate-700 transition-colors'
const divClass = 'shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 text-center xl:p-2.5'
const divClassActive = 'bg-gradient-to-tl text-white from-purple-700 to-pink-500 shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 text-center xl:p-2.5'

const listMenu = (icon, title, to) => {
  const navigate = useNavigate()
  const path = location.pathname

  return (
    <li className="mt-0.5 w-full cursor-pointer">
      <a  onClick={() => navigate(to)} className={path === to ? aClassActive : aClass}>
        <div className={path === to ? divClassActive : divClass}>
          <i className={"fa-solid " + icon}></i>
        </div>
        <span className="ml-1 duration-300 opacity-100 pointer-events-none ease-soft">{title}</span>
      </a>
    </li>
  )
}


const Sidebar = () => {
  const [asideClass, setAsideClass] = useGlobalState('asideClass')
  const [dataCategory, setDataCategory] = useState([])

  const getAllData = async () => {
    try {
      const { data } = await GetAllCategory()
      setDataCategory(data)
    } catch (error) {}
  }

  useEffect(() => {
    getAllData()
  }, [])
  
  return (
    <aside className={'max-w-62.5 ease-nav-brand z-990 fixed inset-y-0 my-4 ml-4 block w-full -translate-x-full flex-wrap items-center justify-between overflow-y-auto rounded-2xl border-0 p-0 antialiased transition-transform duration-200 xl:left-0 xl:translate-x-0 ps bg-white xl:bg-white ' + asideClass}>
      <div className="h-19.5">
        <i onClick={() => setAsideClass(asideClass === 'shadow-soft-xl' ? 'translate-x-0' : 'shadow-soft-xl')} className="absolute top-0 right-0 p-4 opacity-50 cursor-pointer fas fa-times text-slate-400 xl:hidden" ></i>
        <a className="block px-8 py-6 m-0 text-sm whitespace-nowrap text-slate-700">
          <img src={logoCt} className="inline h-full max-w-full transition-all duration-200 ease-nav-brand max-h-8" alt="main_logo" />
          <span className="ml-1 font-semibold transition-all duration-200 ease-nav-brand">SIMADO</span>
        </a>
      </div>

      <hr className="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent" />

      <div className="items-center block w-auto max-h-screen overflow-auto grow basis-full">
        <ul className="flex flex-col pl-0 mb-0">

          {listMenu('fa-house', 'Dashboard', '/')}
          {listMenu('fa-file', 'Semua Dokumen', '/document')}
          {listMenu('fa-table', 'Kategori', '/category')}
          {listMenu('fa-users', 'Pengguna', '/user')}

          <li className="mt-0.5 w-full cursor-pointer collapse collapse-arrow pr-8">
            <input type="checkbox" /> 
            <a className={'collapse-title ' + aClass}>
              <div className='shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 text-center xl:p-2.5'>
                <i className={"fa-solid fa-table"}></i>
              </div>
              <span className="ml-1 duration-300 opacity-100 pointer-events-none ease-soft">kategori +</span>
            </a>
            <div className={'collapse-content text-sm mx-4 pl-6'}>
              {dataCategory.map((data) => (
                <div className='hover:text-gray-700 my-3'>
                  <i className="fa-solid fa-circle text-xs"></i>
                  <span key={data.id} className='pl-2'>{data.name}</span>
                </div>
              ))}
            </div>
          </li>


          <li className="w-full mt-4">
            <h6 className="pl-6 ml-2 text-xs font-bold leading-tight uppercase opacity-60">
              Account pages
            </h6>
          </li>

          {listMenu('fa-user', 'Profile')}
          {listMenu('fa-right-from-bracket', 'Log Out')}

        </ul>
      </div>

      
    </aside>
  )
}

export default Sidebar