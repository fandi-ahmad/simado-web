import { React, useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import { Container, Main } from '../../components/BaseLayout'
import Navbar from '../../components/Navbar'
import { CardFolder } from '../../components/BaseCard'
import { useParams, useNavigate } from 'react-router-dom'
import { GetAllStudyYear } from '../../api/student/studyYear'
import { GetAllClass, CreateClass, DeleteClass, UpdateClass } from '../../api/student/class'
import { ModalAlert, ModalForm } from '../../components/BaseModal'
import { BaseInput } from '../../components/BaseInput'
import { getId } from '../../function/baseFunction'
import { ButtonPrimary } from '../../components/BaseButton'

const ClassName = () => {
  const params = useParams()
  const navigate = useNavigate()
  const idStudyYear = params.id_study_year
  const [studyYearName, setStudyYearName] = useState('')
  const [data, setData] = useState([])
  const [id, setId] = useState('')
  const [className, setClassName] = useState('')
  const [textInfo, setTextInfo] = useState('')
  const [textBtnAction, setTextBtnAction] = useState('buat')
  const [textAlert, setTextAlert] = useState('')

  const getStudyYearById = async () => {
    try {
      const result = await GetAllStudyYear(idStudyYear)
      result.status == 200 ? setStudyYearName(result.data.study_year) : navigate('/rapor/study-year')
    } catch (error) {}
  }

  const getAllData = async () => {
    try {
      const result = await GetAllClass('', idStudyYear)
      setData(result.data)
    } catch (error) {}
  }

  const handleInput = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'className': setClassName(value); break;
      default: break;
    }
  };

  const cleanUpFormInput = () => {
    setId('')
    setClassName('')
    getId('classNameError').classList.add('hidden')
  }

  const openModal = (dataParams = '') => {
    getId('modalForm').showModal()
    cleanUpFormInput()

    if (dataParams.id) {
      // for edit
      setTextBtnAction('simpan')
      setTextInfo('Ganti nama kelas')

      setId(dataParams.id)
      setClassName(dataParams.class_name)
    } else {
      // for create new
      setTextBtnAction('buat')
      setTextInfo('Buat nama kelas baru')
    }
  }

  const openModalConfirm = (idSelected) => {
    setId(idSelected)
    getId('modalConfirm').showModal()
  }

  const createOrUpdateData = async () => {
    try {
      if (className == '') getId('classNameError').classList.remove('hidden')

      const actionResult = (result) => {
        if (result.status !== 200) {
          setTextAlert(result.message)
          getId('modalAlert').showModal()
        } else {
          getId('closeBtn').click()
        }
      }
      
      // create
      if (!id && className) {
        const result = await CreateClass({ class_name: className })
        actionResult(result)
      }

      // update
      if (id && className) {
        const result = await UpdateClass({
          id: id,
          class_name: className
        })
        actionResult(result)
      }

      setTimeout(() => { getAllData() }, 100)
    } catch (error) {}
  }

  const deleteData = async () => {
    try {
      getId('closeBtnConfirm').click()
      const result = await DeleteClass(id)
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


  useEffect(() => {
    getStudyYearById()
    getAllData()
  }, [])


  return (
    <>
      <Sidebar/>
      <Main>
        <Navbar page={`rapor / tahun ajar / ${studyYearName} / kelas`} pageTitle='kelas' />
        <Container>

          <div className='flex justify-end mb-4'>
            <ButtonPrimary text='buat nama kelas baru' icon='fa-plus' onClick={() => openModal()} className='mr-2' />
          </div>

          <div className='grid grid-cols-4'>
            {data.map((data) => (
              <CardFolder key={data.id} text={data.class_name} count={data.count}
                onClick={() => navigate(data.id)}
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
            <BaseInput idError='classNameError' onChange={handleInput} value={className} name='className' />
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

export default ClassName