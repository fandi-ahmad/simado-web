import { React, useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { BaseTable, TableHead, TableData, ActionListData, ListDataForDetail } from '../components/BaseTable'
import { Main, Container, ContainerRow } from '../components/BaseLayout'
import { GetAllFile, CreateFile, DeleteFile, UpdateFile, GetAllFileByCategory } from '../api/file'
import { downloadFile, getId, limitText } from '../function/baseFunction'
import { ModalAlert, ModalForm } from '../components/BaseModal'
import { InputColumn, SelectInput } from '../components/BaseInput'
import { BadgeFormatFile } from '../components/Badge'
import { GetAllCategory, CreateCategory, DeleteCategory, UpdateCategory } from '../api/category'


const Document = () => {
  const btnClass = 'btn text-white capitalize bg-gradient-to-tl from-purple-700 to-pink-500 border-0 hover:opacity-85'
  const [data, setData] = useState([])
  const [dataCategory, setDataCategory] = useState([])
  const [id, setId] = useState('')
  const [textInfo, setTextInfo] = useState('')
  const [textAlert, setTextAlert] = useState('')
  const [textFileInput, setTextFileInput] = useState('upload file')
  const [isRequired, setIsRequired] = useState(false)
  const [fileUpload, setFileUpload] = useState('')
  const [fileName, setFileName] = useState('')
  const [number, setNumber] = useState('')
  const [source, setSource] = useState('')
  const [format, setFormat] = useState('')
  const [idCategory, setIdCategory] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const meta = useRef({
    id_user: 'd2321c4d-392e-4625-84df-545a3963a589' //temporary
  })
  const params = useParams()
  const navigate = useNavigate()
  const [createdAt, setCreatedAt] = useState('')
  const [updatedAt, setUpdatedAt] = useState('')


  const getAllData = async () => {
    try {
      const result = params.id ? await GetAllFileByCategory(params.id) : await GetAllFile();
      if (result.data) setData(result.data); setCategoryName(result.category);
      if (result.status == 404) navigate('/document')
      if (params.id) setIdCategory(params.id)
    } catch (error) {}
  }

  const cleanUpFormInput = () => {
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
      getId('btnCreate').classList.add('hidden')
      getId('btnUpdate').classList.remove('hidden')

      selectedDataFile(dataParams)
    } else {
      // for create new
      setTextInfo('buat file baru')
      setTextFileInput('upload file')
      setIsRequired(true)
      getId('btnCreate').classList.remove('hidden')
      getId('btnUpdate').classList.add('hidden')
    }

    // getId('errorMsg').classList.add('hidden')
    getId('modalForm').showModal()
  }

  const openModalConfirm = (idSelected) => {
    setId(idSelected)
    getId('modalConfirm').showModal()
  }

  const openModalDetail = (dataParams) => {
    getId('modalDetailData').showModal()
    console.log(dataParams);
    setCreatedAt(dataParams.createdAt)
    setUpdatedAt(dataParams.updatedAt)
    setFileName(dataParams.file_name)
    setNumber(dataParams.number)
    setSource(dataParams.source)
  }

  const createData = async () => {
    try {

      if (fileName == '') getId('fileNameError').classList.remove('hidden')
      if (fileUpload == '') getId('fileUploadError').classList.remove('hidden')

      if (fileName && fileUpload) {
        const formData = new FormData();
        formData.append('id_user', meta.current.id_user)
        formData.append('id_category', idCategory)
        formData.append('file_name', fileName)
        formData.append('number', number)
        formData.append('source', source)
        formData.append('format', format)
        formData.append('file_upload', fileUpload)
  
        getId('closeBtn').click()
        await CreateFile(formData)
        setTimeout(() => { getAllData() }, 100)
      }
    } catch (error) {
      console.log(error, '<-- error create dokumen');
    }
  }

  const updateData = async () => {
    try {
      if (fileName == '') getId('fileNameError').classList.remove('hidden')

      if (fileName) {
        const formData = new FormData();
        formData.append('id', id)
        formData.append('id_category', idCategory)
        formData.append('file_name', fileName)
        formData.append('number', number)
        formData.append('source', source)
        formData.append('format', format)
        formData.append('file_upload', fileUpload)
        
        getId('closeBtn').click()
        getId('closeBtnChangeCategory').click()
        await UpdateFile(formData)
        setTimeout(() => { getAllData() }, 100)
      }
    } catch (error) {}
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

  useEffect(() => {
    getDataCategory()
  }, [])

  useEffect(() => {
    getAllData()
  }, [params.id])

  return (
    <>
      <Sidebar/>
      <Main>
        <Navbar 
          page={params.id ? 'dokumen / '+categoryName : 'dokumen'}
          pageTitle={params.id ? categoryName : 'dokumen'}
        />

        <Container>

          <div className='flex justify-end mb-4'>
            <button className={btnClass} onClick={()=>openModal()}>buat file baru <i className="fa-solid fa-plus"></i></button>
          </div>
          
          <ContainerRow className='-mx-3 relative'>
            {!data[0] ? <div className='w-full text-center text-2xl'>-- belum ada data --</div> : 
              <BaseTable className='pb-44'
                thead={<>
                  <TableHead text='No' className='w-12' />
                  <TableHead text='Nama File' />
                  <TableHead text='' />
                  <TableHead />
                  {!params.id ? <TableHead text='Kategori' className='pr-20' /> : null}
                  <TableHead />
                </>}

                tbody={<>
                  {data.map((data, index) => (
                    <tr key={data.id}>
                      <TableData text={index+1} />
                      <TableData text={limitText(data.file_name)} />
                      <TableData text={<BadgeFormatFile text={data.format} />} pl='pl-2' />
                      <TableData text='' className='w-full' />
                      {!params.id ? <TableData text={data.category_name} /> : null}
                      <TableData text={
                        <>
                          <div className='dropdown dropdown-end mr-4'>
                            <button tabIndex={1} role='button' className='btn btn-sm'>
                              <i className="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                            <ul tabIndex={10} className="dropdown-content z-10 absolute menu p-2 shadow bg-base-100 rounded-md w-52 border border-gray-300 font-medium">
                              <ActionListData icon='fa-download' text='Download' onClick={() => downloadFile(import.meta.env.VITE_API_URL+'/'+data.file)} />
                              <ActionListData icon='fa-eye' text='Lihat' onClick={() => window.open(import.meta.env.VITE_API_URL+'/'+data.file, '_blank')} />
                              <ActionListData icon='fa-circle-info' text='Detail' onClick={() => openModalDetail(data)} />
                              <ActionListData icon='fa-pen-to-square' text='Edit' onClick={() => openModal(data)} />
                              <ActionListData icon='fa-up-down-left-right' text='Pindahkan' onClick={() => openModalChangeCategory(data)} />
                              <ActionListData icon='fa-trash-can' text='Hapus' onClick={() => openModalConfirm(data.id)} />
                            </ul>
                          </div>
                        </>
                      } className='w-48' />
                    </tr>
                  ))}

                  
                </>}
              />
            }
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
              <ListDataForDetail label='Diperbarui pada' value={updatedAt} />
              <ListDataForDetail label='Dibuat pada' value={createdAt} />
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
          <SelectInput text={'lokasi saat ini: '+ categoryName} id='category' name='category' onChange={handleInput} option={
            dataCategory.map((data) => (
              <option key={data.id} value={data.id}>{data.name}</option>
            ))
          } />
        </>}

        idCloseBtn='closeBtnChangeCategory'
        addButton={<>
          <button className={"btn "+btnClass} onClick={updateData}>simpan</button>
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
          <button className={"btn hidden "+btnClass} id='btnCreate' onClick={createData}>buat</button>
          <button className={"btn hidden "+btnClass} id='btnUpdate' onClick={updateData}>simpan</button>
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