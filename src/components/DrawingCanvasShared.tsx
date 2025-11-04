'use client';

import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import styled from 'styled-components';

interface DrawingCanvasSharedProps {
  socket: Socket | null;
  swarmId: string;
  onStatusChange?: (status: string) => void;
}

interface Point {
  x: number;
  y: number;
}

interface PathData {
  points: Point[];
  color: string;
  lineWidth: number;
}

interface TextData {
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
  fontFamily: string;
  isBold: boolean;
}

const CanvasWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ToolBar = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

export default function DrawingCanvasShared({ socket, swarmId, onStatusChange }: DrawingCanvasSharedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseImageRef = useRef<HTMLImageElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const currentPathRef = useRef<Point[]>([]);
  const isDrawingRef = useRef(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(4);
  const [canvasKey, setCanvasKey] = useState(0);
  
  // Text mode
  const [isTextMode, setIsTextMode] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [textPosition, setTextPosition] = useState<Point | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
  const [isBold, setIsBold] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  const colors = [
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Blue', value: '#2563eb' },
    { name: 'Green', value: '#16a34a' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Purple', value: '#9333ea' },
    { name: 'Orange', value: '#ea580c' },
    { name: 'Pink', value: '#ec4899' },
  ];

  const sizes = [
    { value: 2 },
    { value: 4 },
    { value: 8 },
    { value: 12 },
  ];

  const fonts = [
    { name: 'Sans-Serif', value: 'sans-serif' },
    { name: 'Serif', value: 'serif' },
  ];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      const size = Math.min(container.clientWidth, container.clientHeight);
      canvas.width = size;
      canvas.height = size;
      
      // Redraw after resize
      setCanvasKey(prev => prev + 1);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Listen for incoming drawings from others
  useEffect(() => {
    if (!socket) return;

    const handleReceiveDrawing = (data: { imageData: string, senderId: string }) => {
      console.log('📥 Received drawing from:', data.senderId, 'My ID:', socket.id);
      
      // Apply all drawings including our own (server broadcasts to everyone)
      const img = new Image();
      img.onload = () => {
        baseImageRef.current = img;
        
        // Clear current path and refs since it's now in the base image
        currentPathRef.current = [];
        setCurrentPath([]);
        
        setCanvasKey(prev => prev + 1); // Trigger redraw
      };
      img.src = data.imageData;
    };

    const handleInitialState = (states: Record<string, { imageData: string }>) => {
      console.log('📥 Received initial canvas state');
      if (states.shared) {
        const img = new Image();
        img.onload = () => {
          baseImageRef.current = img;
          setCanvasKey(prev => prev + 1); // Trigger redraw
        };
        img.src = states.shared.imageData;
      }
    };

    socket.on('receive-drawing', handleReceiveDrawing);
    socket.on('initial-canvas-states', handleInitialState);

    return () => {
      socket.off('receive-drawing', handleReceiveDrawing);
      socket.off('initial-canvas-states', handleInitialState);
    };
  }, [socket, isDrawing, isTyping]);

  // Redraw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw base image (shared canvas from server)
    if (baseImageRef.current) {
      ctx.drawImage(baseImageRef.current, 0, 0, canvas.width, canvas.height);
    }

    // Draw current path being drawn
    if (currentPath.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y);
      }
      ctx.stroke();
    }

    // Draw current text being typed
    if (isTyping && textPosition) {
      ctx.fillStyle = color;
      const fontWeight = isBold ? 'bold' : 'normal';
      ctx.font = `${fontWeight} ${lineWidth * 3}px ${fontFamily}`;
      
      if (currentText) {
        ctx.fillText(currentText, textPosition.x, textPosition.y);
      }
      
      if (cursorVisible) {
        const textWidth = currentText ? ctx.measureText(currentText).width : 0;
        ctx.fillRect(textPosition.x + textWidth, textPosition.y - lineWidth * 2, 2, lineWidth * 3);
      }
    }
  }, [currentPath, currentText, textPosition, isTyping, canvasKey, color, lineWidth, fontFamily, isBold, cursorVisible]);

  // Blinking cursor
  useEffect(() => {
    if (!isTyping) return;
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, [isTyping]);

  // Send canvas to server
  const sendCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !socket || !socket.connected) return;

    const imageData = canvas.toDataURL('image/png');
    console.log('📤 Sending canvas to server, socket connected:', socket.connected, 'socket ID:', socket.id);
    socket.emit('send-drawing', {
      swarmId: swarmId,
      target: 'all',
      imageData: imageData,
      timestamp: Date.now()
    });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (isTextMode && isTyping) {
        if (e.key === 'Enter') {
          e.preventDefault();
          // Finish text and send
          if (currentText.trim() && textPosition) {
            // First, render the text to the canvas
            const canvas = canvasRef.current;
            if (canvas) {
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.fillStyle = color;
                const fontWeight = isBold ? 'bold' : 'normal';
                ctx.font = `${fontWeight} ${lineWidth * 3}px ${fontFamily}`;
                ctx.fillText(currentText, textPosition.x, textPosition.y);
              }
            }
            
            // Then clear the typing state and send
            setIsTyping(false);
            setCurrentText('');
            setTextPosition(null);
            setTimeout(() => sendCanvas(), 10);
          }
        } else if (e.key === 'Escape') {
          setCurrentText('');
          setTextPosition(null);
          setIsTyping(false);
        } else if (e.key === 'Backspace') {
          e.preventDefault();
          setCurrentText(prev => prev.slice(0, -1));
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          setCurrentText(prev => prev + e.key);
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTextMode, isTyping, currentText, textPosition, color, lineWidth, fontFamily, isBold]);

  const getCoordinates = (e: MouseEvent | TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    if (isTextMode) {
      if (isTyping && currentText.trim()) {
        // Finish previous text: render it to canvas first
        const canvas = canvasRef.current;
        if (canvas && textPosition) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = color;
            const fontWeight = isBold ? 'bold' : 'normal';
            ctx.font = `${fontWeight} ${lineWidth * 3}px ${fontFamily}`;
            ctx.fillText(currentText, textPosition.x, textPosition.y);
          }
        }
        
        // Clear typing state and send
        setIsTyping(false);
        setCurrentText('');
        setTextPosition(null);
        setTimeout(() => {
          sendCanvas();
          // Then start new text
          const point = getCoordinates(e.nativeEvent);
          setTextPosition(point);
          setCurrentText('');
          setIsTyping(true);
        }, 20);
      } else {
        const point = getCoordinates(e.nativeEvent);
        setTextPosition(point);
        setCurrentText('');
        setIsTyping(true);
      }
      return;
    }

    setIsDrawing(true);
    isDrawingRef.current = true;
    const point = getCoordinates(e.nativeEvent);
    currentPathRef.current = [point];
    setCurrentPath([point]);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawingRef.current || isTextMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const point = getCoordinates(e.nativeEvent);
    currentPathRef.current.push(point);
    
    // Draw directly to canvas for immediate feedback
    if (currentPathRef.current.length > 1) {
      const prevPoint = currentPathRef.current[currentPathRef.current.length - 2];
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
    
    // Update state for React render (less frequently)
    setCurrentPath([...currentPathRef.current]);
  };

  const stopDrawing = () => {
    if (isDrawingRef.current && currentPathRef.current.length > 0) {
      setIsDrawing(false);
      isDrawingRef.current = false;
      // Send immediately - DON'T clear the path yet, wait for server response
      setTimeout(() => {
        sendCanvas();
      }, 10);
    } else {
      setIsDrawing(false);
      isDrawingRef.current = false;
    }
  };

  const clearCanvas = () => {
    baseImageRef.current = null;
    setCurrentPath([]);
    setCurrentText('');
    setTextPosition(null);
    setIsTyping(false);
    setCanvasKey(prev => prev + 1);
    // Send the cleared canvas
    setTimeout(() => sendCanvas(), 10);
  };

  return (
    <CanvasWrapper>
      <ToolBar>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '4px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
          <button
            onClick={() => setIsTextMode(false)}
            style={{
              padding: '8px 16px',
              background: !isTextMode ? 'rgba(59, 130, 246, 0.9)' : 'rgba(255,255,255,0.1)',
              border: !isTextMode ? '2px solid white' : '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: !isTextMode ? '700' : '500',
              fontSize: '0.9rem',
              minWidth: '90px',
              boxShadow: !isTextMode ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            ✏️ Draw
          </button>
          <button
            onClick={() => setIsTextMode(true)}
            style={{
              padding: '8px 16px',
              background: isTextMode ? 'rgba(168, 85, 247, 0.9)' : 'rgba(255,255,255,0.1)',
              border: isTextMode ? '2px solid white' : '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: isTextMode ? '700' : '500',
              fontSize: '0.9rem',
              minWidth: '90px',
              boxShadow: isTextMode ? '0 0 10px rgba(168, 85, 247, 0.5)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            ✍️ Text
          </button>
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <label style={{ color: 'white', fontSize: '0.9rem', fontWeight: '600' }}>Color:</label>
          {colors.map(c => (
            <button
              key={c.value}
              onClick={() => setColor(c.value)}
              title={c.name}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: c.value,
                border: color === c.value ? '3px solid white' : '2px solid rgba(255,255,255,0.3)',
                cursor: 'pointer',
                boxShadow: color === c.value ? '0 0 8px rgba(255,255,255,0.6)' : 'none',
              }}
            />
          ))}
        </div>

        {isTextMode && (
          <>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <label style={{ color: 'white', fontSize: '0.9rem', fontWeight: '600' }}>Font:</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                style={{
                  padding: '6px 10px',
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                {fonts.map(font => (
                  <option key={font.value} value={font.value} style={{ background: '#667eea', color: 'white' }}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsBold(!isBold)}
              style={{
                padding: '6px 14px',
                background: isBold ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                border: isBold ? '2px solid white' : '1px solid rgba(255,255,255,0.3)',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              B
            </button>
          </>
        )}

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <label style={{ color: 'white', fontSize: '0.9rem', fontWeight: '600' }}>Size:</label>
          {sizes.map(s => (
            <button
              key={s.value}
              onClick={() => setLineWidth(s.value)}
              title={`${s.value}px`}
              style={{
                width: '32px',
                height: '32px',
                background: lineWidth === s.value ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                border: lineWidth === s.value ? '2px solid white' : '1px solid rgba(255,255,255,0.3)',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div style={{
                width: `${s.value * 2}px`,
                height: `${s.value * 2}px`,
                borderRadius: '50%',
                background: 'white'
              }} />
            </button>
          ))}
        </div>

        <button
          onClick={clearCanvas}
          style={{
            padding: '8px 16px',
            background: 'rgba(220, 38, 38, 0.8)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '6px',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '600',
            marginLeft: 'auto'
          }}
        >
          🗑️ Clear
        </button>
      </ToolBar>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '8px',
            cursor: isTextMode ? 'text' : 'crosshair',
            touchAction: 'none',
            background: 'white',
            margin: '0 auto',
          }}
        />
      </div>
    </CanvasWrapper>
  );
}

