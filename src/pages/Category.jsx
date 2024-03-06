import { React, useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { BaseTable, TableHead, TableData } from '../components/BaseTable'
import { Main, Container, ContainerRow } from '../components/BaseLayout'
import { GetAllCategory, CreateCategory, DeleteCategory, UpdateCategory } from '../api/category'
import { getId } from '../function/baseFunction'
import { ModalAlert, ModalForm } from '../components/BaseModal'
import { BaseInput } from '../components/BaseInput'


const Category = () => {
  const btnClass = 'btn text-white capitalize bg-gradient-to-tl from-purple-700 to-pink-500 border-0 hover:opacity-85'
  const [data, setData] = useState([])
  const [categoryName, setCategoryName] = useState('')
  const [uuid, setUuid] = useState('')
  const [textInfo, setTextInfo] = useState('tambah')
  const [textAlert, setTextAlert] = useState('')

  const getAllData = async () => {
    try {
      const result = await GetAllCategory()
      setData(result.data)
    } catch (error) {
      
    }
  }

  const openModal = (category = '', uuid = '') => {
    setCategoryName(category)
    setUuid(uuid)

    if (uuid) {
      setTextInfo('perbarui')
      getId('btnCreate').classList.add('hidden')
      getId('btnUpdate').classList.remove('hidden')
    } else {
      setTextInfo('tambah')
      getId('btnCreate').classList.remove('hidden')
      getId('btnUpdate').classList.add('hidden')
    }

    getId('errorMsg').classList.add('hidden')
    getId('modalForm').showModal()
  }

  const openModalConfirm = (uuid) => {
    setUuid(uuid)
    getId('modalConfirm').showModal()
  }

  const handleInput = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'category': setCategoryName(value); break;
      default: break;
    }
  };

  const validateInput =  (run) => {
    if (categoryName == '') {
      getId('errorMsg').classList.remove('hidden')
      return false
    } else {
      getId('errorMsg').classList.add('hidden')
      getId('closeBtn').click()
      return true
    }
  }

  const createCategory = async () => {
    try {
      const validate = validateInput()
      if (validate) {
        await CreateCategory({name: categoryName})
        getAllData()
      }
    } catch (error) {

    }
  }

  const updateCategory = async () => {
    try {
      const validate = validateInput()
      if (validate) {
        await UpdateCategory({name: categoryName, uuid: uuid})
      }
      setTimeout(() => { getAllData() }, 100)
    } catch (error) {

    }
  }

  const deleteCategory = async () => {
    try {
      getId('closeBtnConfirm').click()
      await DeleteCategory(uuid)
      getAllData()
    } catch (error) {
      if (error.status == 405) {
        setTextAlert('Tidak bisa dihapus, karena kategori ini sudah digunakan pada File Dokumen!')
      } else {
        setTextAlert('Terjadi kesalahan!')
      }
      getId('modalAlert').showModal()
    }
  }

  useEffect(() => {
    getAllData()
  }, [])
  
  return (
    <>
      <Sidebar/>
      <Main>
        <Navbar page='Kategori' />
        <Container>

          <div className='flex justify-end mb-4'>
            <button className={btnClass} onClick={()=>openModal()}>tambah kategori <i className="fa-solid fa-plus"></i></button>
          </div>
          
          <ContainerRow className='-mx-3'>
            <BaseTable
              thead={<>
                <TableHead text='No' className='w-12' />
                <TableHead text='Kategori' />
                <TableHead />
              </>}

              tbody={<>
                {data.map((data, index) => (
                  <tr key={data.id}>
                    <TableData text={index+1} />
                    <TableData text={data.name} />
                    <TableData text={
                      <>
                        <button className={'btn btn-sm btn-primary'} onClick={() => openModal(data.name, data.id)}>Edit</button>
                        <button className={'btn btn-sm btn-error text-white ms-4'} onClick={() => openModalConfirm(data.id)} >Hapus</button>
                      </>
                    } className='w-48' />
                  </tr>
                ))}
              </>}
            />
          </ContainerRow>

        </Container>
      </Main>

      {/* modal for form input */}
      <ModalForm
        id='modalForm'
        fill={<>
          <h3 className="font-bold text-lg capitalize">{textInfo} Kategori</h3>
          <BaseInput text='Masukan nama kategori' name='category' value={categoryName} onChange={handleInput} />
          <p className='text-red-400 text-sm hidden' id='errorMsg'>Input tidak boleh kosong</p>
        </>}

        addButton={<>
          <button className={"btn hidden "+btnClass} id='btnCreate' onClick={createCategory}>Tambah</button>
          <button className={"btn hidden "+btnClass} id='btnUpdate' onClick={updateCategory}>Perbarui</button>
        </>}
      />

      {/* modal confirm */}
      <ModalAlert 
        id='modalConfirm'
        text='Yakin ingin menghapusnya??'
        idCloseBtn='closeBtnConfirm'
        closeText='Batal'
        addButton={<button className={"btn "+btnClass} onClick={deleteCategory}>Ya, Hapus</button>}
      />

      {/* alert */}
      <ModalAlert
        id='modalAlert'
        text={textAlert}
        idCloseBtn='closeBtnAlert'
      />


    </>
  )
}

export default Category