import React from "react";
import SwitchButton from "./SwitchButton";
import FireSwitchButton from "./FireSwitchButton";
import GasSwitchButton from "./GasSwitchButton";
import TempSwitchButton from "./TempSwitchButton";
import { Form } from "react-bootstrap";

export default function PopUpSetting({ noti }) {
  const handleSetting = (e) => {
    e.preventDefault();

    const { place, reftemp, refgas } = e.target.element;

    fetch('', {
      method: "POST",
      header: { 'Content-Type': 'application/json' },
      data: JSON.stringify(place.value, reftemp.value, refgas.value)
    });
  }
  return (
    <div>
      <p>Fire Alarm Setting</p>
      <p>
        Line Notification <SwitchButton bool={noti.linenoti} />
      </p>
      <p>
        Fire <FireSwitchButton bool={noti.firenoyi} />
      </p>
      <p>
        Gas <GasSwitchButton bool={noti.gasnoti} />
      </p>
      <p>
        Temp <TempSwitchButton bool={noti.tempnoti} />
      </p>
      <Form>
        <Form.Group className="mb-3" >
          <Form.Label>Place Name</Form.Label>
          <Form.Control type="place" id="palce" placeholder="Place Name" />
        </Form.Group>
        <Form.Group className="mb-3" >
          <Form.Label>Line Token</Form.Label>
          <Form.Control type="linetoken" id="linetoken" placeholder="Line Token" />
        </Form.Group>
        <Form.Group className="mb-3" >
          <Form.Label>Reference Temperature</Form.Label>
          <Form.Control type="reftrem" id="reftemp" placeholder="Reference Temperature" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Reference Gas</Form.Label>
          <Form.Control type="refgas" id="refgas" placeholder="Reference Gas" />
        </Form.Group>
      </Form>
    </div>
  );
}
