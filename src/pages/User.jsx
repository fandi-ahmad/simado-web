import { React, useEffect, useRef, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Container, ContainerRow, Main } from '../components/BaseLayout'
import Navbar from '../components/Navbar'
import { CreateUser, DeleteUser, GetAllUser, UpdateUser } from '../api/user'
import { BaseTable, TableData, TableHead } from '../components/BaseTable'
import { ModalAlert, ModalForm } from '../components/BaseModal'
import { BaseInput } from '../components/BaseInput'
import { formatDateAndTime, getId } from '../function/baseFunction'
import { ButtonPrimary } from '../components/BaseButton'
import { BaseDropdownUl, DropdownListData } from '../components/Dropdown'

const User = () => {
  const btnClass = 'btn text-white capitalize bg-gradient-to-tl from-purple-700 to-pink-500 border-0 hover:opacity-85'
  const [data, setData] = useState([])
  const [textInfo, setTextInfo] = useState('tambah')
  const [textAlert, setTextAlert] = useState('')
  const [passInfo, setPassInfo] = useState('')
  const [id, setId] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const getAllData = async () => {
    try {
      const result = await GetAllUser()
      setData(result.data)
    } catch (error) {
      
    }
  }

  const cleanUpFormInput = () => {
    setId('')
    setUsername('')
    setPassword('')
    setNewPassword('')
    getId('usernameError').classList.add('hidden')
    getId('passwordError').classList.add('hidden')
    getId('newPasswordError').classList.add('hidden')
  }

  const handleInput = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'username': setUsername(value); break;
      case 'password': setPassword(value); break;
      case 'newPassword': setNewPassword(value); break;
      default: break;
    }
  };

  const openModal = (dataParams = '', isPassword = false) => {
    cleanUpFormInput()

    if (dataParams.id) {
      // for edit
      setTextInfo('perbarui')
      setPassInfo('lama')
      setUsername(dataParams.username)
      setId(dataParams.id)

      getId('username').classList.remove('hidden')
      getId('password').classList.add('hidden')
      getId('newPassword').classList.add('hidden')

      if (isPassword) {
        getId('username').classList.add('hidden')
        getId('password').classList.remove('hidden')
        getId('newPassword').classList.remove('hidden')
      }

    } else {
      // for create
      setTextInfo('tambah')
      setPassInfo('')
      getId('username').classList.remove('hidden')
      getId('password').classList.remove('hidden')
      getId('newPassword').classList.add('hidden')
    }

    getId('modalForm').showModal()
  }

  const openModalConfirm = (idselected) => {
    setId(idselected)
    getId('modalConfirm').showModal()
  }

  const createOrUpdateData = async () => {
    try {
      if (username == '') getId('usernameError').classList.remove('hidden')
      if (password == '') getId('passwordError').classList.remove('hidden')
      if (newPassword == '') getId('newPasswordError').classList.remove('hidden')


      if (!id && username && password) {
        getId('closeBtn').click()
        await CreateUser({
          username: username,
          password: password
        })

      }

      if (id && username) {
        getId('closeBtn').click()
        await UpdateUser({
          id: id,
          username: username,
          password: password,
          new_password: newPassword
        })

      }
      
      setTimeout(() => { getAllData() }, 100)
    } catch (error) {
      
    }
  }

  const deleteData = async () => {
    try {
      getId('closeBtnConfirm').click()
      await DeleteUser(id)
      getAllData()
    } catch (error) {
      setTextAlert('Terjadi kesalahan!')
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
                <TableHead text='diperbarui pada' />
                <TableHead />
                <TableHead />
              </>}

              tbody={<>
                {data ? data.map((data, index) => (
                  <tr key={data.id}>
                    <TableData text={index+1} />
                    <TableData text={data.username} />
                    <TableData text={formatDateAndTime(data.updatedAt)} />
                    <TableData className='w-full' />
                    <TableData text={
                      <BaseDropdownUl icon='fa-ellipsis-vertical'>
                        <DropdownListData icon='fa-pen-to-square' text='Edit username' onClick={() => openModal(data)} />
                        <DropdownListData icon='fa-unlock-keyhole' text='Perbarui password' onClick={() => openModal(data, true)} />
                        <DropdownListData icon='fa-trash-can' text='Hapus' onClick={() => openModalConfirm(data.id)} />
                      </BaseDropdownUl>
                    } className='w-48' />
                  </tr>
                )) : null}
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

          <div>
            <BaseInput idError='usernameError' idField='username' text='nama pengguna' onChange={handleInput} value={username} name='username' />
            <BaseInput idError='passwordError' idField='password' text={'password ' + passInfo} onChange={handleInput} value={password} name='password' />
            <BaseInput idError='newPasswordError' idField='newPassword' text='password baru' onChange={handleInput} value={newPassword} name='newPassword' />
          </div>

        </>}

        addButton={<>
          <ButtonPrimary text={textInfo} onClick={createOrUpdateData} />
        </>}
      />

      {/* modal confirm */}
      <ModalAlert
        id='modalConfirm'
        text='Yakin ingin menghapusnya??'
        idCloseBtn='closeBtnConfirm'
        closeText='Batal'
        addButton={<ButtonPrimary text='ya, hapus' onClick={deleteData} />}
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