import { React, useState, useEffect } from 'react'
import { LoginUser } from '../api/auth'

const Login = () => {
  const classInput = 'focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:outline-none focus:transition-shadow'
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

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
      const result = await LoginUser({
        username: username,
        password: password
      })

      console.log(result, '<-- result login');
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
                    <label className="mb-2 ml-1 font-bold text-xs text-slate-700">Username</label>
                    <div className="mb-4">
                      <input type="text" className={classInput} name='username' onChange={handleInput} value={username} placeholder="Username" />
                    </div>
                    <label className="mb-2 ml-1 font-bold text-xs text-slate-700">Password</label>
                    <div className="mb-4">
                      <input type="password" className={classInput} name='password' onChange={handleInput} value={password} placeholder="Password" />
                    </div>
                    <div className="text-center">
                      <button onClick={loginBtn} className='bg-blue-500 text-white py-2 w-full rounded-md transition-all hover:bg-blue-400'>Masuk</button>
                      {/* <button type="button" className="inline-block w-full px-6 py-3 mt-6 mb-0 font-bold text-center text-white uppercase align-middle transition-all bg-blue-500 border-0 rounded-lg cursor-pointer shadow-soft-md bg-x-25 bg-150 leading-pro text-xs ease-soft-in tracking-tight-soft hover:shadow-soft-xs active:opacity-85">Masuk</button> */}
                    </div>
                  </div>
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Login