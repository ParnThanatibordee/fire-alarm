import React from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import { Button } from "react-bootstrap"

const Popup = (props) => {
  return (
    <>
      {(props.trigger) && (
      <div className="popup">
        <div className="popupInner bg-white p-4 rounded-3">
          {props.children}
          <Button variant="outline-danger" onClick={props.closePopup}>
            Close
          </Button>
        </div>
      </div>
      )}
    </>
  )
}

export default Popup
