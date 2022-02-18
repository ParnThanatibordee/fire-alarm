import React, {useState} from "react";
import "./SwitchButton.css";

const SwitchButton = () => {

  
  const [isToggled, setIsToggled] = useState(true);
  const onToggle = () => setIsToggled(!isToggled);
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={isToggled} onChange={onToggle} />
      <span className="switch" />
    </label>
  );

};

export default SwitchButton;
