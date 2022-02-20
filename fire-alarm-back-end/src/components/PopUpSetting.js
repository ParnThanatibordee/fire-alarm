import React, { useEffect, useState } from "react"
import axios from "axios"
import SwitchButton from "./SwitchButton"
import FireSwitchButton from "./FireSwitchButton"
import GasSwitchButton from "./GasSwitchButton"
import TempSwitchButton from "./TempSwitchButton"
import { Form, Button } from "react-bootstrap"
import { noAuto } from "@fortawesome/fontawesome-svg-core"

export default function PopUpSetting({ noti }) {
  const typetoken = window.localStorage.getItem("typetoken")
  const accessToken = window.localStorage.getItem("accesstoken")

  const [place, setPlace] = useState(noti.place)
  const [line_token, setLine_token] = useState(noti.line_token)
  const [ref_temp, setRef_temp] = useState(noti.ref_temp)
  const [ref_gas, setRef_gas] = useState(noti.ref_gas)
  const [line_notification, setLine_notification] = useState(noti.line_notification)
  const [temp_notification, setTemp_notification] = useState(noti.temp_notification)
  const [gas_notification, setGas_notification] = useState(noti.gas_notification)
  const [flame_notification, setFlame_notification] = useState(noti.flame_notification)

  useEffect(() => {
    console.log(noti)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      axios({
        method: "post",
        url: "https://ecourse.cpe.ku.ac.th/exceed15/api/fire-alarm/configure",
        header: `${typetoken} ${accessToken}`,
        data: {
          number: noti.number,
          place: place,
          line_token: line_token,
          ref_gas: ref_gas,
          ref_temp: parseFloat(ref_temp),
          flame_notification: flame_notification,
          gas_notification: gas_notification,
          temp_notification: temp_notification,
          line_notification: line_notification,
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  const linecallbackState = (data) => {
    setLine_notification(data)
  }

  const flamecallbackState = (data) => {
    setFlame_notification(data)
  }

  const gascallbackState = (data) => {
    setGas_notification(data)
  }

  const tempcallbackState = (data) => {
    setTemp_notification(data)
  }

  return (
    <div>
      <p>Fire Alarm Setting</p>
      <p>
        LINE Notification{" "}
        <SwitchButton
          bool={line_notification}
          linecallback={linecallbackState}
        />
      </p>
      <p>
        Fire{" "}
        <FireSwitchButton
          bool={flame_notification}
          firecallback={flamecallbackState}
        />
      </p>
      <p>
        Gas{" "}
        <GasSwitchButton
          bool={gas_notification}
          gascallback={gascallbackState}
        />
      </p>
      <p>
        Temp{" "}
        <TempSwitchButton
          bool={temp_notification}
          tempcallback={tempcallbackState}
        />
      </p>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Place Name</Form.Label>
          <Form.Control
            type="place"
            id="palce"
            placeholder="Place Name"
            onChange={(e) => setPlace(e.target.value)}
            value={place}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>LINE Token</Form.Label>
          <Form.Control
            type="linetoken"
            id="linetoken"
            placeholder="LINE Token"
            onChange={(e) =>
              setLine_token(e.target.value)
            }
            value={line_token}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Reference Temperature</Form.Label>
          <Form.Control
            type="reftrem"
            id="reftemp"
            placeholder="Reference Temperature"
            onChange={(e) => setRef_temp(e.target.value)}
            value={ref_temp}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Reference Gas</Form.Label>
          <Form.Control
            type="refgas"
            id="refgas"
            placeholder="Reference Gas"
            onChange={(e) => setRef_gas(e.target.value)}
            value={ref_gas}
          />
        </Form.Group>
        <div className="text-center">
          <Button
            className="mb-3"
            variant="outline-success"
            type="submit"
            onClick={handleSubmit}
          >
            Save changes
          </Button>
        </div>
      </Form>
    </div>
  )
}
