import React from "react"

const PopupDetail = ({ detail }) => {
  const { fire, temp, ref_temp, gas, ref_gas, place } = detail
  return (
    <div>
      <h3>PLACE : {place}</h3>
      <p>Temperature : {temp} C</p>
      <p>Control Value Temperature : {ref_temp}</p>
      <p>Gas : {gas}</p>
      <p>Control Value Gas : {ref_gas}</p>
      <p>{fire ? "Very Hot" : "Too Cool"}</p>
    </div>
  )
}

export default PopupDetail
