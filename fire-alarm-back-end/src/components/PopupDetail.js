import React from "react"

const PopupDetail = ({ detail }) => {
  const { current_flame, current_temp, ref_temp, current_gas, ref_gas, place } =
    detail
  return (
    <div className="popup-detail">
      <h4>PLACE : {place}</h4>
      <br />
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6 col-lg">
            <h5>Temperature</h5>
            {/* <p>Temperature : {current_temp} °C</p>
            <p>Control Value Temperature : {ref_temp} °C</p>
             */}
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
              <p>{current_temp >= ref_temp ? "Not Good." : "Is OK."}</p>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg">
            <h5>Gas</h5>
            {/* <p>Gas : {current_gas} ppm</p>
            <p>Control Value Gas : {ref_gas} ppm</p> */}
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
              <p>{current_gas >= ref_gas ? "Not Good." : "Is OK."}</p>
            </div>
            
          </div>
          <div className="col-12 col-lg">
            <h5>Flame</h5>
            <p className="fw-bold">{current_flame ? "Burn Burnnnnn!!!!!!!!" : "No"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PopupDetail
