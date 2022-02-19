import React, { useState } from "react"
import { Navbar, Container, Button } from "react-bootstrap"
import { Place } from "./DashBoardCard"

const DashBoard = () => {
  // const [placeData,setPlaceData] = useState();

  const Mockresponse = {
    room: [
      {
        number: 1,
        place: "Home",
        current_flame:true,
        current_gas: 400.0,
        current_temp: 21.5,
        ref_gas: 2000,
        ref_temp: 50.5,
      },
      {
        number: 2,
        place: "University",
        current_flame:true,
        current_gas: 300.0,
        current_temp: 277.5,
        ref_gas: 2000,
        ref_temp: 50.5,
      },
      {
        number: 3,
        place: "204",
        current_flame:false,
        current_gas: 100.0,
        current_temp: 25.5,
        ref_gas: 2000,
        ref_temp: 50.5,
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
