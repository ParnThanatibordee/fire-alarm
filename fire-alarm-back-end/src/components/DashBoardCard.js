import React, { useState } from "react"
import { Button } from "react-bootstrap"
import Popup from "./Popup"
import PopupDetail from "./PopupDetail"
import PopUpSetting from "./PopUpSetting"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEllipsis } from "@fortawesome/free-solid-svg-icons"

export const Place = ({ place }) => {
  const [buttonPopup, setButtonPopup] = useState(false)
  const [settingPopup, setSettingPopup] = useState(false)

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
    <>
      <Popup trigger={buttonPopup} closePopup={() => setButtonPopup(false)}>
        <PopupDetail detail={place} />
      </Popup>
      <Popup trigger={settingPopup} closePopup={() => setSettingPopup(false)}>
        <PopUpSetting noti={place} />
      </Popup>
      <div
        className={`dashboardcard ${emerStyle.card}`}
        style={{ position: "relative" }}
      >
        <div className={`circle ${emerStyle.circle} mb-3`} />
        <p>PLACE : {place.place}</p>
        <p>{emerStyle.alert}</p>
        <div className="edit-button px-2" onClick={() => setSettingPopup(true)}>
          <FontAwesomeIcon icon={faEllipsis} />
        </div>

        <Button variant={emerStyle.button} onClick={() => setButtonPopup(true)}>
          Detail
        </Button>
      </div>
    </>
  )
}
