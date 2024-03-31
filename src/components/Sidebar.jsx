import { React, useEffect, useState } from 'react'
import logoCt from '../assets/img/logo-ct.png'
import { useNavigate, useParams } from 'react-router-dom'
import { useGlobalState } from '../state/state'
import { CreateCategory, DeleteCategory, GetAllCategory, UpdateCategory } from '../api/category'
import { getId } from '../function/baseFunction'
import { ModalAlert, ModalForm } from './BaseModal'
import { BaseInput } from './BaseInput'
import { ListMenu, ListMenuChild, SubListMenu } from './sidebarPart'
import { DropdownListData } from './Dropdown'
import { ButtonPrimary } from './BaseButton'

const Sidebar = () => {
  const [asideClass, setAsideClass] = useGlobalState('asideClass')
  const [dataCategory, setDataCategory] = useState([])
  const [categoryName, setCategoryName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [textInfo, setTextInfo] = useState('Buat kategori baru')
  const [textBtnAction, setTextBtnAction] = useState('Buat')
  const [textAlert, setTextAlert] = useState('')
  const navigate = useNavigate()
  const params = useParams()


  const getAllData = async () => {
    try {
      const { data } = await GetAllCategory()
      if (data) setDataCategory(data)
      
    } catch (error) {}
  }

  const openModal = (name = '', id = '') => {
    setCategoryName(name)
    setCategoryId(id)

    if (id) {
      setTextInfo('Edit kategori')
      setTextBtnAction('Simpan')
    } else {
      setTextInfo('Buat kategori baru')
      setTextBtnAction('Buat')
    }

    getId('errorMsg').classList.add('hidden')
    getId('modalFormCategory').showModal()
  }

  const handleInput = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'category': setCategoryName(value); break;
      default: break;
    }
  };

  const validateInput =  () => {
    if (categoryName == '') {
      getId('errorMsg').classList.remove('hidden')
      return false
    } else {
      getId('errorMsg').classList.add('hidden')
      getId('closeBtnCategory').click()
      return true
    }
  }

  const createOrUpdateData = async () => {
    try {
      const validate = validateInput()
      if (validate) {

        // create
        if (!categoryId) await CreateCategory({name: categoryName})

        // update
        if (categoryId) await UpdateCategory({name: categoryName, id: categoryId})

        setTimeout(() => { getAllData() }, 100)
      }
    } catch (error) {}
  }

  const openModalConfirm = (id) => {
    setCategoryId(id)
    getId('modalConfirmCategory').showModal()
  }

  const deleteCategory = async () => {
    try {
      getId('closeBtnConfirmCategory').click()
      const {status} = await DeleteCategory(categoryId)

      if (status == 200) navigate('/document')

      if (status == 405) {
        setTextAlert('Tidak bisa dihapus, karena kategori ini sudah digunakan pada File Dokumen!')
        getId('modalAlertCategory').showModal()
      }

      if (status == 500) {
        setTextAlert('Terjadi kesalahan!')
        getId('modalAlertCategory').showModal()
      }

      getAllData()
    } catch (error) {}
  }

  useEffect(() => {
    getAllData()
  }, [])

  return (
    <>
      <aside className={'sidebar max-w-62.5 ease-nav-brand z-10 fixed inset-y-0 my-4 ml-4 block w-full -translate-x-full flex-wrap items-center justify-between overflow-y-auto rounded-2xl border-0 p-0 antialiased transition-transform duration-200 xl:left-0 xl:translate-x-0 ps bg-white xl:bg-white ' + asideClass}>
        <div className="h-19.5">
          <i onClick={() => setAsideClass(asideClass === 'shadow-soft-xl' ? 'translate-x-0' : 'shadow-soft-xl')} className="absolute top-0 right-0 p-4 opacity-50 cursor-pointer fas fa-times text-slate-400 xl:hidden" ></i>
          <a className="block px-8 py-6 m-0 text-sm whitespace-nowrap text-slate-700">
            <img src={logoCt} className="inline h-full max-w-full transition-all duration-200 ease-nav-brand max-h-8" alt="main_logo" />
            <span className="ml-1 font-semibold transition-all duration-200 ease-nav-brand">SIMADO</span>
          </a>
        </div>

        <hr className="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent" />

        <div className="items-center block w-auto max-h-screen grow basis-full">
          <ul className="flex flex-col pl-0 mb-0">

            <ListMenu icon='fa-house' text='Beranda' to='/' />
            <ListMenu icon='fa-file' text='Semua Dokumen' to='/document' />
            <ListMenu icon='fa-users' text='Pengguna' to='/user' />

           
            <SubListMenu text='Kategori' />

            <li className='w-full cursor-pointer px-4 text-sm'>
              {dataCategory.map((data) => (
                <div key={data.id} className='dropdown w-full'>

                  <div className={params.id == data.id ? 'text-gray-700 font-semibold flex justify-between items-center hovered' : 'hover:text-gray-700 hover:font-semibold flex justify-between items-center hovered'}>
                    <div onClick={() => navigate('/document/'+data.id)} className='py-1 w-full'>
                      <i className="fa-solid fa-caret-right"></i>
                      <span className='pl-4'>{data.name}</span>
                    </div>
                    <span tabIndex={0} role='button' className='px-3 hover:bg-gray-200 rounded-full transition-all duration-100'>
                      <i className="fa-solid fa-ellipsis-vertical fa-vertical"></i>
                    </span>
                  </div>

                  <ul tabIndex={1} className="dropdown-content z-10 menu p-2 drop-shadow-md bg-base-100 rounded-md border border-gray-300 w-52">
                    <DropdownListData icon='fa-pen-to-square' text='Ganti nama' onClick={() => openModal(data.name, data.id)} />
                    <DropdownListData icon='fa-trash-can' text='Hapus kategori' onClick={() => openModalConfirm(data.id)} />
                  </ul>

                </div>
              ))}

              <div onClick={() => openModal()} className='hover:text-gray-700 hover:font-semibold mt-1 w-full'>
                <div>
                  <i className="fa-solid fa-plus"></i>
                  <span className='pl-3'>Buat kategori baru</span>
                </div>
              </div>
            </li>

            <SubListMenu text='Data Siswa' className='mt-8' />
            <ListMenuChild text='Data siswa' to='/data/student' />
            <ListMenuChild text='Rapor' to='/rapor/study-year' />


            <SubListMenu text='Akun' />
            <ListMenu icon='fa-user' text='Profile' to='/' />
            <ListMenu icon='fa-right-from-bracket' text='Keluar' to='/' />


          </ul>
        </div>      
      </aside>

      {/* modal for form input */}
      <ModalForm
        id='modalFormCategory'
        fill={<>
          <h3 className="font-bold text-lg">{textInfo}</h3>
          <BaseInput text='Masukan nama kategori' name='category' value={categoryName} onChange={handleInput} />
          <p className='text-red-400 text-sm hidden' id='errorMsg'>Input tidak boleh kosong</p>
        </>}

        idCloseBtn='closeBtnCategory'
        addButton={<ButtonPrimary text={textBtnAction} onClick={createOrUpdateData} />}
      />

      {/* modal confirm */}
      <ModalAlert 
        id='modalConfirmCategory'
        text='Yakin ingin menghapusnya??'
        idCloseBtn='closeBtnConfirmCategory'
        closeText='Batal'
        addButton={<ButtonPrimary text='Ya, Hapus' onClick={deleteCategory} />}
      />

      {/* alert */}
      <ModalAlert
        id='modalAlertCategory'
        text={textAlert}
        idCloseBtn='closeBtnAlertCategory'
      />
    </>
  )
}

export default Sidebar