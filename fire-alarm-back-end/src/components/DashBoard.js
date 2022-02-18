import React, { useState } from "react"
import { Navbar, Container, Button } from "react-bootstrap"
import { Place } from "./DashBoardCard"

const DashBoard = () => {
  // const [placeData,setPlaceData] = useState();

  const Mockresponse = {
    room: [
      {
        place: "Home",
        fire: true,
        temp: 52.5,
        ref_temp: 20.5,
        gas: 60,
        ref_gas: 60,
      },
      {
        place: "University",
        fire: false,
        temp: 25,
        ref_temp: 45,
        gas: 25,
        ref_gas: 11,
      },
    ],
  }

  return (
    <div className="dashboardPage">
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
      <div className="container">
        <div className="row">
          {Mockresponse.room.map((r) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
              <Place place={r} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashBoard
