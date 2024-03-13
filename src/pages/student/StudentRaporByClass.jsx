import { React, useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import { Container, ContainerRow, Main } from '../../components/BaseLayout'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { GetAllStudyYear } from '../../api/student/studyYear'
import { GetAllClass } from '../../api/student/class'
import { GetAllStudentFile } from '../../api/student/studentFile'
import { BaseTable, TableData, TableHead } from '../../components/BaseTable'

const StudentRaporByClass = () => {
  const btnClass = 'btn text-white capitalize bg-gradient-to-tl from-purple-700 to-pink-500 border-0 hover:opacity-85'
  const params = useParams()
  const navigate = useNavigate()
  const idStudyYear = params.id_study_year
  const idClassName =  params.id_class_name
  const [studyYearName, setStudyYearName] = useState('')
  const [className, setClassName] = useState('')
  const [data, setData] = useState([])

  const getAllData = async () => {
    try {
      const result = await GetAllStudentFile(idStudyYear, idClassName)
      setData(result.data)
    } catch (error) {}
  }

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
    getAllData()
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

          <ContainerRow className='-mx-3 relative'>
            {!data[0] ? <div className='w-full text-center text-2xl'>-- belum ada data --</div> : 
              <BaseTable
                thead={<>
                  <TableHead text='No' className='w-12' />
                  <TableHead text='Nama File' />
                  <TableHead text='study year' />
                  <TableHead text='class' />
                  <TableHead text='' />
                  <TableHead />
                  <TableHead />
                </>}

                tbody={<>
                  {data.map((data, index) => (
                    <tr key={data.id}>
                      <TableData text={index+1} />
                      <TableData text={data.file_name} />
                      <TableData text={data.id_study_year} />
                      <TableData text={data.id_class_name} />
                      {/* <TableData text={
                        <>
                          <div className='dropdown dropdown-end mr-4'>
                            <button tabIndex={1} role='button' className='btn btn-sm'>
                              <i className="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                            <ul tabIndex={10} className="dropdown-content z-10 absolute menu p-2 shadow bg-base-100 rounded-md w-52 border border-gray-300 font-medium">
                              <ActionListData icon='fa-download' text='Download' onClick={() => downloadFile(import.meta.env.VITE_API_URL+'/'+data.file)} />
                              <ActionListData icon='fa-eye' text='Lihat' onClick={() => window.open(import.meta.env.VITE_API_URL+'/'+data.file, '_blank')} />
                              <ActionListData icon='fa-circle-info' text='Detail' />
                              <ActionListData icon='fa-pen-to-square' text='Edit' onClick={() => openModal(data)} />
                              <ActionListData icon='fa-up-down-left-right' text='Pindahkan' onClick={() => openModalChangeCategory(data)} />
                              <ActionListData icon='fa-trash-can' text='Hapus' onClick={() => openModalConfirm(data.id)} />
                            </ul>
                          </div>
                        </>
                      } className='w-48' /> */}
                    </tr>
                  ))}

                  
                </>}
              />
            }
          </ContainerRow>


        </Container>

      </Main>
    </>
  )
}

export default StudentRaporByClass