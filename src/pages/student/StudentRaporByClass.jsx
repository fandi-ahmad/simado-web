import { React, useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import { Container, Main } from '../../components/BaseLayout'
import { useNavigate, useParams } from 'react-router-dom'
import { CardFolder } from '../../components/BaseCard'
import Navbar from '../../components/Navbar'
import { GetAllStudyYear } from '../../api/student/studyYear'
import { GetAllClass } from '../../api/student/class'

const StudentRaporByClass = () => {
  const btnClass = 'btn text-white capitalize bg-gradient-to-tl from-purple-700 to-pink-500 border-0 hover:opacity-85'
  const params = useParams()
  const navigate = useNavigate()
  const idStudyYear = params.id_study_year
  const idClassName =  params.id_class_name
  const [studyYearName, setStudyYearName] = useState('')
  const [className, setClassName] = useState('')

  const getStudyYearById = async () => {
    try {
      const result = await GetAllStudyYear(idStudyYear)
      result.status == 200 ? setStudyYearName(result.data.study_year) : navigate('/rapor/study-year')
    } catch (error) {}
  }

  const getClassById = async () => {
    try {
      const result = await GetAllClass(idClassName)
      result.status == 200 ? setClassName(result.data.class_name) : navigate('/rapor/study-year')
    } catch (error) {}
  }

  useEffect(() => {
    getStudyYearById()
    getClassById()
  }, [])

  return (
    <>
      <Sidebar/>
      <Main>
        <Navbar page={`rapor / tahun ajar / ${studyYearName} / kelas / ${className}`} pageTitle={className} />
        <Container>

          <div className='flex justify-end mb-4'>
            <button className={'mr-2 '+btnClass} >buat rapor siswa baru <i className="fa-solid fa-plus"></i></button>
          </div>

          <div className='grid grid-cols-4'>
            <CardFolder text='XI ipa 1'  />
            <CardFolder text='XI ipa 2' />
            <CardFolder text='XI ipa 3' />
            <CardFolder text='XI ips 1' />
            
          </div>


        </Container>

      </Main>
    </>
  )
}

export default StudentRaporByClass