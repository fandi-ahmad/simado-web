import { React, useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import { Container, ContainerRow, Main } from '../../components/BaseLayout'
import Navbar from '../../components/Navbar'
import { CreateStudent, DeleteStudent, GetAllStudent, UpdateStudent } from '../../api/student/student'
import { BaseTable, TableData, TableHead } from '../../components/BaseTable'
import { ModalAlert, ModalForm } from '../../components/BaseModal'
import { formatDateAndTime, getId } from '../../function/baseFunction'
import { BaseInput, InputColumn } from '../../components/BaseInput'
import { BaseButton, ButtonPrimary, ButtonDropdown } from '../../components/BaseButton'
import { BaseDropdownUl, DropdownListData } from '../../components/Dropdown'
import { GetAllEntryYear, CreateEntryYear, DeleteEntryYear, UpdateEntryYear} from '../../api/student/entryYear'
import { useNavigate, useParams } from 'react-router-dom'

const Student = () => {
  const params = useParams()
  const navigate = useNavigate()
  const idEntryYearFromParam = params.id_entry_year
  const [data, setData] = useState([])
  const [textInfo, setTextInfo] = useState('')
  const [textBtnAction, setTextBtnAction] = useState('buat')
  const [textAlert, setTextAlert] = useState('')
  const [nisn, setNisn] = useState('')
  const [studentName, setStudentName] = useState('')
  const [year, setYear] = useState('')
  const [id, setId] = useState('')

  const [fileUpload, setFileUpload] = useState('')
  const [textFileInput, setTextFileInput] = useState('')

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [orderName, setOrderName] = useState('updatedAt')
  const [orderValue, setOrderValue] = useState('DESC')
  const [search, setSearch] = useState('')

  const [totalPage, setTotalPage] = useState(1)
  const [isBtnPrevious, setIsBtnPrevious] = useState()
  const [isBtnNext, setIsBtnNext] = useState()

  const [dataEntryYear, setDataEntryYear] = useState([])
  const [entryYear, setEntryYear] = useState('')                      // use for create/update 
  const [idEntryYear, setIdEntryYear] = useState('')                  // use for update/delete
  const [idEntryYearSelected, setIdEntryYearSelected] = useState('')  // use for create/update student

  const checkPaginationBtn = () => {
    page == 1 ? setIsBtnPrevious(true) : setIsBtnPrevious(false)
    page >= totalPage ? setIsBtnNext(true) : setIsBtnNext(false)
  }

  const getAllDataEntryYear = async () => {
    try {
      const result = await GetAllEntryYear()
      if (result.data) setDataEntryYear(result.data)
    } catch (error) {}
  }

  const getAllData = async () => {
    try {
      const result = await GetAllStudent(page, limit, orderName, orderValue, search, idEntryYearFromParam)
      if (result.data) {
        setData(result.data)
        setTotalPage(result.total_page)
      }
    } catch (error) {}
  }
  
  const handleInput = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'nisn': setNisn(value); break;
      case 'studentName': setStudentName(value); break;
      case 'entryYear': if (/^[0-9]*$/.test(value) && value.length <= 4) setEntryYear(value); break;
      case 'search': setSearch(value); break;
      default: break;
    }
  };

  const handleInputFile = (e) => {
    const fileSelect = e.target.files[0]
    setFileUpload(fileSelect)
  };

  const cleanUpFormInput = () => {
    setId('')
    setNisn('')
    setStudentName('')
    setYear('')
    setIdEntryYear('')
    setEntryYear('')
    setFileUpload('')
    setTextFileInput('')
    getId('fileUpload').value = ''
    getId('nisnError').classList.add('hidden')
    getId('studentNameError').classList.add('hidden')
    getId('entryYearError').classList.add('hidden')
  }  

  const openModal = (dataParams = '') => {
    if (!dataEntryYear[0]) {
      setTextAlert('Buat tahun masuk terlebih dahulu!')
      getId('modalAlert').showModal()
    } else {
      getId('modalForm').showModal()
      cleanUpFormInput()

      // get year from array dataEntryYear by id param
      const entryYear = dataEntryYear.find(entry => entry.id === idEntryYearFromParam);
      setYear(entryYear ? entryYear.year : null)
  
      if (dataParams.id) {
        // for edit
        setTextBtnAction('simpan')
        setTextInfo('Edit data siswa')
        setTextFileInput('Perbarui ijazah siswa')
  
        setId(dataParams.id)
        setNisn(dataParams.nisn)
        setStudentName(dataParams.name)
      } else {
        // for create new
        setTextBtnAction('buat')
        setTextInfo('Buat data siswa baru')
        setTextFileInput('Upload ijazah siswa')
      }
    }

  }

  const openModalConfirm = (idSelected, isIdStudent = false) => {
    isIdStudent ? setId(idSelected) : setIdEntryYear(idSelected)
    getId('modalConfirm').showModal()
  }

  const validateResult = (result) => {
    if (result.status != 200) {
      setTextAlert(result.message)
      getId('modalAlert').showModal()
    } else {
      getId('closeBtn').click()
    }
  }

  const createOrUpdateData = async () => {
    try {
      if (nisn == '') getId('nisnError').classList.remove('hidden')
      if (studentName == '') getId('studentNameError').classList.remove('hidden')

      const formData = new FormData();
      formData.append('nisn', nisn)
      formData.append('name', studentName)
      formData.append('id_entry_year', idEntryYearFromParam)
      formData.append('file_upload', fileUpload)

      // create
      if (!id && nisn && studentName) {
        const result = await CreateStudent(formData)
        validateResult(result)
      }

      // update
      if (id && nisn && studentName) {
        formData.append('id', id)
        const result = await UpdateStudent(formData)
        validateResult(result)
      }
      
      setTimeout(() => { getAllData() }, 100)
    } catch (error) {}
  }

  const deleteData = async () => {
    try {
      getId('closeBtnConfirm').click()

      // delete student
      if (id) {
        const result = await DeleteStudent(id)
        if (result.status !== 200) {
          setTextAlert(result.message)
          getId('modalAlert').showModal()
        }
      }

      // delete entry year
      if (idEntryYear) {
        const result = await DeleteEntryYear(idEntryYear)
        if (result.status !== 200) {
          setTextAlert(result.message)
          getId('modalAlert').showModal()
        }
      }
      
      getAllData()
      getAllDataEntryYear()
    } catch (error) {
      setTextAlert('Terjadi kesalahan!')
      getId('modalAlert').showModal()
    }
  }

  const shortData = (order, value) => {
    setOrderName(order)
    setOrderValue(value)
  }

  useEffect(() => {
    checkPaginationBtn()
  }, [page, totalPage])

  useEffect(() => {
    setPage(1)
  }, [limit])

  useEffect(() => {
    getAllData()
  }, [page, limit, orderName, orderValue, search, idEntryYearFromParam])

  const openModalEntryYear = (dataParams = '') => {
    getId('modalFormEntryYear').showModal()
    cleanUpFormInput()

    if (dataParams.id) {
      // for edit
      setTextBtnAction('simpan')
      setTextInfo('Edit tahun masuk')

      setIdEntryYear(dataParams.id)
      setEntryYear(dataParams.year)
    } else {
      // for create new
      setTextBtnAction('buat')
      setTextInfo('Buat tahun masuk')
    }
  }

  const createOrUpdateEntryYear = async () => {
    try {
      if (entryYear == '') getId('entryYearError').classList.remove('hidden')

      if (entryYear.length !== 4) {
        
        setTextAlert('Jumlah karakter minimal 4')
        getId('modalAlert').showModal()
      } else {

        // create
        if (!idEntryYear && entryYear) {
          getId('closeBtnEntryYear').click()
          await CreateEntryYear({
            year: entryYear
          })
        }
  
        // update
        if (idEntryYear && entryYear) {
          getId('closeBtnEntryYear').click()
           await UpdateEntryYear({
            id: idEntryYear,
            year: entryYear
          })
        }

      }
    

      setTimeout(() => { getAllDataEntryYear() }, 100)
    } catch (error) {}
  }

  useEffect(() => {
    getAllDataEntryYear()
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
            <ButtonPrimary text='buat data siswa baru' icon='fa-plus' onClick={() => openModal()} />
          </div>
          
          <ContainerRow className='-mx-3 relative'>
            <span className='ml-3'>Tahun masuk siswa:</span>
            <div className='mx-3 pb-2 w-full grid' style={{gridTemplateColumns: 'repeat(14, minmax(0, 1fr))'}}>
              
              { dataEntryYear[0] ? dataEntryYear.map((data) => (
                <ButtonDropdown key={data.id} text={data.year}
                  className={`mr-2 ${idEntryYearFromParam == data.id ? 'bg-gray-400' : 'bg-white'}`}
                  textClassName={idEntryYearFromParam == data.id ? 'text-white' : null}
                  onClick={() => navigate('/data/student/'+data.id)}
                >
                  <DropdownListData icon='fa-pen-to-square' text='Edit' onClick={() => openModalEntryYear(data)} />
                  <DropdownListData icon='fa-trash-can' text='Hapus' onClick={() => openModalConfirm(data.id)} />
                </ButtonDropdown>
              )) : null }

              <BaseButton
                onClick={() => openModalEntryYear()}
                tooltip='Buat tahun masuk' 
                text={<i className="fa-solid fa-plus"></i>} 
                className='btn-sm mr-2 mt-2' 
                bgClassName='bg-white hover:bg-gray-200'
              />

            </div>
            { !idEntryYearFromParam ? <span className='text-center text-xl w-full'>Pilih tahun masuk terlebih dahulu!</span> : 
              <BaseTable className='pb-8'
                filter={<div className='flex flex-row justify-between'>
                  <div>
                    <BaseDropdownUl text='Tampilkan:' btnText={limit} btnClassName='bg-gray-300 mr-4' className='w-20'>
                      <DropdownListData text='10' onClick={() => setLimit(10)} />
                      <DropdownListData text='25' onClick={() => setLimit(25)} />
                      <DropdownListData text='50' onClick={() => setLimit(50)} />
                      <DropdownListData text='100' onClick={() => setLimit(100)} />
                    </BaseDropdownUl>

                    <BaseDropdownUl text='Urutkan:' icon='fa-arrow-down-wide-short' btnClassName='bg-gray-300'>
                      <DropdownListData icon={orderName == 'name' && orderValue == 'ASC'  ? 'fa-caret-right' : '-'} text='Nama a - z' onClick={() => shortData('name', 'ASC')} />
                      <DropdownListData icon={orderName == 'name' && orderValue == 'DESC' ? 'fa-caret-right' : '-'} text='Nama z - a' onClick={() => shortData('name', 'DESC')} />
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
                  <TableHead text='Nama Siswa' />
                  <TableHead text='Diperbarui pada' />
                  <TableHead text='file ijazah' />
                  <TableHead />
                  <TableHead />
                </>}

                tbody={<>
                  { data[0] ? data.map((data, index) => (
                    <tr key={data.id}>
                      <TableData text={index+1} />
                      <TableData text={data.nisn} />
                      <TableData text={data.name} className='capitalize' />
                      <TableData text={formatDateAndTime(data.updatedAt)} className='pr-8' />
                      <TableData text={data.ijazah_file
                        ? <i className="fa-solid fa-file-circle-check text-lg text-green-400"></i> 
                        : <i className="fa-solid fa-file-circle-xmark text-lg text-red-400"></i>} 
                      />

                      <TableData className='w-full' />
                      <TableData text={
                        <BaseDropdownUl icon='fa-ellipsis-vertical'>
                          <DropdownListData icon='fa-pen-to-square' text='Edit' onClick={() => openModal(data)} />
                          <DropdownListData icon='fa-trash-can' text='Hapus' onClick={() => openModalConfirm(data.id, true)} />
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
            }
          </ContainerRow>

        </Container>
      </Main>

      {/* modal form for input entry year */}
      <ModalForm
        id='modalFormEntryYear'
        fill={<>
          <h3 className="font-bold text-lg capitalize">{textInfo}</h3>
          <BaseInput idError='entryYearError' name='entryYear' value={entryYear} onChange={handleInput} required />
        </>}

        idCloseBtn='closeBtnEntryYear'
        addButton={<ButtonPrimary text={textBtnAction} onClick={createOrUpdateEntryYear} />}
      />

      {/* modal form for input */}
      <ModalForm
        full={true}
        fill={<>
          <h3 className="font-bold text-lg capitalize">{textInfo}</h3>
          <InputColumn idError='nisnError' text='NISN' name='nisn' onChange={handleInput} value={nisn} required />
          <InputColumn idError='studentNameError' text='Nama siswa' name='studentName' onChange={handleInput} value={studentName} required />
          <div className='flex justify-between'>
            <p>Tahun masuk siswa</p>
            <p className='w-96 font-semibold'>{year}</p>
          </div>
          <InputColumn idError='fileUploadError' text={textFileInput} type='file' onChange={handleInputFile} name='file_upload' id='fileUpload' />
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

export default Student