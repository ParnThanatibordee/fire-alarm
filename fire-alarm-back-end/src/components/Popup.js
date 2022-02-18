import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from 'react-bootstrap';

const Popup = (props) => {
  return (props.trigger) ? (
    <div className="popup">
        <div className="popupInner">
            {props.children}
            <Button onClick={props.closePopup}>Close</Button>
        </div>
    </div>
  ): "";
}

export default Popup