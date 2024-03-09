import React from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import { Container, ContainerRow, Main } from '../../components/BaseLayout'
import { CardData, CardFolder } from '../../components/BaseCard'

const StudyYear = () => {
  const btnClass = 'btn text-white capitalize bg-gradient-to-tl from-purple-700 to-pink-500 border-0 hover:opacity-85'

  return (
    <>
      <Sidebar/>
      <Main>
        <Navbar page='rapor / tahun ajar' pageTitle='tahun ajar' />
        <Container>

          <div className='flex justify-end mb-4'>
            <button className={'mr-2 '+btnClass} >buat tahun ajar baru <i className="fa-solid fa-plus"></i></button>
          </div>

          <div className='grid grid-cols-4'>
            <CardFolder text='2023/2024' />
            <CardFolder text='2023/2024' />
            <CardFolder text='2023/2024' />
            <CardFolder text='2023/2024' />
            <CardFolder text='2023/2024' />
            <CardFolder text='2023/2024' />

          </div>


        </Container>

      </Main>

    </>
  )
}

export default StudyYear