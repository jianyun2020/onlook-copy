import React from "react";
import { useState } from "react";

function AppBar() {
  const [isMaximize, setMaximize] = useState(false);
  const buttonClass = 'ungraggable w-3 h-3 rounded-full hover:opacity-90';
  const handleToggle = () => {
    if (isMaximize) {
      setMaximize(false);
    } else {
      setMaximize(true);
    }
    window.Main.Maximize();
  }

  return (
    <div className="appbar py-0.5 h-8 flex justify-between items-center draggable"></div>
  )
}

export default AppBar