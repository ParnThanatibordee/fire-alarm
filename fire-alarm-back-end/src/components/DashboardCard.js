import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Card, Button } from 'react-bootstrap'
import PopupDetail from './PopupDetail'

const DashboardCard = ({ place }) => {
  const [buttonPopup, setButtonPopup] = useState(false)
  let status = 'emergency' //เปลี่ยนได้
  let status_msg = ''

  if (status === 'emergency'){
      status_msg = 'EMERGENCY ALERT'
  }
  else if (status === 'warning'){
      status_msg = 'Warning'
  }
  else {
      status_msg = 'Normal'
  }

  return (
    <Card /* bg='dark' text='light' */ border='dark' style={{ width: '20rem', height: '25rem' }}>
      <Card.Body>
        <div className={`circle ${status} mt-3 mb-4`}></div>
        <h3>Hospital</h3>
        <h3 className={`status-text ${status} mt-4`}>
            {status_msg}
        </h3>
        <Button className='mt-4' variant="primary" onClick={() => setButtonPopup(true)}>
          Detail
        </Button>

        <PopupDetail show={buttonPopup} onHide={() => setButtonPopup(false)} />
      </Card.Body>
    </Card>
  )
}

export default DashboardCard
