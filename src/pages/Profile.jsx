import { React, useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { Container, Main } from '../components/BaseLayout'
import Navbar from '../components/Navbar'
import { InputColumn } from '../components/BaseInput'
import { ButtonPrimary } from '../components/BaseButton'
import { useGlobalState } from '../state/state'
import { ModalAlert } from '../components/BaseModal'
import { getId } from '../function/baseFunction'
import { UpdateUser } from '../api/user'
import { Footer } from '../components/Footer'

const Profile = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [userIdLogin, setUserIdLogin] = useGlobalState('userIdLogin')
  const [usernameLogin, setUsernameLogin] = useGlobalState('usernameLogin')
  const [userRoleLogin, setUserRoleLogin] = useGlobalState('userRoleLogin')
  const [textAlert, setTextAlert] = useState('')

  const handleInput = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'username': setUsername(value); break;
      case 'password': setPassword(value); break;
      case 'new_password': setNewPassword(value); break;
      default: break;
    }
  };

  const cleanUpFormInput = () => {
    setPassword('')
    setNewPassword('')
    getId('usernameError').classList.add('hidden')
    getId('passwordError').classList.add('hidden')
    getId('newPasswordError').classList.add('hidden')
  }

  const btnUpdateUsernameClick = () => {
    if (username === '') getId('usernameError').classList.remove('hidden')
    if (username) getId('modalConfirmUsername').showModal()
  }

  const btnUpdatePasswordClick = () => {
    if (password === '') getId('passwordError').classList.remove('hidden')
    if (newPassword === '') getId('newPasswordError').classList.remove('hidden')
    if (password && newPassword) getId('modalConfirmPassword').showModal()
  }

  const updateUsername = async () => {
    try {
      if (username) {
        getId('closeBtnConfirmUsername').click()
        const result = await UpdateUser({
          id: userIdLogin,
          username: username,
          role: userRoleLogin
        })
        if (result.status == 200) {
          setUsernameLogin(username)
          setTextAlert('Username berhasil diperbarui!')
          getId('modalAlert').showModal()
          cleanUpFormInput()
        } else {
          setTextAlert(result.message)
          getId('modalAlert').showModal()
        }
      }
    } catch (error) {}
  }

  const updatePassword = async () => {
    try {
      getId('closeBtnConfirmPassword').click()

      const result = await UpdateUser({
        id: userIdLogin,
        username: usernameLogin,
        role: userRoleLogin,
        password: password,
        new_password: newPassword
      })

      if (result.status == 200) {
        cleanUpFormInput()
        setTextAlert('Password berhasil diperbarui!')
        getId('modalAlert').showModal()
      } else {
        setTextAlert(result.message)
        getId('modalAlert').showModal()
      }

    } catch (error) {}
  }

  useEffect(() => {
    setUsername(usernameLogin)
  }, [usernameLogin])

  return (
    <>
      <Sidebar/>
      <Main>
        <Navbar page='profil' />

        <Container>
          <div className='w-full p-6 rounded-lg bg-white'>
            <div className='w-fit'>

              <h6>Username</h6>
              <div className='flex flex-row'>
                <InputColumn idError='usernameError' text='Username' name='username' value={username} onChange={handleInput} className='mt-1 mr-6' />
                <ButtonPrimary text='perbarui username' onClick={btnUpdateUsernameClick} />
              </div>

              <h6 className='mt-6'>Perbarui Password</h6>
              <div className='flex flex-row'>
                <InputColumn idError='passwordError' text='Password lama' name='password' value={password} onChange={handleInput} className='mt-1 mr-6' />
                {/* disable button */}
                <ButtonPrimary text='perbarui password' className='opacity-0 hover:opacity-0 cursor-default' />
              </div>

              <div className='flex flex-row'>
                <InputColumn idError='newPasswordError' text='Password baru' name='new_password' value={newPassword} onChange={handleInput} type='password' className='mt-1 mr-6' />
                <ButtonPrimary text='perbarui password' onClick={btnUpdatePasswordClick} />
              </div>

            </div>
          </div>

        </Container>
        <Footer/>
      </Main>

      {/* modal confirm for username */}
      <ModalAlert
        id='modalConfirmUsername'
        text='Perbarui username?'
        idCloseBtn='closeBtnConfirmUsername'
        closeText='Batal'
        addButton={<ButtonPrimary text='Ya, perbarui' onClick={updateUsername} />}
      />

      {/* modal confirm for password */}
      <ModalAlert 
        id='modalConfirmPassword'
        text='Perbarui password?'
        idCloseBtn='closeBtnConfirmPassword'
        closeText='Batal'
        addButton={<ButtonPrimary text='Ya, perbarui' onClick={updatePassword} />}
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

export default Profile