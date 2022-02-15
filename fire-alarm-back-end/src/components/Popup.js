import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from 'react-bootstrap';

const Popup = (props) => {
  return (props.trigger) ? (
    <div className="popup">
        <div className="popupInner">
            <Button onClick={props.closePopup}>Close</Button>
            {props.children}
        </div>
    </div>
  ): "";
}

export default Popup