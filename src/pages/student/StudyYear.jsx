import { React, useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import { Container, Main } from '../../components/BaseLayout'
import { CardFolder } from '../../components/BaseCard'
import { GetAllStudyYear, CreateStudyYear, DeleteStudyYear, UpdateStudyYear } from '../../api/student/studyYear'
import { BaseInput } from '../../components/BaseInput'
import { getId } from '../../function/baseFunction'
import { ModalAlert, ModalForm } from '../../components/BaseModal'
import { useNavigate } from 'react-router-dom'
import { ButtonPrimary } from '../../components/BaseButton'
import { Footer } from '../../components/Footer'

const StudyYear = () => {
  const [data, setData] = useState([])
  const [studyYear, setStudyYear] = useState('')
  const [id, setId] = useState('')
  const [textInfo, setTextInfo] = useState('')
  const [textBtnAction, setTextBtnAction] = useState('Buat')
  const [textAlert, setTextAlert] = useState('')
  const navigate = useNavigate()

  const getAllData = async () => {
    try {
      const result = await GetAllStudyYear()
      if (result.data) setData(result.data)
    } catch (error) {}
  }

  const handleInput = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'studyYear': if (/^[0-9/-]*$/.test(value) && value.length <= 9) setStudyYear(value); break;
      default: break;
    }
  };

  const openModal = (dataParams = '') => {
    getId('modalForm').showModal()
    getId('studyYearError').classList.add('hidden')
    
    if (dataParams.id) {
      setTextInfo('Ganti nama tahun ajaran baru')
      setTextBtnAction('Simpan')
      setId(dataParams.id)
      setStudyYear(dataParams.study_year)
    } else {
      setTextInfo('Buat tahun ajaran baru')
      setTextBtnAction('Buat')
      setStudyYear('')
      setId('')
    }
  }

  const createOrUpdateData = async () => {
    try {
      if (studyYear == '') getId('studyYearError').classList.remove('hidden')

      const actionResult = (result) => {
        if (result.status !== 200) {
          setTextAlert(result.message)
          getId('modalAlert').showModal()
        } else {
          getId('closeBtn').click()
        }
      }
      
      // create
      if (!id && studyYear) {
        const result = await CreateStudyYear({ study_year: studyYear })
        actionResult(result)
      }

      // update
      if (id && studyYear) {
        const result = await UpdateStudyYear({ study_year: studyYear, id: id })
        actionResult(result)
      }

      setTimeout(() => { getAllData() }, 100)
    } catch (error) {}
  }

  const deleteData = async () => {
    try {
      getId('closeBtnConfirm').click()
      const result = await DeleteStudyYear(id)
      if (result.status !== 200) {
        setTextAlert(result.message)
        getId('modalAlert').showModal()
      }
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
            <ButtonPrimary text='buat tahun ajaran baru' icon='fa-plus' onClick={() => openModal()} className='mr-2' />
          </div>

          <div className='grid grid-cols-4'>
            {data.map((data) => (
              <CardFolder key={data.id} text={data.study_year} count={data.count}
                onClick={() => navigate(`/rapor/study-year/${data.id}/class`)}
                onClickEdit={() => openModal(data)}
                onClickDelete={() => openModalConfirm(data.id)}
              />
            ))}
          </div>

        </Container>
        <Footer/>
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

        addButton={<ButtonPrimary text={textBtnAction} onClick={createOrUpdateData} />}
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

export default StudyYear