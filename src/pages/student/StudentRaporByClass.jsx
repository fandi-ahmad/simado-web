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
import { downloadFile, formatDateAndTime, getId } from '../../function/baseFunction'
import { BaseInput, InputColumn, SearchInput } from '../../components/BaseInput'
import { GetAllStudent } from '../../api/student/student'
import { useGlobalState } from '../../state/state'
import { BaseButton, ButtonPrimary } from '../../components/BaseButton'
import { BaseDropdownUl, DropdownListData } from '../../components/Dropdown'
import { GetAllEntryYear } from '../../api/student/entryYear'
import { Footer } from '../../components/Footer'

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
  const [studentName, setStudentName] = useState('')

  const [elementFound, setElementFound] = useState(false)
  const [searchTerm, setSearchTerm] = useGlobalState('searchTerm')

  const [search, setSearch] = useState('')

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [orderName, setOrderName] = useState('updatedAt')
  const [orderValue, setOrderValue] = useState('DESC')
  const [searchStudent, setSearchStudent] = useState('')
  const [idEntryYear, setIdEntryYear] = useState('')

  const [dataEntryYear, setDataEntryYear] = useState([])

  const [totalPage, setTotalPage] = useState(1)
  const [isBtnPrevious, setIsBtnPrevious] = useState()
  const [isBtnNext, setIsBtnNext] = useState()

  const getAllData = async () => {
    try {
      const result = await GetAllStudentFile(idStudyYear, idClassName, semester, page, limit, orderName, orderValue, search)
      if (result.data) {
        setData(result.data)
        setTotalPage(result.total_page)
      }
    } catch (error) {}
  }

  const getAllDataEntryYear = async () => {
    try {
      const result = await GetAllEntryYear()
      if (result.data) setDataEntryYear(result.data)
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
      const result = await GetAllStudent(page, limit, 'name', 'ASC', searchStudent, idEntryYear)
      if (result.data) setDataStudent(result.data)
    } catch (error) {}
  }

  const handleInput = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'search': setSearch(value); break;
      default: break;
    }
  };

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

  const shortData = (order, value) => {
    setOrderName(order)
    setOrderValue(value)
  }

  const checkPaginationBtn = () => {
    page == 1 ? setIsBtnPrevious(true) : setIsBtnPrevious(false)
    page >= totalPage ? setIsBtnNext(true) : setIsBtnNext(false)
  }

  useEffect(() => {
    checkPaginationBtn()
  }, [page, totalPage])

  useEffect(() => {
    setPage(1)
  }, [limit])

  const dataStudentFileInTable = () => {
    return (
      <>
        <BaseTable
          filter={<div className='flex flex-row justify-between'>
            <div>
              <BaseDropdownUl text='Tampilkan:' btnText={limit} btnClassName='bg-gray-300 mr-4' className='w-20'>
                <DropdownListData text='10' onClick={() => setLimit(10)} />
                <DropdownListData text='25' onClick={() => setLimit(25)} />
                <DropdownListData text='50' onClick={() => setLimit(50)} />
                <DropdownListData text='100' onClick={() => setLimit(100)} />
              </BaseDropdownUl>

              <BaseDropdownUl text='Urutkan:' icon='fa-arrow-down-wide-short' btnClassName='bg-gray-300'>
                <DropdownListData icon={orderName == 'student_name' && orderValue == 'ASC'  ? 'fa-caret-right' : '-'} text='Nama a - z' onClick={() => shortData('student_name', 'ASC')} />
                <DropdownListData icon={orderName == 'student_name' && orderValue == 'DESC' ? 'fa-caret-right' : '-'} text='Nama z - a' onClick={() => shortData('student_name', 'DESC')} />
                <DropdownListData icon={orderName == 'updatedAt' && orderValue == 'DESC' ? 'fa-caret-right' : '-'} text='Tanggal terbaru' onClick={() => shortData('updatedAt', 'DESC')} />
                <DropdownListData icon={orderName == 'updatedAt' && orderValue == 'ASC'  ? 'fa-caret-right' : '-'} text='Tanggal terlama' onClick={() => shortData('updatedAt', 'ASC')} />
              </BaseDropdownUl>
            </div>

            <BaseInput type='search' placeholder='Cari...' name='search' value={search} onChange={handleInput} />
          
          </div>}

          thead={ !data[0] ? <TableHead text='-- Belum ada data --' className='text-center' /> :
          <>
            <TableHead text='No' className='w-12' />
            <TableHead text='NISN' />
            <TableHead text='Nama siswa' />
            <TableHead text='Diperbarui pada' />
            <TableHead />
            <TableHead />
          </>}

          tbody={<>
            { data[0] ? data.map((data, index) => (
              <tr key={data.id}>
                <TableData text={index+1} />
                <TableData text={data.nisn} />
                <TableData text={data.student_name} />
                <TableData text={formatDateAndTime(data.updatedAt)} />

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
            )) : null}

            <tr>
              <TableData className='text-end' colSpan='10' text={
                <>
                  <BaseButton className='btn-sm' icon='fa-caret-left' onClick={() => setPage(page - 1)} disabled={isBtnPrevious} />
                  <span className='mx-2'>{page}/{totalPage}</span>
                  <BaseButton className='btn-sm' icon='fa-caret-right' onClick={() => setPage(page + 1)} disabled={isBtnNext} />
                </>}
              />
            </tr>
            
          </>}
        />
      </>
    )
  }


  useEffect(() => {
    getStudyYearById()
    getClassById()
    getAllDataEntryYear()
  }, [])

  useEffect(() => {
    getAllDataStudent()
  }, [idEntryYear])

  useEffect(() => {
    getId('studentList').click()
  }, [dataStudent])
  

  useEffect(() => {
    getAllData()
  }, [semester, page, limit, orderName, orderValue, search])


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
            <div role="tablist" className="tabs tabs-lifted w-full pb-28">
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
        <Footer/>
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
              <SearchInput data={dataStudent} onSelect={handleSelectItem} idError='studentListError' id='studentList'
                btnFilter={<>{
                  dataEntryYear[0] ? dataEntryYear.map((data) => (
                    <button key={data.id} onClick={() => setIdEntryYear(data.id)} className={`btn-sm btn mt-1 mr-2 px-1 text-gray-600 ${idEntryYear == data.id ? 'bg-gray-400' : ''}`}>
                      {data.year}
                    </button>
                  )) : null
                }

                <button onClick={() => setIdEntryYear('')} className='btn-sm btn mt-1 mr-2 px-3.5 bg-red-200 hover:bg-red-300 text-gray-600'>
                <i className="fa-solid fa-xmark"></i>
                </button>

                </>}
              />
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