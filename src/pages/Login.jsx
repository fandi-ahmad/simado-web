import { React, useState, useEffect } from 'react'
import { LoginUser } from '../api/auth'
import { BaseInput } from '../components/BaseInput'
import { ButtonPrimary } from '../components/BaseButton'
import { getId } from '../function/baseFunction'
import { ModalAlert } from '../components/BaseModal'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [textAlert, setTextAlert] = useState('')
  const navigate = useNavigate()

  const handleInput = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'username': setUsername(value); break;
      case 'password': setPassword(value); break;
      default: break;
    }
  };

  const loginBtn = async () => {
    try {
      if (username == '') getId('usernameError').classList.remove('hidden')
      if (password == '') getId('passwordError').classList.remove('hidden')

      if (username && password) {
        const result = await LoginUser({
          username: username,
          password: password
        })

        if (result.status !== 200) {
          setTextAlert(result.message)
          getId('modalAlert').showModal()
        } else {
          navigate('/')
        }
  
      }
    } catch (error) {
      console.log(error, '<-- error login');
    }
  }

  useEffect(() => {

  },[])

  return (
    <>
      <section>
        <div className="relative flex items-center p-0 overflow-hidden bg-center h-screen bg-cover min-h-75-screen">
          <div className="container z-10">
            <div className="flex flex-wrap -mx-3">
              <div className="flex flex-col w-full max-w-full px-3 mx-auto md:flex-0 shrink-0 md:w-6/12 lg:w-5/12 xl:w-4/12">
                <div className="flex flex-col min-w-0 break-words bg-white border-0 shadow-none rounded-2xl bg-clip-border">
                  <div className="p-6 pb-0 mb-0 bg-transparent border-b-0 rounded-t-2xl">
                    <h3 className="relative z-10 font-bold ">Masuk</h3>
                    <p className="mb-0">Masukan Username dan Password untuk masuk</p>
                  </div>
                  <div className="flex-auto p-6">
                    <BaseInput text='Username' className='mb-4' idError='usernameError' name='username' onChange={handleInput} value={username} placeholder='username' />
                    <BaseInput text='Password' className='mb-4' idError='passwordError' name='password' onChange={handleInput} value={password} placeholder='Password' type='password' />
                    <ButtonPrimary className='w-full' text='Masuk' onClick={loginBtn} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* alert */}
      <ModalAlert
        id='modalAlert'
        text={textAlert}
        idCloseBtn='closeBtnAlert'
      />
    </>
  )
}

export default Login