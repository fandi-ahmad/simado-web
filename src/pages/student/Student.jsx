import { React, useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import { Container, ContainerRow, Main } from '../../components/BaseLayout'
import Navbar from '../../components/Navbar'
import { CreateStudent, DeleteStudent, GetAllStudent, UpdateStudent } from '../../api/student/student'
import {  BaseTable, TableData, TableHead } from '../../components/BaseTable'
import { ModalAlert, ModalForm } from '../../components/BaseModal'
import { getId } from '../../function/baseFunction'
import { BaseInput, InputColumn } from '../../components/BaseInput'
import { BaseButton, ButtonPrimary } from '../../components/BaseButton'
import { BaseDropdownUl, DropdownListData } from '../../components/Dropdown'

const Student = () => {
  const [data, setData] = useState([])
  const [textInfo, setTextInfo] = useState('')
  const [textBtnAction, setTextBtnAction] = useState('buat')
  const [textAlert, setTextAlert] = useState('')
  const [nisn, setNisn] = useState('')
  const [studentName, setStudentName] = useState('')
  const [year, setYear] = useState('')
  const [id, setId] = useState('')

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [orderName, setOrderName] = useState('updatedAt')
  const [orderValue, setOrderValue] = useState('DESC')

  const [totalPage, setTotalPage] = useState(1)
  const [isBtnPrevious, setIsBtnPrevious] = useState()
  const [isBtnNext, setIsBtnNext] = useState()

  const checkPaginationBtn = () => {
    page == 1 ? setIsBtnPrevious(true) : setIsBtnPrevious(false)
    page == totalPage ? setIsBtnNext(true) : setIsBtnNext(false)
  }

  const getAllData = async () => {
    try {
      const result = await GetAllStudent(page, limit, orderName, orderValue)
      setData(result.data)
      setTotalPage(result.total_page)
    } catch (error) {}
  }
  
  const handleInput = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'nisn': setNisn(value); break;
      case 'studentName': setStudentName(value); break;
      case 'year': setYear(value); break;
      default: break;
    }
  };

  const cleanUpFormInput = () => {
    setId('')
    setNisn('')
    setStudentName('')
    setYear('')
    getId('nisnError').classList.add('hidden')
    getId('studentNameError').classList.add('hidden')
    getId('yearError').classList.add('hidden')
  }  

  const openModal = (dataParams = '') => {
    getId('modalForm').showModal()
    cleanUpFormInput()

    if (dataParams.id) {
      // for edit
      setTextBtnAction('simpan')
      setTextInfo('Edit data siswa')

      setId(dataParams.id)
      setNisn(dataParams.nisn)
      setStudentName(dataParams.name)
      setYear(dataParams.year)
    } else {
      // for create new
      setTextBtnAction('buat')
      setTextInfo('Buat data siswa baru')
    }
  }

  const openModalConfirm = (idSelected) => {
    setId(idSelected)
    getId('modalConfirm').showModal()
  }

  const validateNisn = (condition) => {
    if (condition == 406) {
      setTextAlert('NISN sudah digunakan!')
      getId('modalAlert').showModal()
    } else {
      getId('closeBtn').click()
    }
  }

  const createOrUpdateData = async () => {
    try {
      if (nisn == '') getId('nisnError').classList.remove('hidden')
      if (studentName == '') getId('studentNameError').classList.remove('hidden')
      if (year == '') getId('yearError').classList.remove('hidden')

      // create
      if (!id && nisn && studentName && year) {
        const result = await CreateStudent({
          nisn: nisn,
          name: studentName,
          year: year
        })
        validateNisn(result.status)
      }

      // update
      if (id && nisn && studentName && year) {
        const result = await UpdateStudent({
          id: id,
          nisn: nisn,
          name: studentName,
          year: year
        })
        validateNisn(result.status)
      }
      
      setTimeout(() => { getAllData() }, 100)
    } catch (error) {}
  }

  const deleteData = async () => {
    try {
      getId('closeBtnConfirm').click()
      await DeleteStudent(id)
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

  useEffect(() => {
    checkPaginationBtn()
  }, [page, totalPage])

  useEffect(() => {
    setPage(1)
  }, [limit])

  useEffect(() => {
    getAllData()
  }, [page, limit, orderName, orderValue])

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
            {!data[0] ? <div className='w-full text-center text-2xl'>-- Belum ada data --</div> : 
              <BaseTable className='pb-8'
                filter={<div className='flex flex-row justify-between'>
                  <div>
                    <BaseDropdownUl text='Tampilkan:' btnText={limit} btnClassName='bg-gray-300' className='w-20'>
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

                  <BaseInput type='search' placeholder='Cari...' />
                
                </div>}
              
                thead={<>
                  <TableHead text='No' className='w-12' />
                  <TableHead text='NISN' />
                  <TableHead text='Nama Siswa' />
                  <TableHead text='Tahun masuk' />
                  <TableHead />
                  <TableHead />
                </>}

                tbody={<>
                  {data.map((data, index) => (
                    <tr key={data.id}>
                      <TableData text={index+1} />
                      <TableData text={data.nisn} />
                      <TableData text={data.name} className='capitalize' />
                      <TableData text={data.year} />
                      <TableData className='w-full' />
                      <TableData text={
                        <BaseDropdownUl icon='fa-ellipsis-vertical'>
                          <DropdownListData icon='fa-pen-to-square' text='Edit' onClick={() => openModal(data)} />
                          <DropdownListData icon='fa-trash-can' text='Hapus' onClick={() => openModalConfirm(data.id)} />
                        </BaseDropdownUl>
                      } className='w-48' />
                    </tr>
                  ))}
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

      {/* modal form for input */}
      <ModalForm
        full={true}
        fill={<>
          <h3 className="font-bold text-lg capitalize">{textInfo}</h3>
          <InputColumn idError='nisnError' text='NISN' name='nisn' onChange={handleInput} value={nisn} required />
          <InputColumn idError='studentNameError' text='Nama siswa' name='studentName' onChange={handleInput} value={studentName} required />
          <InputColumn idError='yearError' text='Tahun masuk' name='year' onChange={handleInput} value={year} required />
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