import { React, useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import { Container, Main } from '../../components/BaseLayout'
import Navbar from '../../components/Navbar'
import { CardFolder } from '../../components/BaseCard'
import { useParams, useNavigate } from 'react-router-dom'
import { GetAllStudyYear } from '../../api/student/studyYear'
import { GetAllClass, CreateClass, DeleteClass, UpdateClass } from '../../api/student/class'

const ClassName = () => {
  const btnClass = 'btn text-white capitalize bg-gradient-to-tl from-purple-700 to-pink-500 border-0 hover:opacity-85'
  const params = useParams()
  const navigate = useNavigate()
  const idStudyYear = params.id_study_year
  const [studyYearName, setStudyYearName] = useState('')
  const [data, setData] = useState([])

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
            <button className={'mr-2 '+btnClass} >buat nama kelas baru <i className="fa-solid fa-plus"></i></button>
          </div>

          <div className='grid grid-cols-4'>
            {data.map((data) => (
              <CardFolder key={data.id} text={data.class_name}
                onClick={() => navigate(data.id)}
              />
            ))}
          </div>

        </Container>

      </Main>
    </>
  )
}

export default ClassName