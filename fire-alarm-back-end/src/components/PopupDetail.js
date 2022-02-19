import React from "react"

const PopupDetail = ({ detail }) => {
  const { current_flame, current_temp, ref_temp, current_gas, ref_gas, place } =
    detail
  return (
    <div>
      <h4>PLACE : {place}</h4>
      <p></p>
      <div className="container">
        <div className="row">
          <div className="col">
            <h5>Temperature</h5>
            {/* <p>Temperature : {current_temp} °C</p>
            <p>Control Value Temperature : {ref_temp} °C</p>
            <p>{current_temp >= ref_temp ? "Not Good." : "Is OK."}</p> */}
            <div>
              <span
                style={{ color: "green", fontWeight: "bold", fontSize: "2em" }}
              >
                {current_temp}°C
              </span>
              /<span style={{ color: "red" }}>{ref_temp}°C</span>
            </div>
          </div>
          <div className="col mx-4">
            <h5>Gas</h5>
            <p>Gas : {current_gas} ppm</p>
            <p>Control Value Gas : {ref_gas} ppm</p>
            <p>{current_gas >= ref_gas ? "Not Good." : "Is OK."}</p>
          </div>
          <div className="col">
            <h5>Flame</h5>
            <p>{current_flame ? "Burn Burnnnnn!!!!!!!!" : "No"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PopupDetail
