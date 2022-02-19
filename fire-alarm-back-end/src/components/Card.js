import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import Popup from './Popup';
import PopupDetail from './PopupDetail';
import PopUpSetting from './PopUpSetting';


export default function Card({ state }) {
  const [buttonPopup, setButtonPopup] = useState(false);
  const [settingPopup, setSettingPopup] = useState(false);

  return (
    <div className="dashboardcard">
      <div className="circle" />
      <br />
      <p>Place</p>
      <br />
      <p>Status</p>
      <br />
      <Button onClick={() => setButtonPopup(true)}>Detail</Button>
      <Button onClick={() => setSettingPopup(true)}>Setting</Button>
      <Popup trigger={buttonPopup} closePopup={() => setButtonPopup(false)}>
        <PopupDetail />
      </Popup>
      <Popup trigger={settingPopup} closePopup={() => setSettingPopup(false)}>
        <PopUpSetting noti={state} />
      </Popup>
    </div>
  )
}
