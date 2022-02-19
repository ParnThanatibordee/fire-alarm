import React, { useState } from "react"
import { Button } from "react-bootstrap"
import Popup from "./Popup"
import PopupDetail from "./PopupDetail"
import PopUpSetting from "./PopUpSetting"

export const Place = ({ place }) => {
  const [buttonPopup, setButtonPopup] = useState(false)
  const [settingPopup, setSettingPopup] = useState(false);

  const emerStyle = place.emergency
    ? {
      card: "emergency",
      circle: "bg-danger",
      button: "danger",
      alert: "EMERGENCY ALERT",
    }
    : {
      card: "",
      circle: "bg-success",
      button: "outline-success",
      alert: "NORMAL",
    }
  return (
    <div className={`dashboardcard ${emerStyle.card}`}>
      <div className={`circle ${emerStyle.circle} mb-3`} />
      <p>PLACE : {place.place}</p>
      <p>{emerStyle.alert}</p>

      <Button variant={emerStyle.button} onClick={() => setButtonPopup(true)}>
        Detail
      </Button>
      <Button variant={emerStyle.button} onClick={() => setSettingPopup(true)}>
        Setting
      </Button>
      <Popup trigger={buttonPopup} closePopup={() => setButtonPopup(false)}>
        <PopupDetail detail={place} />
      </Popup>
      <Popup trigger={settingPopup} closePopup={() => setSettingPopup(false)}>
        <PopUpSetting noti={place} />
      </Popup>
    </div>
  )
}
