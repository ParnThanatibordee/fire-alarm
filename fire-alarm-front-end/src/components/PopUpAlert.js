import React from "react"

const PopUpAlert = ({ places }) => {
  return (
    <div>
      <h1 className="emer-header">EMERGENCY PLACE</h1>
      {places.length > 0 ? (
        places.map((p) => <h4>{p.place}</h4>)
      ) : (
        <p>It's peaceful here</p>
      )}
    </div>
  )
}

export default PopUpAlert
