import { React, useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import { Container, ContainerRow, Main } from '../../components/BaseLayout'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { GetAllStudyYear } from '../../api/student/studyYear'
import { GetAllClass } from '../../api/student/class'
import { CreateStudentFile, DeleteStudentFile, GetAllStudentFile, UpdateStudentFile } from '../../api/student/studentFile'
import { ActionListData, BaseTable, TableData, TableHead } from '../../components/BaseTable'
import { ModalAlert, ModalForm } from '../../components/BaseModal'
import { downloadFile, getId } from '../../function/baseFunction'
import { InputColumn, SearchInput } from '../../components/BaseInput'
import { GetAllStudent } from '../../api/student/student'
import { useGlobalState } from '../../state/state'
import { ButtonPrimary } from '../../components/BaseButton'
import { BaseDropdownUl, DropdownListData } from '../../components/Dropdown'

const StudentRaporByClass = () => {
  const params = useParams()
  const navigate = useNavigate()
  const idStudyYear = params.id_study_year
  const idClassName = params.id_class_name
  const [studyYearName, setStudyYearName] = useState('')
  const [className, setClassName] = useState('')
  const [data, setData] = useState([])
  const [dataStudent, setDataStudent] = useState([])


  const [textInfo, setTextInfo] = useState('')
  const [textBtnAction, setTextBtnAction] = useState('buat')
  const [textFileInput, setTextFileInput] = useState('Upload file')
  const [isRequired, setIsRequired] = useState(true)

  const [id, setId] = useState('')
  const [fileUpload, setFileUpload] = useState('')
  const [fileName, setFileName] = useState('')
  const [semester, setSemester] = useState('1')
  const [idStudent, setIdStudent] = useState('')

  const [elementFound, setElementFound] = useState(false)
  const [searchTerm, setSearchTerm] = useGlobalState('searchTerm')

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [orderName, setOrderName] = useState('updatedAt')
  const [orderValue, setOrderValue] = useState('DESC')

  const getAllData = async () => {
    try {
      const result = await GetAllStudentFile(idStudyYear, idClassName, semester, page, limit, orderName, orderValue)
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

  const getAllDataStudent = async () => {
    try {
      const result = await GetAllStudent()
      setDataStudent(result.data)
    } catch (error) {}
  }


  const handleInputFile = (e) => {
    const fileSelect = e.target.files[0]
    setFileUpload(fileSelect)

    let fileName = fileSelect.name.split('.')
    let firstPart = fileName[0]

    setFileName(firstPart)
  };

  const cleanUpFormInput = () => {
    setFileUpload('')
    setIdStudent('')
    setId('')
    getId('fileUpload').value = ''
    setSearchTerm('')
    getId('fileUploadError').classList.add('hidden')
    getId('studentListError').classList.add('hidden')
  }

  const openModal = (dataParams = '') => {
    getId('modalForm').showModal()
    cleanUpFormInput()

    if (dataParams.id) {
      // for edit
      setTextBtnAction('simpan')
      setTextInfo('Edit rapor siswa')
      setTextFileInput('Upload file baru')

      setId(dataParams.id)
      setIdStudent(dataParams.id_student)
      setSearchTerm(`${dataParams.nisn} - ${dataParams.student_name}`)
      
    } else {
      // for create new
      setTextBtnAction('buat')
      setTextInfo('Buat rapor siswa')
      setTextFileInput('Upload file')
    }
  }

  const openModalConfirm = (idSelected) => {
    setId(idSelected)
    getId('modalConfirm').showModal()
  }

  const createOrUpdateData = async () => {
    if (!id && fileUpload == '') getId('fileUploadError').classList.remove('hidden')
    if (idStudent == '') getId('studentListError').classList.remove('hidden')

    const formData = new FormData();
    formData.append('id_student', idStudent)
    formData.append('id_study_year', idStudyYear)
    formData.append('id_class_name', idClassName)
    formData.append('category', 'rapor')
    formData.append('semester', semester)
    formData.append('file_name', fileName)
    formData.append('file_upload', fileUpload)

    // create
    if (!id && fileUpload && idStudent) {
      getId('closeBtn').click()
      await CreateStudentFile(formData)
    }

    // update
    if (id && idStudent) {
      formData.append('id', id)
      getId('closeBtn').click()
      await UpdateStudentFile(formData)
    }

    getAllData()
  }

  const deleteData = async () => {
    try {
      getId('closeBtnConfirm').click()
      const result = await DeleteStudentFile(id)
      if (result.status !== 200) {
        setTextAlert('Terjadi kesalahan!')
        getId('modalAlert').showModal()
      }
      getAllData()
    } catch (error) {
      setTextAlert('Terjadi kesalahan!')
      getId('modalAlert').showModal()
    }
  }


  const dataStudentFileInTable = () => {
    return (
      <>
        {!data[0] ? <div className='w-full text-center text-xl pb-6'>-- Belum ada data --</div> : 
          <BaseTable
            thead={<>
              <TableHead text='No' className='w-12' />
              <TableHead text='NISN' />
              <TableHead text='Nama siswa' />
              <TableHead />
              <TableHead />
              <TableHead />
            </>}

            tbody={<>
              {data.map((data, index) => (
                <tr key={data.id}>
                  <TableData text={index+1} />
                  <TableData text={data.nisn} />
                  <TableData text={data.student_name} />
                  <TableData text={data.file || data.file_name 
                    ? <i className="fa-solid fa-file-circle-check text-lg text-green-400"></i> 
                    : <i className="fa-solid fa-file-circle-xmark text-lg text-red-400"></i>} 
                  />
                  <TableData className='w-full' />
                  <TableData text={
                    <BaseDropdownUl icon='fa-ellipsis-vertical'>
                      <DropdownListData icon='fa-download' text='Download' onClick={() => downloadFile(import.meta.env.VITE_API_URL+'/'+data.file)} />
                      <DropdownListData icon='fa-eye' text='Lihat' onClick={() => window.open(import.meta.env.VITE_API_URL+'/'+data.file, '_blank')} />
                      <DropdownListData icon='fa-circle-info' text='Detail' />
                      <DropdownListData icon='fa-pen-to-square' text='Edit' onClick={() => openModal(data)} />
                      <DropdownListData icon='fa-trash-can' text='Hapus' onClick={() => openModalConfirm(data.id)} />
                    </BaseDropdownUl>
                  } className='w-48' />
                </tr>
              ))}
              
            </>}
          />
        }
      </>
    )
  }


  useEffect(() => {
    getStudyYearById()
    getClassById()
    getAllDataStudent()
  }, [])
  

  useEffect(() => {
    getAllData()
  }, [semester])

  useEffect(() => {
    const getIdSemester = () => {
      const element = getId('1');
      if (element) {
        element.click();
        setElementFound(true);
      }
    };

    getIdSemester();

    // Jika elemen belum ditemukan, lakukan polling setiap interval
    const interval = setInterval(() => {
      if (!elementFound) {
        getIdSemester();
      } else {
        // Hentikan polling jika elemen sudah ditemukan
        clearInterval(interval);
      }
    }, 100); // Ganti interval sesuai kebutuhan

    // Hentikan polling ketika komponen di-unmount
    return () => clearInterval(interval);

    
  }, [elementFound])


  const handleSelectItem = (itemId) => {
    setIdStudent(itemId)
  };

  return (
    <>
      <Sidebar/>
      <Main>
        <Navbar page={`rapor / tahun ajar / ${studyYearName} / kelas / ${className}`} pageTitle={className} />
        <Container>

          <div className='flex justify-end mb-4'>
            <ButtonPrimary text='buat rapor siswa' icon='fa-plus' onClick={() => openModal()} />
          </div>

          <ContainerRow className='-mx-3 relative'>
            <div role="tablist" className="tabs tabs-lifted w-full">
              <input type="radio" name="semester" id='1' onChange={(e) => setSemester(e.target.id)} role="tab" className="tab" aria-label='Semester 1' />
              <div role="tabpanel" className="tab-content bg-white border-base-300 rounded-box pt-6 w-full">
                {dataStudentFileInTable()}
              </div>
            
              <input type="radio" name="semester" id='2' onChange={(e) => setSemester(e.target.id)} role="tab" className="tab" aria-label="Semester 2" />
              <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box pt-6 w-full">
                {dataStudentFileInTable()}
              </div>
            </div>
          </ContainerRow>

        </Container>
      </Main>

      {/* modal for form input */}
      <ModalForm
        id='modalForm'
        full={true}
        fill={<>
          <h3 className="font-bold text-lg capitalize">{textInfo}</h3>

          <div>
            <InputColumn idError='fileUploadError' text={textFileInput} type='file' onChange={handleInputFile} name='file_upload' id='fileUpload' />

            <div className='mb-2 flex justify-between w-full'>
              <p className="pt-4 mb-2 mr-2">NISN / Nama siswa</p>
              <SearchInput data={dataStudent} onSelect={handleSelectItem} idError='studentListError' />
            </div>
            
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

    </>
  )
}

export default StudentRaporByClass