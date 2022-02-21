import React, { useState } from "react";
import "./SwitchButton.css";

const SwitchButton = props => {
  const [isToggled, setIsToggled] = useState(props.bool);
  const onToggle = () => {
    setIsToggled(!isToggled);
    props.tempcallback(!isToggled);
  };
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={isToggled} onChange={onToggle} />
      <span className="switch" />
    </label>
  );

};

export default SwitchButton;
