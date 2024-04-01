import { React, useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { Main, Container, ContainerRow } from '../components/BaseLayout'
import { CardData } from '../components/BaseCard'
import { GetAllCount } from '../api/count'
import { useGlobalState } from '../state/state'


const Dashboard = () => {
  const [userRoleLogin, setUserRoleLogin] = useGlobalState('userRoleLogin')
  const [data, setData] = useState()

  const getAllData = async () => {
    try {
      const result = await GetAllCount()
      if (result.data) setData(result.data);
    } catch (error) {
      
    }
  }

  useEffect(() => {
    getAllData()
  }, [])

  return (
    <>
      <Sidebar/>
      <Main>
        <Navbar page='Dashboard' />
        <Container>

          <ContainerRow className='-mx-3'>
            {data ? <>
              <CardData text='Total File/kategori' value={data.file} icon='fa-file' />
              <CardData text='Siswa' value={data.student} icon='fa-graduation-cap' />
              { userRoleLogin == 'operator' ?
                <CardData text='Pengguna' value={data.user} icon='fa-users' />
                : null
              }
            </> : null}
          </ContainerRow>

          <div className='mt-6 mb-3'>
            <div className='font-semibold'>Kategori:</div>
          </div>

          <ContainerRow className='-mx-3'>
            { data ? data.file_category.map((item, index) => (
              <CardData key={index} text={item.category_name} value={item.total} />
            )) : null}
          </ContainerRow>

        </Container>

      </Main>

    </>
  )
}

export default Dashboard