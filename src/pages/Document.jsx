import { React, useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { BaseTable, TableHead, TableData, ListDataForDetail } from '../components/BaseTable'
import { Main, Container, ContainerRow } from '../components/BaseLayout'
import { GetAllFile, CreateFile, DeleteFile, UpdateFile, GetAllFileByCategory } from '../api/file'
import { downloadFile, getId, limitText, formatDateAndTime } from '../function/baseFunction'
import { ModalAlert, ModalForm } from '../components/BaseModal'
import { BaseInput, InputColumn, SelectInput } from '../components/BaseInput'
import { BadgeFormatFile } from '../components/Badge'
import { GetAllCategory } from '../api/category'
import { BaseDropdownUl, DropdownListData } from '../components/Dropdown'
import { BaseButton, ButtonPrimary } from '../components/BaseButton'


const Document = () => {
  const [data, setData] = useState([])
  const [dataCategory, setDataCategory] = useState([])
  const [id, setId] = useState('')
  const [textInfo, setTextInfo] = useState('')
  const [textAlert, setTextAlert] = useState('')
  const [textFileInput, setTextFileInput] = useState('upload file')
  const [textBtnAction, setTextBtnAction] = useState('Buat')
  const [isRequired, setIsRequired] = useState(false)
  const [fileUpload, setFileUpload] = useState('')
  const [fileName, setFileName] = useState('')
  const [number, setNumber] = useState('')
  const [source, setSource] = useState('')
  const [format, setFormat] = useState('')
  const [idCategory, setIdCategory] = useState('')
  const [categoryName, setCategoryName] = useState('')
  
  const params = useParams()
  const navigate = useNavigate()
  const [createdAt, setCreatedAt] = useState('')
  const [updatedAt, setUpdatedAt] = useState('')

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [orderName, setOrderName] = useState('updatedAt')
  const [orderValue, setOrderValue] = useState('DESC')
  const [search, setSearch] = useState('')
  
  const [totalPage, setTotalPage] = useState(1)
  const [isBtnPrevious, setIsBtnPrevious] = useState()
  const [isBtnNext, setIsBtnNext] = useState()


  const checkPaginationBtn = () => {
    page == 1 ? setIsBtnPrevious(true) : setIsBtnPrevious(false)
    page >= totalPage ? setIsBtnNext(true) : setIsBtnNext(false)
  }

  const getAllData = async () => {
    try {
      const result = params.id ? await GetAllFileByCategory(params.id, page, limit, orderName, orderValue, search) : await GetAllFile(page, limit, orderName, orderValue, search);
      if (result.data) {
        setData(result.data)
        setCategoryName(result.category);

        setTotalPage(result.total_page)
      }

      if (result.status == 404) navigate('/document')
      if (params.id) setIdCategory(params.id)
    } catch (error) {}
  }

  const cleanUpFormInput = () => {
    setId('')
    setFileUpload('')
    setFileName('')
    setNumber('')
    setSource('')
    setFormat('')
    getId('fileUpload').value = ''
    getId('fileUploadError').classList.add('hidden')
    getId('fileNameError').classList.add('hidden')
  }

  const handleInput = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'file_name': setFileName(value); break;
      case 'source': setSource(value); break;
      case 'number': setNumber(value); break;
      case 'category': setIdCategory(value); break;
      case 'search': setSearch(value); break;
      default: break;
    }
  };

  const handleInputFile = (e) => {
    const imageSelect = e.target.files[0]
    setFileUpload(imageSelect)

    let fileName = imageSelect.name.split('.')
    let firstPart = fileName[0]
    let fileFormat = fileName.pop();

    setFileName(firstPart)
    setFormat(fileFormat)
  };

  const selectedDataFile = (dataParams) => {
    setId(dataParams.id)
    setFileName(dataParams.file_name)
    setNumber(dataParams.number)
    setSource(dataParams.source)
    setFormat(dataParams.format)
    setIdCategory(dataParams.id_category)
    setCategoryName(dataParams.category_name)
  }

  const openModal = (dataParams = '') => {
    setId(dataParams.id)
    cleanUpFormInput()

    if (dataParams.id) {
      // for edit
      setTextInfo('edit file')
      setTextFileInput('upload file baru')
      setIsRequired(false)
      setTextBtnAction('Simpan')

      selectedDataFile(dataParams)
    } else {
      // for create new
      setTextInfo('buat file baru')
      setTextFileInput('upload file')
      setIsRequired(true)
      setTextBtnAction('Buat')
    }

    getId('modalForm').showModal()
  }

  const openModalConfirm = (idSelected) => {
    setId(idSelected)
    getId('modalConfirm').showModal()
  }

  const openModalDetail = (dataParams) => {
    getId('modalDetailData').showModal()
    setCreatedAt(dataParams.createdAt)
    setUpdatedAt(dataParams.updatedAt)
    setFileName(dataParams.file_name)
    setNumber(dataParams.number)
    setSource(dataParams.source)
  }

  const createOrUpdateData = async () => {
    try {
      if (fileName == '') getId('fileNameError').classList.remove('hidden')
      if (!id && fileUpload == '') getId('fileUploadError').classList.remove('hidden')
      
      const formData = new FormData();
      formData.append('id_category', idCategory)
      formData.append('file_name', fileName)
      formData.append('number', number)
      formData.append('source', source)
      formData.append('format', format)
      formData.append('file_upload', fileUpload)

      if (!idCategory || idCategory == '-') {
        // cek kondisi saat pindahkan kategori
        setTextAlert('Pilih kategori terlebih dahulu!')
        getId('modalAlert').showModal()
      } else {

        // create
        if (!id && fileName && fileUpload) {
          getId('closeBtn').click()
          await CreateFile(formData)
        }
  
        // update
        if (id && fileName) {
          formData.append('id', id)
          getId('closeBtn').click()
          getId('closeBtnChangeCategory').click()
          await UpdateFile(formData)
        }

      }

      
      setTimeout(() => { getAllData() }, 100)
    } catch (error) {
      console.log(error, '<-- error create or update data');
    }
  }

  const deleteData = async () => {
    try {
      getId('closeBtnConfirm').click()
      await DeleteFile(id)
      getAllData()
    } catch (error) {
      setTextAlert('Terjadi kesalahan!')
      getId('modalAlert').showModal()
    }
  }

  const getDataCategory = async () => {
    try {
      const result = await GetAllCategory()
      setDataCategory(result.data)
    } catch (error) {}
  }

  const openModalChangeCategory = (dataParams) => {
    selectedDataFile(dataParams)
    getId('modalFormChangeCategory').showModal()
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
    getDataCategory()
  }, [])

  useEffect(() => {
    getAllData()
  }, [params.id, page, limit, orderName, orderValue, search])

  return (
    <>
      <Sidebar/>
      <Main>
        <Navbar 
          page={params.id ? 'dokumen / '+categoryName : 'dokumen'}
          pageTitle={params.id ? categoryName : 'dokumen'}
        />

        <Container>

          {params.id ?
            <div className='flex justify-end mb-4'>
              <ButtonPrimary text='Buat file baru' icon='fa-plus' onClick={() => openModal()} />
            </div> : null
          }
          
          <ContainerRow className='-mx-3 relative'>
            <BaseTable className='pb-24'
              filter={<div className='flex flex-row justify-between'>
                <div>
                  <BaseDropdownUl text='Tampilkan:' btnText={limit} btnClassName='bg-gray-300 mr-4' className='w-20'>
                    <DropdownListData text='10' onClick={() => setLimit(10)} />
                    <DropdownListData text='25' onClick={() => setLimit(25)} />
                    <DropdownListData text='50' onClick={() => setLimit(50)} />
                    <DropdownListData text='100' onClick={() => setLimit(100)} />
                  </BaseDropdownUl>

                  <BaseDropdownUl text='Urutkan:' icon='fa-arrow-down-wide-short' btnClassName='bg-gray-300'>
                    <DropdownListData icon={orderName == 'file_name' && orderValue == 'ASC'  ? 'fa-caret-right' : '-'} text='Nama a - z' onClick={() => shortData('file_name', 'ASC')} />
                    <DropdownListData icon={orderName == 'file_name' && orderValue == 'DESC' ? 'fa-caret-right' : '-'} text='Nama z - a' onClick={() => shortData('file_name', 'DESC')} />
                    <DropdownListData icon={orderName == 'updatedAt' && orderValue == 'DESC' ? 'fa-caret-right' : '-'} text='Tanggal terbaru' onClick={() => shortData('updatedAt', 'DESC')} />
                    <DropdownListData icon={orderName == 'updatedAt' && orderValue == 'ASC'  ? 'fa-caret-right' : '-'} text='Tanggal terlama' onClick={() => shortData('updatedAt', 'ASC')} />
                  </BaseDropdownUl>
                </div>

                <BaseInput type='search' name='search' value={search} onChange={handleInput} placeholder='Cari...' />
                
              </div>}

              thead={ !data[0] ? <TableHead text='-- Belum ada data --' className='text-center' /> :
              <>
                <TableHead text='No' className='w-12' />
                <TableHead text='Nama File' />
                <TableHead />
                <TableHead text='Sumber/dari' />
                <TableHead text='Diperbarui pada' />
                <TableHead />
                {!params.id ? <TableHead text='Kategori' className='pr-20' /> : null}
                <TableHead />
              </>}

              tbody={<>
                { data[0] ? data.map((data, index) => (
                  <tr key={data.id}>
                    <TableData text={index+1} />
                    <TableData text={limitText(data.file_name)} />
                    <TableData text={<BadgeFormatFile text={data.format} />} pl='pl-2' />
                    <TableData text={data.source ? limitText(data.source, 20) : '-'} />
                    <TableData text={formatDateAndTime(data.updatedAt)} />
                    <TableData text='' className='w-full' />
                    {!params.id ? <TableData text={data.category_name} /> : null}
                    <TableData text={
                      <BaseDropdownUl icon='fa-ellipsis-vertical'>
                        <DropdownListData icon='fa-download' text='Download' onClick={() => downloadFile(import.meta.env.VITE_API_URL+'/'+data.file)} />
                        <DropdownListData icon='fa-eye' text='Lihat' onClick={() => window.open(import.meta.env.VITE_API_URL+'/'+data.file, '_blank')} />
                        <DropdownListData icon='fa-circle-info' text='Detail' onClick={() => openModalDetail(data)} />
                        <DropdownListData icon='fa-pen-to-square' text='Edit' onClick={() => openModal(data)} />
                        <DropdownListData icon='fa-up-down-left-right' text='Pindahkan' onClick={() => openModalChangeCategory(data)} />
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
          </ContainerRow>

        </Container>
      </Main>

      {/* for detail data selected from table list */}
      <ModalForm
        id='modalDetailData'
        fill={<>
          <table>
            <tbody>
              <ListDataForDetail label='Nama file' value={fileName} />
              <ListDataForDetail label='Nomor' value={number ? number : '-'} />
              <ListDataForDetail label='Sumber' value={source ? source : '-'} />
              <ListDataForDetail label='Diperbarui pada' value={formatDateAndTime(updatedAt)} />
              <ListDataForDetail label='Dibuat pada' value={formatDateAndTime(createdAt)} />
            </tbody>
          </table>
        </>}

        idCloseBtn='closeBtnDetailData'
        onClickCloseBtn={cleanUpFormInput}
      />

      {/* modal for form input change category */}
      <ModalForm
        id='modalFormChangeCategory'
        fill={<>
          <h3 className="font-semibold text-lg capitalize">Pindahkan "{fileName}"</h3>
          <SelectInput text={<>Lokasi saat ini: <span className='font-semibold'>{categoryName}</span></>} id='category' name='category' onChange={handleInput} option={
            dataCategory.map((data) => (
              <option key={data.id} value={data.id}>{data.name}</option>
            ))
          } />
        </>}

        idCloseBtn='closeBtnChangeCategory'
        addButton={<>
          <ButtonPrimary text='Simpan' onClick={createOrUpdateData} />
        </>}
      />

      {/* modal for form input */}
      <ModalForm
        id='modalForm'
        full={true}
        fill={<>
          <h3 className="font-bold text-lg capitalize">{textInfo}</h3>

          <div>
            <InputColumn idError='fileUploadError' text={textFileInput} type='file' onChange={handleInputFile} name='file_upload' id='fileUpload' required={isRequired} />
            <InputColumn idError='fileNameError' className='mt-6' text='nama file' id='file_name' onChange={handleInput} name='file_name' value={fileName} required />
            <InputColumn text='nomor surat' id='number' onChange={handleInput} name='number' value={number} />
            <InputColumn text='sumber/dari' id='source' onChange={handleInput} name='source' value={source} />
          </div>

        </>}

        addButton={<>
          <ButtonPrimary text={textBtnAction} onClick={createOrUpdateData} />
        </>}
      />

      {/* modal confirm */}
      <ModalAlert 
        id='modalConfirm'
        text='Yakin ingin menghapusnya??'
        idCloseBtn='closeBtnConfirm'
        closeText='Batal'
        addButton={<ButtonPrimary text='Ya, hapus' onClick={deleteData} />}
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

export default Document