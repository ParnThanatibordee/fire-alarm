import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, Modal } from 'react-bootstrap'

function PopUpAlert(props) {
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <div className='alert-header'>Emergency Alert</div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>1. Hospital</p>
        <p>2. University</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={props.onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default PopUpAlert
