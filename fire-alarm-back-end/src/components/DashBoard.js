import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar, Container, Button} from 'react-bootstrap';

const DashBoard = () => {
  return (
    <div className="DashboardPage">
      <Navbar>
        <Container>
          <Navbar.Brand href="#home">Fire Alart</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Signed in as: <a href="#login">Mark Otto</a>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="dashboardcard">
        <div className="circle" />
        <br/>
        <p>Place</p>
        <br/>
        <p>Status</p>
        <br/>
        <Button>Detail</Button>
      </div>
    </div>
  )
}

export default DashBoard