import { React, useEffect, useRef, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { BaseTable, TableHead, TableData } from '../components/BaseTable'
import { Main, Container, ContainerRow } from '../components/BaseLayout'
import { GetAllFile, CreateFile, DeleteFile, UpdateFile } from '../api/file'
import { GetAllCategory } from '../api/category'
import { downloadFile, getId } from '../function/baseFunction'
import { ModalAlert, ModalForm } from '../components/BaseModal'
import { BaseInput, SelectInput } from '../components/BaseInput'
import { ContainerWhiteCard } from '../components/BaseCard'


const Document = () => {
  const btnClass = 'btn text-white capitalize bg-gradient-to-tl from-purple-700 to-pink-500 border-0 hover:opacity-85'
  const [data, setData] = useState([])
  const [dataCategory, setDataCategory] = useState([])
  const [uuid, setUuid] = useState('')
  const [textInfo, setTextInfo] = useState('tambah')
  const [textAlert, setTextAlert] = useState('')
  const meta = useRef({
    id: '',
    file_name: '',
    file_upload: '',
    number: '',
    source: '',
    year: '',
    format: '',
    id_category: '',
    id_user: 'acf821a5-1f1a-4869-a3b9-6e7ab5cf176b'
  })
  const [imgSrc, setImgSrc] = useState('')

  const getAllData = async () => {
    try {
      const result = await GetAllFile()
      setData(result.data)
    } catch (error) {
      
    }
  }

  const openModal = (dataParams = '') => {
    setUuid(dataParams.id)

    console.log(dataParams, '<-- data params');

    if (dataParams.id) {
      setTextInfo('perbarui')
      getId('btnCreate').classList.add('hidden')
      getId('btnUpdate').classList.remove('hidden')

      meta.current.id = dataParams.id
      meta.current.file_name = dataParams.file_name
      meta.current.id_category = dataParams.id_category
      meta.current.format = dataParams.format
      meta.current.number = dataParams.number
      meta.current.source = dataParams.source
      meta.current.year = dataParams.year

      getId('file_name').value = dataParams.file_name
      getId('category').value = dataParams.id_category
      getId('format').value = dataParams.format
      getId('number').value = dataParams.number
      getId('source').value = dataParams.source
      getId('year').value = dataParams.year

      setImgSrc('http://localhost:8000/'+dataParams.file)

    } else {
      setTextInfo('tambah')
      getId('btnCreate').classList.remove('hidden')
      getId('btnUpdate').classList.add('hidden')
    }

    // getId('errorMsg').classList.add('hidden')
    getId('modalForm').showModal()
  }

  const openModalConfirm = (uuid) => {
    setUuid(uuid)
    getId('modalConfirm').showModal()
  }

  const handleChange = (fieldName, event) => {
    meta.current[fieldName] = event.target.value;
  };

  const handleChangeFile = (fieldName, event) => {
    meta.current[fieldName] = event.target.files[0];

    let fileName = meta.current.file_upload.name
    let firstPart = fileName.split('.')[0]
    let fileFormat = fileName.split('.').pop();

    meta.current.file_name = firstPart
    meta.current.format = fileFormat

    getId('file_name').value = firstPart
    getId('format').value = fileFormat
  };

  const validateInput =  () => {
    if (categoryName == '') {
      getId('errorMsg').classList.remove('hidden')
      return false
    } else {
      getId('errorMsg').classList.add('hidden')
      getId('closeBtn').click()
      return true
    }
  }

  const createData = async () => {
    try {
      const formData = new FormData();
      const fields = ['id_user', 'id_category', 'file_name', 'number', 'source', 'format', 'year', 'file_upload'];
      fields.forEach(field => {
        formData.append(field, meta.current[field]);
      });

      getId('closeBtn').click()
      await CreateFile(formData)
      setTimeout(() => { getAllData() }, 100)

    } catch (error) {
      console.log(error, '<-- error create dokumen');
    }
  }

  const updateData = async () => {
    try {
      // const validate = validateInput()
      // if (validate) {
      //   await UpdateFile({})
      //   getAllData()
      // }

      const formData = new FormData();
      const fields = ['id', 'id_category', 'file_name', 'number', 'source', 'format', 'year', 'file_upload'];
      fields.forEach(field => {
        formData.append(field, meta.current[field]);
      });
      
      getId('closeBtn').click()
      await UpdateFile(formData)
      setTimeout(() => { getAllData() }, 100)


    } catch (error) {

    }
  }

  const deleteData = async () => {
    try {
      getId('closeBtnConfirm').click()
      await DeleteFile(uuid)
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
    } catch (error) {
      
    }
  }

  useEffect(() => {
    getAllData()
    getDataCategory()
  }, [])


  const badge = (text) => {

    let badgeClass = 'bg-gray-400'

    if (text == 'pdf') {
      badgeClass = 'bg-red-400'
    } else if (text == 'docx') {
      badgeClass = 'bg-blue-400'
    } else if (text == 'jpg' || 'png' || 'jpeg') {
      badgeClass = 'bg-green-500'
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
            <button className={btnClass} onClick={()=>openModal()}>tambah Dokumen <i className="fa-solid fa-plus"></i></button>
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
                    <TableData text={data.file_name} />
                    <TableData text={badge(data.format)} pl='pl-2' />
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
        fill={<>
          <h3 className="font-bold text-lg capitalize">{textInfo} dokumen</h3>

          <div className=''>
            <BaseInput text='upload file*' type='file' onChange={(event) => handleChangeFile('file_upload', event)} />
            <img src={imgSrc} className='w-full rounded-md my-4' />
            {/* <embed src={imgSrc} type="application/pdf" className='w-full' height="400" /> */}
            <BaseInput text='nama dokumen*' id='file_name' onChange={(event) => handleChange('file_name', event)} />
            <SelectInput text='kategori/jenis*' id='category' onChange={(event) => handleChange('id_category', event)} option={
              dataCategory.map((data) => (
                <option key={data.id} value={data.id}>{data.name}</option>
              ))
            } />
            <BaseInput text='format file' id='format' onChange={(event) => handleChange('format', event)} />
            <BaseInput text='nomor surat' id='number' onChange={(event) => handleChange('number', event)} />
            <BaseInput text='sumber/dari' id='source' onChange={(event) => handleChange('source', event)} />
            <BaseInput text='tahun' id='year' onChange={(event) => handleChange('year', event)} />
          </div>

        </>}

        addButton={<>
          <button className='btn' onClick={() => console.log(meta)}>cek data meta</button>
          <button className={"btn hidden "+btnClass} id='btnCreate' onClick={createData}>Tambah</button>
          <button className={"btn hidden "+btnClass} id='btnUpdate' onClick={updateData}>Perbarui</button>
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