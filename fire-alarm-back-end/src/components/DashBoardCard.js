import React, { useState } from "react"
import { Button } from "react-bootstrap"
import Popup from "./Popup"
import PopupDetail from "./PopupDetail"

export const Place = ({ place }) => {
  const [buttonPopup, setButtonPopup] = useState(false)
  return (
    <div className={"dashboardcard"}>
      <div className="circle" />
      <p></p>
      <div className="Place">PLACE : {place.place}</div>
      <p></p>
      <div className="status">EMERGENCY ALERT</div>
      <p></p>

      <Button
        variant="outline-success"
        onClick={() => setButtonPopup(true)}
      >
        Detail
      </Button>
      <Popup trigger={buttonPopup} closePopup={() => setButtonPopup(false)}>
        <PopupDetail detail={place} />
      </Popup>
    </div>
  )
}
