import { React, useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { BaseTable, TableHead, TableData } from '../components/BaseTable'
import { Main, Container, ContainerRow } from '../components/BaseLayout'
import { GetAllFile, CreateFile, DeleteFile, UpdateFile, GetAllFileByCategory } from '../api/file'
import { downloadFile, getId, limitText } from '../function/baseFunction'
import { ModalAlert, ModalForm } from '../components/BaseModal'
import { InputColumn } from '../components/BaseInput'
import { ContainerWhiteCard } from '../components/BaseCard'
import { BadgeFormatFile } from '../components/Badge'


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

  const meta = useRef({
    id: '',
    file_name: '',
    file_upload: '',
    number: '',
    source: '',
    year: '',
    format: '',
    id_category: '',
    id_user: 'acf821a5-1f1a-4869-a3b9-6e7ab5cf176b' //temporary
  })
  const [imgSrc, setImgSrc] = useState('')
  const params = useParams()
  const navigate = useNavigate()


  const getAllData = async () => {
    try {
      const result = params.id ? await GetAllFileByCategory(params.id) : await GetAllFile();
      if (result.data) setData(result.data);
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


  const openModal = (dataParams = '') => {
    setId(dataParams.id)

    if (dataParams.id) {
      // for edit
      setTextInfo('edit file')
      setTextFileInput('upload file baru')
      setIsRequired(false)
      getId('btnCreate').classList.add('hidden')
      getId('btnUpdate').classList.remove('hidden')

      setId(dataParams.id)
      setFileName(dataParams.file_name)
      setNumber(dataParams.number)
      setSource(dataParams.source)
      setFormat(dataParams.format)
      setIdCategory(dataParams.id_category)

      setImgSrc('http://localhost:8000/'+dataParams.file)

    } else {
      // for create new
      setTextInfo('buat file baru')
      setTextFileInput('upload file')
      setIsRequired(true)
      getId('btnCreate').classList.remove('hidden')
      getId('btnUpdate').classList.add('hidden')
      cleanUpFormInput()
    }

    // getId('errorMsg').classList.add('hidden')
    getId('modalForm').showModal()
  }

  const cekData = () => {
    console.log({source, number, format, idCategory});
  }

  const openModalConfirm = (idSelected) => {
    setId(idSelected)
    getId('modalConfirm').showModal()
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


  useEffect(() => {
    getAllData()
  }, [params.id])


  const badge = (text) => {

    let badgeClass = 'bg-gray-400'

    if (text == 'pdf') {
      badgeClass = 'bg-red-400'
    } else if (text == 'docx') {
      badgeClass = 'bg-blue-400'
    } else if (text == 'xls' || text == 'xlsx' || text == 'csv') {
      badgeClass = 'bg-green-500'
    } else if (text == 'jpg' || text ==  'png' || text == 'jpeg') {
      badgeClass = 'bg-yellow-500'
    } else {
      badgeClass = 'bg-gray-500'
    }

    return <div className={`badge ${badgeClass} font-thin text-white pb-1`}>{text}</div>
  }

  return (
    <>
      <Sidebar/>
      <Main>
        <Navbar page='Dokumen' />
        <Container>

          <div className='flex justify-end mb-4'>
            <button className={btnClass} onClick={()=>openModal()}>buat file baru <i className="fa-solid fa-plus"></i></button>
          </div>
          
          <ContainerRow className='-mx-3'>
            <BaseTable
              thead={<>
                <TableHead text='No' className='w-12' />
                <TableHead text='Nama File' />
                <TableHead text='' />
                <TableHead text='Kategori' />
                <TableHead />
              </>}

              tbody={<>
                {data.map((data, index) => (
                  <tr key={data.id}>
                    <TableData text={index+1} />
                    <TableData text={limitText(data.file_name)} />
                    <TableData text={<BadgeFormatFile text={data.format} />} pl='pl-2' />
                    <TableData text={data.category_name} />
                    <TableData text='' className='w-full' />
                    <TableData text={
                      <>
                        <button className={'btn btn-sm btn-success text-white ms-4'} onClick={() => downloadFile('http://localhost:8000/'+data.file)}>Download</button>
                        <button className={'btn btn-sm btn-info text-white ms-4'} onClick={() => openModal(data)}>Lihat</button>
                        <button className={'btn btn-sm btn-primary ms-4'} onClick={() => openModal(data)}>Edit</button>
                        <button className={'btn btn-sm btn-error text-white ms-4'} onClick={() => openModalConfirm(data.id)} >Hapus</button>
                      </>
                    } className='w-48' />
                  </tr>
                ))}
              </>}
            />
          </ContainerRow>
          
          <ContainerRow className='-mx-3'>
            <ContainerWhiteCard>
            
              <div className='border-gray-300 border max-w-fit rounded-md p-4'>
                <div className='text-8xl text-red-400'>
                  <i className="fa-regular fa-file-pdf"></i>
                </div>
                <div className='mt-2 font-normal'>nama-file.pdf</div>
                <div className='text-sm'>nama-file.pdf</div>
              </div>

            </ContainerWhiteCard>
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
            <InputColumn idError='fileUploadError' text={textFileInput} type='file' onChange={handleInputFile} name='file_upload' id='fileUpload' required={isRequired} />
            {/* <img src={imgSrc} id='' className='w-full rounded-md my-4' /> */}
            {/* <embed src={imgSrc} type="application/pdf" className='w-full' height="400" /> */}
            <InputColumn idError='fileNameError' className='mt-6' text='nama file' id='file_name' onChange={handleInput} name='file_name' value={fileName} required />
            <InputColumn text='nomor surat' id='number' onChange={handleInput} name='number' value={number} />
            <InputColumn text='sumber/dari' id='source' onChange={handleInput} name='source' value={source} />
          </div>

        </>}

        addButton={<>
          <button className='btn' onClick={cekData}>cek data</button>
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