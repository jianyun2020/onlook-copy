import React, { ReactNode, useEffect, useRef, useState } from "react";

interface Canvas {
  children: ReactNode;
}

function Canvas({ children }: Canvas) {
  const [position, setPosition] = useState({x: 0, y: 0})
  const [scale, setScale] = useState(0.5)
  const [isOverlayVisible, setIsOverlayVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const zoomSensitivity = 0.002;
  const panSensitivity = 0.4;

  const handleWhell = (event: WheelEvent) => {
    if (event.ctrlKey) {
      handleZoom(event)
    } else {
      handlePan(event)
    }
  }

  const handleZoom = (event: WheelEvent) => {
    if (!containerRef.current) return
    event.preventDefault()
    const zoomFactor = -event.deltaY * zoomSensitivity; // Apply zoom sensitivity
    const rect = containerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newScale = scale * (1 + zoomFactor)
    const deltaX = (x - position.x) * zoomFactor
    const deltaY = (y - position.y) * zoomFactor

    setScale(newScale)
    setPosition(prevPosition => ({
      x: prevPosition.x - deltaX,
      y: prevPosition.y - deltaY
    }))
  }

  const handlePan = (event: WheelEvent) => {
    const deltaX = (event.deltaX + (event.shiftKey ? event.deltaY : 0)) * panSensitivity; // Apply pan sensitivity
    const deltaY = (event.shiftKey ? 0 : event.deltaY) * panSensitivity;
    setPosition(prevPosition => ({
      x: prevPosition.x - deltaX,
      y: prevPosition.y - deltaY
    }))
  }

  const toggleOverlay = () => {
    setIsOverlayVisible(prev => !prev)
  }

  useEffect(() => {
    const div = containerRef.current
    if (div) {
      div.addEventListener('wheel', handleWhell, {passive: false})
      return () => div.removeEventListener('wheel', handleWhell)
    }
  }, [handleWhell])

  return (
    <div ref={containerRef} className="overflow-hidden bg-stone-800">
      {isOverlayVisible && (
        <div
          ref={overlayRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            backgroundColor: 'transparent',
            pointerEvents: 'auto'
          }}
        />
      )}
      <div
        style={{
          transition: 'transform ease',
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default Canvas