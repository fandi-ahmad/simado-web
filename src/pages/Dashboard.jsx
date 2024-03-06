import React from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { Main, Container, ContainerRow } from '../components/BaseLayout'
import { CardData } from '../components/BaseCard'

const Dashboard = () => {
  return (
    <>
      <Sidebar/>
      <Main>
        <Navbar page='Dashboard' />
        <Container>

          <ContainerRow className='-mx-3'>

            <CardData text='Total File' value='237' icon='fa-file' />
            <CardData text='Users' value='14' icon='fa-users' />
            <CardData text='Database' value='7,108 kb' icon='fa-database' />
            <CardData text='Download' value='82' icon='fa-download' />


          </ContainerRow>


        </Container>

      </Main>

    </>
  )
}

export default Dashboard