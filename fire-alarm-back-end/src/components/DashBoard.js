import React, {useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar, Container, Button} from 'react-bootstrap';
import Popup from './Popup';
import PopupDetail from './PopupDetail';
import PopUpSetting from './PopUpSetting';

export default function Dashboard() {
  const [buttonPopup, setButtonPopup] = useState(false);
  const [settingPopup, setSettingPopup] = useState(false);

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
        <Button onClick={() => setButtonPopup(true)}>Detail</Button>
        <Button onClick={() => setSettingPopup(true)}>Setting</Button>
        <Popup trigger={buttonPopup} closePopup={() => setButtonPopup(false)}>
          <PopupDetail/>
        </Popup>
        <Popup trigger={settingPopup} closePopup={() => setSettingPopup(false)}>
          <PopUpSetting/>
        </Popup>
      </div>
    </div>
  )
}
