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

const ClassName = () => {
  const btnClass = 'btn text-white capitalize bg-gradient-to-tl from-purple-700 to-pink-500 border-0 hover:opacity-85'
  const params = useParams()
  const navigate = useNavigate()
  const idStudyYear = params.id_study_year
  const [studyYearName, setStudyYearName] = useState('')
  const [data, setData] = useState([])
  const [id, setId] = useState('')
  const [className, setClassName] = useState('')
  const [textInfo, setTextInfo] = useState('')
  const [textBtnAction, setTextBtnAction] = useState('buat')

  const getStudyYearById = async () => {
    try {
      const result = await GetAllStudyYear(idStudyYear)
      result.status == 200 ? setStudyYearName(result.data.study_year) : navigate('/rapor/study-year')
    } catch (error) {}
  }

  const getAllData = async () => {
    try {
      const result = await GetAllClass()
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
      
      // create
      if (!id && className) {
        await CreateClass({ class_name: className })
      }

      // update
      if (id && className) {
        await UpdateClass({
          id: id,
          class_name: className
        })
      }
      
      getId('closeBtn').click()
      setTimeout(() => { getAllData() }, 100)
    } catch (error) {}
  }

  const deleteData = async () => {
    try {
      getId('closeBtnConfirm').click()
      await DeleteClass(id)
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
            <button className={'mr-2 '+btnClass} onClick={() => openModal()}>buat nama kelas baru <i className="fa-solid fa-plus"></i></button>
          </div>

          <div className='grid grid-cols-4'>
            {data.map((data) => (
              <CardFolder key={data.id} text={data.class_name}
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
    </>
  )
}

export default ClassName