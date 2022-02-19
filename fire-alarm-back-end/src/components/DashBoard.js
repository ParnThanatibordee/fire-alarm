import React, { useState, useEffect } from "react"
import { Navbar, Container, Button } from "react-bootstrap"
import { Place } from "./DashBoardCard"
import Popup from "./Popup"
import PopUpAlert from "./PopUpAlert"
import axios from "axios"

const DashBoard = () => {
  // const Mockresponse = {
  //   room: [
  //     {
  //       number: 1,
  //       place: "University",
  //       current_flame: true,
  //       current_gas: 300.0,
  //       current_temp: 277.5,
  //       ref_gas: 2000,
  //       ref_temp: 50.5,
  //       flame_notification: true,
  //       gas_notification: true,
  //       temp_notification: true,
  //       line_notification: true,
  //       emergency: true,
  //     },
  //     {
  //       number: 2,
  //       place: "204",
  //       current_flame: false,
  //       current_gas: 100.0,
  //       current_temp: 25.5,
  //       ref_gas: 2000,
  //       ref_temp: 50.5,
  //       flame_notification: true,
  //       gas_notification: true,
  //       temp_notification: true,
  //       line_notification: true,
  //       emergency: false,
  //     },
  //   ],
  // }
  const [placeData, setPlaceData] = useState([])
  const [buttonPopup, setButtonPopup] = useState(false)

  useEffect(() => {
    setInterval(getData, 1000)
  }, [])

  const getData = async () => {
    const response = await axios.get(
      "https://ecourse.cpe.ku.ac.th/exceed15/api/fire-alarm/get-record"
    )
    setPlaceData(response.data.room)
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
        <div className="d-flex justify-content-end">
          <Button
            className="mb-3"
            variant="danger"
            onClick={() => setButtonPopup(true)}
          >
            EMERGENCY
          </Button>
        </div>
        <Popup trigger={buttonPopup} closePopup={() => setButtonPopup(false)}>
          <PopUpAlert
            places={placeData.filter((m) => {
              if (m.emergency) return m.place
            })}
          />
        </Popup>
        <div className="row">
          {placeData.map((r) => (
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
