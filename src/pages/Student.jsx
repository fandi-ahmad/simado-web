import { React, useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { Container, ContainerRow, Main } from '../components/BaseLayout'
import Navbar from '../components/Navbar'
import { CreateStudent, DeleteStudent, GetAllStudent, UpdateStudent } from '../api/student'
import { ActionListData, BaseTable, TableData, TableHead } from '../components/BaseTable'
import { ModalAlert, ModalForm } from '../components/BaseModal'
import { getId } from '../function/baseFunction'
import { InputColumn } from '../components/BaseInput'

const Student = () => {
  const btnClass = 'btn text-white capitalize bg-gradient-to-tl from-purple-700 to-pink-500 border-0 hover:opacity-85'
  const [data, setData] = useState([])
  const [textInfo, setTextInfo] = useState('')
  const [textBtnAction, setTextBtnAction] = useState('buat')
  const [textAlert, setTextAlert] = useState('')
  const [nisn, setNisn] = useState('')
  const [studentName, setStudentName] = useState('')
  const [year, setYear] = useState('')
  const [id, setId] = useState('')

  const getAllData = async () => {
    try {
      const result = await GetAllStudent()
      setData(result.data)
    } catch (error) {}
  }
  
  const handleInput = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'nisn': setNisn(value); break;
      case 'studentName': setStudentName(value); break;
      case 'year': setYear(value); break;
      default: break;
    }
  };

  const cleanUpFormInput = () => {
    setId('')
    setNisn('')
    setStudentName('')
    setYear('')
    getId('nisnError').classList.add('hidden')
    getId('studentNameError').classList.add('hidden')
    getId('yearError').classList.add('hidden')
  }  

  const openModal = (dataParams = '') => {
    getId('modalForm').showModal()
    cleanUpFormInput()

    if (dataParams.id) {
      // for edit
      setTextBtnAction('simpan')
      setTextInfo('Edit data siswa')

      setId(dataParams.id)
      setNisn(dataParams.nisn)
      setStudentName(dataParams.name)
      setYear(dataParams.year)
    } else {
      // for create new
      setTextBtnAction('buat')
      setTextInfo('Buat data siswa baru')
    }
  }

  const openModalConfirm = (idSelected) => {
    setId(idSelected)
    getId('modalConfirm').showModal()
  }

  const validateNisn = (condition) => {
    if (condition == 406) {
      setTextAlert('NISN sudah digunakan!')
      getId('modalAlert').showModal()
    } else {
      getId('closeBtn').click()
    }
  }

  const createOrUpdateData = async () => {
    try {
      if (nisn == '') getId('nisnError').classList.remove('hidden')
      if (studentName == '') getId('studentNameError').classList.remove('hidden')
      if (year == '') getId('yearError').classList.remove('hidden')

      // create
      if (!id && nisn && studentName && year) {
        const result = await CreateStudent({
          nisn: nisn,
          name: studentName,
          year: year
        })
        validateNisn(result.status)
      }

      // update
      if (id && nisn && studentName && year) {
        const result = await UpdateStudent({
          id: id,
          nisn: nisn,
          name: studentName,
          year: year
        })
        validateNisn(result.status)
      }
      
      setTimeout(() => { getAllData() }, 100)
    } catch (error) {}
  }

  const deleteData = async () => {
    try {
      getId('closeBtnConfirm').click()
      await DeleteStudent(id)
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
        <Navbar 
          page={'data / siswa'}
          pageTitle={'data siswa'}
        />

        <Container>

          <div className='flex justify-end mb-4'>
            <button className={btnClass} onClick={() => openModal()}>buat data siswa baru <i className="fa-solid fa-plus"></i></button>
          </div>
          
          <ContainerRow className='-mx-3 relative'>
            {!data[0] ? <div className='w-full text-center text-2xl'>-- belum ada data --</div> : 
              <BaseTable
                thead={<>
                  <TableHead text='No' className='w-12' />
                  <TableHead text='NISN' />
                  <TableHead text='Nama Siswa' />
                  <TableHead text='Tahun masuk' />
                  <TableHead />
                  <TableHead />
                </>}

                tbody={<>
                  {data.map((data, index) => (
                    <tr key={data.id}>
                      <TableData text={index+1} />
                      <TableData text={data.nisn} />
                      <TableData text={data.name} className='capitalize' />
                      <TableData text={data.year} />
                      <TableData className='w-full' />
                      <TableData text={
                        <>
                          <div className='dropdown dropdown-end mr-4'>
                            <button tabIndex={1} role='button' className='btn btn-sm'>
                              <i className="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                            <ul tabIndex={10} className="dropdown-content z-10 absolute menu p-2 shadow bg-base-100 rounded-md w-52 border border-gray-300 font-medium">
                              <ActionListData icon='fa-pen-to-square' text='Edit' onClick={() => openModal(data)} />
                              <ActionListData icon='fa-trash-can' text='Hapus' onClick={() => openModalConfirm(data.id)} />
                            </ul>
                          </div>
                        </>
                      } className='w-48' />
                    </tr>
                  ))}
                  
                </>}
              />
            }
          </ContainerRow>

        </Container>
      </Main>

      {/* modal form for input */}
      <ModalForm
        full={true}
        fill={<>
          <h3 className="font-bold text-lg capitalize">{textInfo}</h3>
          <InputColumn idError='nisnError' text='NISN' name='nisn' onChange={handleInput} value={nisn} required />
          <InputColumn idError='studentNameError' text='Nama siswa' name='studentName' onChange={handleInput} value={studentName} required />
          <InputColumn idError='yearError' text='Tahun masuk' name='year' onChange={handleInput} value={year} required />
        </>}

        addButton={<>
          <button className={"btn "+btnClass} onClick={createOrUpdateData}>{textBtnAction}</button>
        </>}
      />

      {/* modal confirm */}
      <ModalAlert
        id='modalConfirm'
        text='Yakin ingin menghapusnya??'
        idCloseBtn='closeBtnConfirm'
        closeText='Batal'
        addButton={<button className={"btn "+btnClass} onClick={deleteData}>Ya, Hapus</button>}
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

export default Student