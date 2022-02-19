import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, Modal } from 'react-bootstrap'

function PopupDetail(props) {
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Hospital
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Temperature: 25 Celcius
        </p>
        <p>
          Gas: No
        </p>
        <p>
          Fire: No
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PopupDetail