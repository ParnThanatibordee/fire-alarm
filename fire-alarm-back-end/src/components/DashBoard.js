import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Navbar, Container, Button } from 'react-bootstrap'
import PopUpAlert from './PopUpAlert'
import DashboardCard from './DashboardCard'

const DashBoard = () => {
  const [modalShow, setModalShow] = useState(true)
  
  return (
    <div className="dashboardPage">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="https://cdn-icons-png.flaticon.com/512/216/216295.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            Fire Alarm
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Button
              className="justify-content-end"
              variant="danger"
              onClick={() => setModalShow(true)}
            >
              Emergency Alert
            </Button>
            <PopUpAlert show={modalShow} onHide={() => setModalShow(false)} />
          </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Signed in as: <a href="#login">Pangpond</a>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div class="card-list">
        <DashboardCard></DashboardCard>
        {/* <DashboardCard></DashboardCard> */}
      </div>
    </div>
  )
}

export default DashBoard
