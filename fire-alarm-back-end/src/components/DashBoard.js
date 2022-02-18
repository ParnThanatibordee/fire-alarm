import React, {useState, useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar, Container} from 'react-bootstrap';
import axios from 'axios';
import Card from './Card';

export default function Dashboard() {
  const [data, setData] = useState('');

  const getData = async () => {
    const response = await axios.get("https://ecourse.cpe.ku.ac.th/exceed15/api/bathroom/get-record")
    setData(response.data)
  }

  useEffect(() => {
    setInterval(getData, 1000)
  }, [])

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
      <Card/>
    </div>
  )
}
