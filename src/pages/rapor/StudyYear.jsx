import { React, useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import { Container, ContainerRow, Main } from '../../components/BaseLayout'
import { CardFolder } from '../../components/BaseCard'
import { GetAllStudyYear, CreateStudyYear, DeleteStudyYear, UpdateStudyYear } from '../../api/studyYear'
import { BaseInput, InputColumn } from '../../components/BaseInput'
import { getId } from '../../function/baseFunction'
import { ModalAlert, ModalForm } from '../../components/BaseModal'
import { useNavigate } from 'react-router-dom'

const StudyYear = () => {
  const btnClass = 'btn text-white capitalize bg-gradient-to-tl from-purple-700 to-pink-500 border-0 hover:opacity-85'
  const [data, setData] = useState([])
  const [studyYear, setStudyYear] = useState('')
  const [id, setId] = useState('')
  const [textInfo, setTextInfo] = useState('')
  const navigate = useNavigate()

  const getAllData = async () => {
    try {
      const result = await GetAllStudyYear()
      setData(result.data)
    } catch (error) {}
  }

  const handleInput = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'studyYear': setStudyYear(value); break;
      default: break;
    }
  };

  const openModal = (dataParams = '') => {
    getId('modalForm').showModal()
    getId('studyYearError').classList.add('hidden')
    
    if (dataParams.id) {
      setTextInfo('Ganti nama tahun ajaran baru')
      getId('btnCreate').classList.add('hidden')
      getId('btnUpdate').classList.remove('hidden')
      setId(dataParams.id)
      setStudyYear(dataParams.study_year)
    } else {
      setTextInfo('Buat tahun ajaran baru')
      getId('btnCreate').classList.remove('hidden')
      getId('btnUpdate').classList.add('hidden')
      setStudyYear('')
    }
  }

  const createStudyYear = async () => {
    try {
      if (studyYear == '') {
        getId('studyYearError').classList.remove('hidden')
      } else {
        getId('closeBtn').click()
        await CreateStudyYear({ study_year: studyYear })
        setTimeout(() => { getAllData() }, 100)
      }
    } catch (error) {}
  }

  const updateStudyYear = async () => {
    try {
      if (studyYear == '') {
        getId('studyYearError').classList.remove('hidden')
      } else {
        getId('closeBtn').click()
        await UpdateStudyYear({ study_year: studyYear, id: id })
        setTimeout(() => { getAllData() }, 100)
      }
    } catch (error) {}
  }

  const deleteData = async () => {
    try {
      getId('closeBtnConfirm').click()
      await DeleteStudyYear(id)
      getAllData()
    } catch (error) {
      setTextAlert('Terjadi kesalahan!')
      getId('modalAlert').showModal()
    }
  }

  const openModalConfirm = (dataId) => {
    setId(dataId)
    getId('modalConfirm').showModal()
  }

  useEffect(() => {
    getAllData()
  }, [])

  return (
    <>
      <Sidebar/>
      <Main>
        <Navbar page='rapor / tahun ajar' pageTitle='tahun ajar' />
        <Container>

          <div className='flex justify-end mb-4'>
            <button className={'mr-2 '+btnClass} onClick={() => openModal()}>buat tahun ajar baru <i className="fa-solid fa-plus"></i></button>
          </div>

          <div className='grid grid-cols-4'>
            {data.map((data) => (
              <CardFolder key={data.id} text={data.study_year}
                onClick={() => navigate(`/rapor/study-year/${data.id}/class`)}
                onClickEdit={() => openModal(data)}
                onClickDelete={() => openModalConfirm(data.id)}
              />
            ))}
          </div>


        </Container>

      </Main>

      {/* modal for form input */}
      <ModalForm
        id='modalForm'
        fill={<>
          <h3 className="font-bold text-lg capitalize">{textInfo}</h3>

          <div>
            <BaseInput idError='studyYearError' onChange={handleInput} value={studyYear} name='studyYear' />
            <span className='text-sm'><span className='font-semibold'>Contoh:</span> 2023/2024</span>
          </div>

        </>}

        addButton={<>
          <button className={"btn hidden "+btnClass} id='btnCreate' onClick={createStudyYear}>buat</button>
          <button className={"btn hidden "+btnClass} id='btnUpdate' onClick={updateStudyYear}>simpan</button>
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


    </>
  )
}

export default StudyYear