import React from "react"
import SwitchButton from "./SwitchButton"
import FireSwitchButton from "./FireSwitchButton"
import GasSwitchButton from "./GasSwitchButton"
import TempSwitchButton from "./TempSwitchButton"
import { Form, Button } from "react-bootstrap"

export default function PopUpSetting({ noti }) {
  const [details, setDetails] = React.useState({
    place: "",
    linetoken: "",
    reftemp: "",
    refgas: "",
  })

  const handleSubmitClick = (e) => {
    e.preventDefault()
    console.log(details)
  }
  return (
    <div>
      <p>Fire Alarm Setting</p>
      <p>
        Line Notification <SwitchButton bool={noti.line_notification} />
      </p>
      <p>
        Fire <FireSwitchButton bool={noti.fire_notification} />
      </p>
      <p>
        Gas <GasSwitchButton bool={noti.gas_notification} />
      </p>
      <p>
        Temp <TempSwitchButton bool={noti.temp_notification} />
      </p>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Place Name</Form.Label>
          <Form.Control
            type="place"
            id="palce"
            placeholder="Place Name"
            onChange={(e) => setDetails({ ...details, place: e.target.value })}
            value={details.place}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>LINE Token</Form.Label>
          <Form.Control
            type="linetoken"
            id="linetoken"
            placeholder="LINE Token"
            onChange={(e) =>
              setDetails({ ...details, linetoken: e.target.value })
            }
            value={details.linetoken}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Reference Temperature</Form.Label>
          <Form.Control
            type="reftrem"
            id="reftemp"
            placeholder="Reference Temperature"
            onChange={(e) =>
              setDetails({ ...details, reftemp: e.target.value })
            }
            value={details.reftemp}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Reference Gas</Form.Label>
          <Form.Control
            type="refgas"
            id="refgas"
            placeholder="Reference Gas"
            onChange={(e) => setDetails({ ...details, refgas: e.target.value })}
            value={details.refgas}
          />
        </Form.Group>
        <div>
          <Button
            className="mb-3"
            variant="outline-success"
            type="submit"
            onClick={handleSubmitClick}
          >
            Save changes
          </Button>
        </div>
      </Form>
    </div>
  )
}
