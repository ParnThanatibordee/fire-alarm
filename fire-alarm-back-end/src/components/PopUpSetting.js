import React from "react"
import axios from 'axios'
import SwitchButton from "./SwitchButton"
import FireSwitchButton from "./FireSwitchButton"
import GasSwitchButton from "./GasSwitchButton"
import TempSwitchButton from "./TempSwitchButton"
import { Form, Button } from "react-bootstrap"


export default function PopUpSetting({ noti }) {
  console.log(noti)
  console.log(noti.line_notification);
  console.log(noti.flame_notification);
  console.log(noti.gas_notification);
  console.log(noti.temp_notification);

  const typetoken = window.localStorage.getItem('typetoken')
  const accessToken = window.localStorage.getItem('accesstoken')

  console.log(typetoken)
  console.log(accessToken)

  const [details, setDetails] = React.useState({
    place: "",
    linetoken: "",
    reftemp: "",
    refgas: "",
  })

  const handleSubmitClick = (e) => {
    e.preventDefault()
    try {
      axios({
        method: "post",
        url: "https://ecourse.cpe.ku.ac.th/exceed15/api/fire-alarm/configure",
        hearder: `${typetoken} ${accessToken}`,
        data: {
          "number": noti.number,
          "place": details.place,
          "line_token": details.linetoken,
          "ref_gas": details.refgas,
          "ref_temp": details.reftemp,
          "flame_notification": noti.flame_notification,
          "gas_notification": noti.gas_notification,
          "temp_notification": noti.temp_notification,
          "line_notification": noti.line_notification,
        },
      });
    } catch (error) {
      console.log(error)
    }
  }

  const linecallbackState = (data) => {
    try {
      axios({
        method: "post",
        url: "https://ecourse.cpe.ku.ac.th/exceed15/api/fire-alarm/configure",
        hearder: `${typetoken} ${accessToken}`,
        data: {
          "number": noti.number,
          "place": noti.place,
          "line_token": "",
          "ref_gas": noti.ref_gas,
          "ref_temp": noti.ref_temp,
          "flame_notification": noti.flame_notification,
          "gas_notification": noti.gas_notification,
          "temp_notification": noti.temp_notification,
          "line_notification": data
        },
      });
    } catch (error) {
      console.log(error)
    }
  }
  const firecallbackState = (data) => {
    try {
      axios({
        method: "post",
        url: "https://ecourse.cpe.ku.ac.th/exceed15/api/fire-alarm/configure",
        hearder: `${typetoken} ${accessToken}`,
        data: {
          "number": noti.number,
          "place": noti.place,
          "line_token": "",
          "ref_gas": noti.ref_gas,
          "ref_temp": noti.ref_temp,
          "flame_notification": data,
          "gas_notification": noti.gas_notification,
          "temp_notification": noti.temp_notification,
          "line_notification": noti.line_notification
        },
      });
    } catch (error) {
      console.log(error)
    }
  }
  const gascallbackState = (data) => {
    try {
      axios({
        method: "post",
        url: "https://ecourse.cpe.ku.ac.th/exceed15/api/fire-alarm/configure",
        hearder: `${typetoken} ${accessToken}`,
        data: {
          "number": noti.number,
          "place": noti.place,
          "line_token": "",
          "ref_gas": noti.ref_gas,
          "ref_temp": noti.ref_temp,
          "flame_notification": noti.flame_notification,
          "gas_notification": data,
          "temp_notification": noti.temp_notification,
          "line_notification": noti.line_notification
        },
      });
    } catch (error) {
      console.log(error)
    }
  }
  const tempcallbackState = (data) => {
    try {
      axios({
        method: "post",
        url: "https://ecourse.cpe.ku.ac.th/exceed15/api/fire-alarm/configure",
        hearder: `${typetoken} ${accessToken}`,
        data: {
          "number": noti.number,
          "place": noti.place,
          "line_token": "",
          "ref_gas": noti.ref_gas,
          "ref_temp": noti.ref_temp,
          "flame_notification": noti.flame_notification,
          "gas_notification": noti.gas_notification,
          "temp_notification": data,
          "line_notification": noti.line_notification
        },
      });
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <p>Fire Alarm Setting</p>
      <p>
        Line Notification <SwitchButton bool={noti.line_notification} linecallback={linecallbackState} />
      </p>
      <p>
        Fire <FireSwitchButton bool={noti.flame_notification} firecallback={firecallbackState} />
      </p>
      <p>
        Gas <GasSwitchButton bool={noti.gas_notification} gascallback={gascallbackState} />
      </p>
      <p>
        Temp <TempSwitchButton bool={noti.temp_notification} tempcallback={tempcallbackState} />
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
