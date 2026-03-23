import { useRef, useCallback, useEffect, useState } from 'react';

// Returns normalized x/y in range [-1, 1] based on thumb position
export default function VirtualJoystick({ onMove, onLook, size = 120 }) {
  return (
    <>
      <Stick
        side="left"
        label="Move"
        size={size}
        onChange={onMove}
      />
      <Stick
        side="right"
        label="Look"
        size={size}
        onChange={onLook}
      />
    </>
  );
}

function Stick({ side, label, size, onChange }) {
  const containerRef = useRef(null);
  const activeTouch = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const maxDist = size / 2 - 20; // thumb radius margin

  const getOffset = useCallback((touch) => {
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = touch.clientX - cx;
    let dy = touch.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > maxDist) {
      dx = (dx / dist) * maxDist;
      dy = (dy / dist) * maxDist;
    }
    return { x: dx, y: dy };
  }, [maxDist]);

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    if (activeTouch.current !== null) return;
    const touch = e.changedTouches[0];
    activeTouch.current = touch.identifier;
    const off = getOffset(touch);
    setPos(off);
    onChange({ x: off.x / maxDist, y: -off.y / maxDist });
  }, [getOffset, maxDist, onChange]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouch.current) {
        const off = getOffset(e.changedTouches[i]);
        setPos(off);
        onChange({ x: off.x / maxDist, y: -off.y / maxDist });
        break;
      }
    }
  }, [getOffset, maxDist, onChange]);

  const handleTouchEnd = useCallback((e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouch.current) {
        activeTouch.current = null;
        setPos({ x: 0, y: 0 });
        onChange({ x: 0, y: 0 });
        break;
      }
    }
  }, [onChange]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);
    el.addEventListener('touchcancel', handleTouchEnd);
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const isLeft = side === 'left';

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        bottom: 30,
        [isLeft ? 'left' : 'right']: 30,
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.12)',
        border: '2px solid rgba(255, 255, 255, 0.25)',
        zIndex: 100,
        touchAction: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Thumb */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.5)',
          border: '2px solid rgba(255, 255, 255, 0.7)',
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          transition: pos.x === 0 && pos.y === 0 ? 'transform 0.15s ease-out' : 'none',
          pointerEvents: 'none',
        }}
      />
      {/* Label */}
      <span style={{
        position: 'absolute',
        top: -20,
        fontSize: 11,
        color: 'rgba(255,255,255,0.5)',
        fontFamily: 'monospace',
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        {label}
      </span>
    </div>
  );
}
