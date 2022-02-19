import React from "react"

const PopUpAlert = ({ places }) => {
  return (
    <div>
      <h1>EMERGENCY PLACE</h1>
      {places.length > 0 ? (
        places.map((p) => <p>{p.place}</p>)
      ) : (
        <p>It's peaceful here</p>
      )}
    </div>
  )
}

export default PopUpAlert
