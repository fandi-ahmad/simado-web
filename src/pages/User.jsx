import { React, useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Container, ContainerRow, Main } from '../components/BaseLayout'
import Navbar from '../components/Navbar'
import { CreateUser, DeleteUser, GetAllUser, UpdateUser } from '../api/user'
import { BaseTable, TableData, TableHead } from '../components/BaseTable'
import { ModalAlert, ModalForm } from '../components/BaseModal'
import { BaseInput, SelectInput } from '../components/BaseInput'
import { formatDateAndTime, getId } from '../function/baseFunction'
import { ButtonPrimary } from '../components/BaseButton'
import { BaseDropdownUl, DropdownListData } from '../components/Dropdown'
import { Footer } from '../components/Footer'

const User = () => {
  const [data, setData] = useState([])
  const [textInfo, setTextInfo] = useState('tambah')
  const [textAlert, setTextAlert] = useState('')
  const [passInfo, setPassInfo] = useState('')
  const [id, setId] = useState('')
  const [username, setUsername] = useState('')
  const [role, setRole] = useState('staff')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isUpdatePassword, setIsUpdatePassword] = useState(false)

  const getAllData = async () => {
    try {
      const result = await GetAllUser()
      if (result.data) setData(result.data)
    } catch (error) {
      
    }
  }

  const cleanUpFormInput = () => {
    setId('')
    setUsername('')
    setPassword('')
    setNewPassword('')
    setRole('staff')
    getId('role').value = 'staff'
    getId('usernameError').classList.add('hidden')
    getId('passwordError').classList.add('hidden')
    getId('newPasswordError').classList.add('hidden')
  }

  const handleInput = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'username': setUsername(value); break;
      case 'role': setRole(value); break;
      case 'password': setPassword(value); break;
      case 'newPassword': setNewPassword(value); break;
      default: break;
    }
  };

  const openModal = (dataParams = '', isPassword = false) => {
    cleanUpFormInput()
    setIsUpdatePassword(false)

    if (dataParams.id) {
      // for edit
      setTextInfo('perbarui')
      setPassInfo('lama')
      setUsername(dataParams.username)
      setId(dataParams.id)
      setRole(dataParams.role)
      getId('role').value = dataParams.role

      getId('username').classList.remove('hidden')
      getId('password').classList.add('hidden')
      getId('newPassword').classList.add('hidden')

      if (isPassword) {
        setIsUpdatePassword(true)
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

      // create user
      if (!id && username && password) {
        getId('closeBtn').click()
        await CreateUser({
          username: username,
          password: password,
          role: role
        })
      }

      // update user
      if (id && username) {

        const runResultUpdate = (result) => {
          if (result.status == 200) {
            getId('closeBtn').click()
            if (password && newPassword) {
              setTextAlert('Password berhasil diperbarui!')
            } else {
              setTextAlert('Username berhasil diperbarui!')
            }
            getId('modalAlert').showModal()
          } else {
            setTextAlert(result.message)
            getId('modalAlert').showModal()
          }
        }

        // update user username
        if (!isUpdatePassword && !password && !newPassword) {
          const result = await UpdateUser({
            id: id,
            username: username,
            password: password,
            new_password: newPassword,
            role: role
          })
          runResultUpdate(result)
        }

        // update user password
        if (isUpdatePassword && password && newPassword) {
          const result = await UpdateUser({
            id: id,
            username: username,
            password: password,
            new_password: newPassword,
            role: role
          })
          runResultUpdate(result)
        }
      }
      
      setTimeout(() => { getAllData() }, 100)
    } catch (error) {}
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
            <ButtonPrimary text='tambah pengguna' icon='fa-plus' onClick={() => openModal()} />
          </div>
          
          <ContainerRow className='-mx-3'>
            <BaseTable
              thead={<>
                <TableHead text='No' className='w-12' />
                <TableHead text='Nama Pengguna' />
                <TableHead text='role' />
                <TableHead text='diperbarui pada' />
                <TableHead />
                <TableHead />
              </>}

              tbody={<>
                {data ? data.map((data, index) => (
                  <tr key={data.id}>
                    <TableData text={index+1} />
                    <TableData text={data.username} />
                    <TableData text={data.role} />
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
        <Footer/>
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
            <SelectInput id='role' text='role' name='role' value={role} onChange={handleInput} isDefaultValue={true}
              option={<>
                <option value="staff">staff</option>
                <option value="operator">operator</option>
              </>}
            />

          </div>

        </>}

        addButton={<ButtonPrimary text={textInfo} onClick={createOrUpdateData} />}
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