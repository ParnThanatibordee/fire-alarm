import React from "react"

const PopupDetail = ({ detail }) => {
  const {
    current_flame,
    current_temp,
    ref_temp,
    current_gas,
    ref_gas,
    place,
    gas_notification,
    flame_notification,
    temp_notification,
  } = detail
  return (
    <div className="popup-detail text-center">
      <h4>PLACE : {place}</h4>
      <br />
      <div className="row">
        {temp_notification && (
          <div className="col-12 col-md-6 col-lg">
            <h5>Temperature</h5>
            <div>
              <span
                style={{
                  color: `${current_temp > ref_temp ? "red" : "green"}`,
                  fontWeight: "bold",
                  fontSize: "2em",
                }}
              >
                {current_temp.toFixed(2)}
              </span>
              <span style={{ color: "grey" }}>/{ref_temp.toFixed(2)}°C</span>
              <p>{current_temp >= ref_temp ? "Not Good" : "Normal"}</p>
            </div>
          </div>
        )}
        {gas_notification && (
          <div className="col-12 col-md-6 col-lg">
            <h5>Gas</h5>
            <div>
              <span
                style={{
                  color: `${current_gas > ref_gas ? "red" : "green"}`,
                  fontWeight: "bold",
                  fontSize: "2em",
                }}
              >
                {current_gas.toFixed(2)}
              </span>
              <span style={{ color: "grey" }}>/{ref_gas.toFixed(2)} ppm</span>
              <p>{current_gas >= ref_gas ? "Not Good" : "Normal"}</p>
            </div>
          </div>
        )}
        {flame_notification && (
          <div className="col-12 col-md-6 col-lg">
            <h5>Flame</h5>
            <p className="fw-bold">
              {current_flame ? "DETECTED" : "Not Detected"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PopupDetail
