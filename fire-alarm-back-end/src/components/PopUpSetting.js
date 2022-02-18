import React from 'react'
import SwitchButton from './SwitchButton'
import FireSwitchButton from './FireSwitchButton'
import GasSwitchButton from './GasSwitchButton'
import TempSwitchButton from './TempSwitchButton'

export default function PopUpSetting() {
  return (
    <div>
      <p>Fire Alarm Setting</p>
      <p>Line Notification <SwitchButton bool={false}/></p>
      <p>Fire <FireSwitchButton bool={false}/></p>
      <p>Gas <GasSwitchButton bool={false}/></p>
      <p>Temp <TempSwitchButton bool={false}/></p>
  </div>
  )
}

