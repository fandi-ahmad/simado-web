import { React, useEffect, useRef, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Container, ContainerRow, Main } from '../components/BaseLayout'
import Navbar from '../components/Navbar'
import { CreateUser, GetAllUser, UpdateUser } from '../api/user'
import { BaseTable, TableData, TableHead } from '../components/BaseTable'
import { ModalAlert, ModalForm } from '../components/BaseModal'
import { BaseInput } from '../components/BaseInput'
import { getId } from '../function/baseFunction'

const User = () => {
  const btnClass = 'btn text-white capitalize bg-gradient-to-tl from-purple-700 to-pink-500 border-0 hover:opacity-85'
  const [data, setData] = useState([])
  const [textInfo, setTextInfo] = useState('tambah')
  const [textAlert, setTextAlert] = useState('')
  const [passInfo, setPassInfo] = useState('')
  const [uuid, setUuid] = useState('')
  const meta = useRef({
    username: '',
    password: '',
    new_password: ''
  })

  const getAllData = async () => {
    try {
      const result = await GetAllUser()
      setData(result.data)
    } catch (error) {
      
    }
  }

  const openModal = (dataParams = '') => {
    setUuid(dataParams.uuid)

    meta.current.username = dataParams.username
    getId('username').value = dataParams.username

    if (dataParams.uuid) {
      setTextInfo('perbarui')
      setPassInfo('lama')
      getId('new_password').classList.remove('hidden')
      getId('btnCreate').classList.add('hidden')
      getId('btnUpdate').classList.remove('hidden')
    } else {
      setTextInfo('tambah')
      setPassInfo('')
      getId('new_password').classList.add('hidden')
      getId('btnCreate').classList.remove('hidden')
      getId('btnUpdate').classList.add('hidden')
    }

    getId('modalForm').showModal()
  }

  const openModalConfirm = (uuid) => {
    setUuid(uuid)
    getId('modalConfirm').showModal()
  }

  const handleChange = (fieldName, event) => {
    meta.current[fieldName] = event.target.value;
  };

  const createData = async () => {
    try {
      getId('closeBtn').click()
      await CreateUser({
        username: meta.current.username,
        password: meta.current.password
      })
      getAllData()
    } catch (error) {
      
    }
  }

  const updateData = async () => {
    try {
      getId('closeBtn').click()
      await UpdateUser({
        uuid: uuid,
        username: meta.current.username,
        password: meta.current.password,
        new_password: meta.current.new_password
      })
      getAllData()
    } catch (error) {
      console.log(error, '<-- error update');
    }
  }

  useEffect(() => {
    getAllData()
  }, [])

  return (
    <>
      <Sidebar/>
      <Main>
        <Navbar page='Pengguna' />
        <Container>

          <div className='flex justify-end mb-4'>
            <button className={btnClass} onClick={() => openModal()}>tambah Pengguna <i className="fa-solid fa-plus"></i></button>
          </div>
          
          <ContainerRow className='-mx-3'>
            <BaseTable
              thead={<>
                <TableHead text='No' className='w-12' />
                <TableHead text='Nama Pengguna' />
                <TableHead text='dibuat pada' />
                <TableHead />
              </>}

              tbody={<>
                {data.map((data, index) => (
                  <tr key={data.uuid}>
                    <TableData text={index+1} />
                    <TableData text={data.username} />
                    <TableData text={data.createdAt} />
                    <TableData text={
                      <>
                        <button className={'btn btn-sm btn-primary ms-4'} onClick={() => openModal(data)}>Edit</button>
                        {/* <button className={'btn btn-sm btn-error text-white ms-4'} onClick={() => openModalConfirm(data.uuid)} >Hapus</button> */}
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
          <h3 className="font-bold text-lg capitalize">{textInfo} pengguna</h3>

          <div className=''>
            <BaseInput text='nama pengguna' id='username' onChange={(event) => handleChange('username', event)} />
            <BaseInput text={'password '+passInfo} id='password' onChange={(event) => handleChange('password', event)} />
            <BaseInput text='password baru' idField='new_password' onChange={(event) => handleChange('new_password', event)} />
          </div>

        </>}

        addButton={<>
          <button className={"btn hidden "+btnClass} id='btnCreate' onClick={createData}>Tambah</button>
          <button className={"btn hidden "+btnClass} id='btnUpdate' onClick={updateData}>Perbarui</button>
        </>}
      />

      {/* modal confirm */}
      <ModalAlert
        id='modalConfirm'
        text='Yakin ingin menghapusnya??'
        idCloseBtn='closeBtnConfirm'
        closeText='Batal'
        addButton={<button className={"btn "+btnClass} >Ya, Hapus</button>}
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

export default User