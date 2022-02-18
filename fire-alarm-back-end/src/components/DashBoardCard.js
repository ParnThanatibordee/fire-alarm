import React, { useEffect, useState } from "react";
import {Button} from 'react-bootstrap';
import Popup from './Popup';
import PopupDetail from './PopupDetail';

export const Place = ({ place}) => {
    const [buttonPopup, setButtonPopup] = useState(false);
  return (
    <div className={'dashboardcard'}>
      <div className="circle" />
      <div className="Place">PLACE : {place.place}</div>
      <div className="status">EMERGENCY ALERT</div>

      <Button onClick={() => setButtonPopup(true)}>Detail</Button>
      <Popup trigger={buttonPopup} closePopup={() => setButtonPopup(false)}>
        <PopupDetail detail={place}/>
      </Popup>
    </div>
  );
};

