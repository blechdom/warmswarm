'use client';

import { useState, useRef, useEffect } from 'react';
import { Socket } from 'socket.io-client';

interface Point {
  x: number;
  y: number;
}

interface PathData {
  points: Point[];
  color: string;
  width: number;
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

interface DrawingCanvasProps {
  socket: Socket | null;
  targetAudience: string;
  swarmId: string;
  onSend?: () => void;
  onStatusChange?: (status: string) => void;
}

export default function DrawingCanvasContinuous({ socket, targetAudience, swarmId, onSend, onStatusChange }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [texts, setTexts] = useState<TextData[]>([]);
  const [canvasKey, setCanvasKey] = useState(0); // Use counter to force redraw on resize
  
  // Drawing settings
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(4); // Default to Medium
  
  // Text mode
  const [isTextMode, setIsTextMode] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [textPosition, setTextPosition] = useState<Point | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
  const [isBold, setIsBold] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Available colors and sizes
  const colors = [
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Blue', value: '#2563eb' },
    { name: 'Green', value: '#16a34a' },
    { name: 'Yellow', value: '#facc15' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Purple', value: '#9333ea' },
    { name: 'Pink', value: '#ec4899' },
  ];

  const lineWidths = [
    { name: 'Thin', value: 2 },
    { name: 'Medium', value: 4 },
    { name: 'Thick', value: 8 },
    { name: 'Extra Thick', value: 12 },
    { name: 'Very Thick', value: 18 },
    { name: 'Super Thick', value: 24 },
  ];

  const fonts = [
    { name: 'Sans-Serif', value: 'sans-serif' },
    { name: 'Serif', value: 'serif' },
  ];

  // Initialize canvas dimensions once on mount and on resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const initCanvas = () => {
      // Set canvas resolution for retina displays
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      // Make sure we have valid dimensions
      if (rect.width === 0 || rect.height === 0) return;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Fill canvas with white background (use display size, not scaled)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, rect.width, rect.height);
      }
      
      setCanvasKey(prev => prev + 1); // Trigger redraw
    };

    // Initial setup with a slight delay to ensure CSS has been applied
    const timeoutId = setTimeout(initCanvas, 100);

    // Watch for canvas size changes
    const resizeObserver = new ResizeObserver(() => {
      initCanvas();
    });
    resizeObserver.observe(canvas);

    // Also listen for window resize
    window.addEventListener('resize', initCanvas);
    
    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', initCanvas);
    };
  }, []);

  // Redraw canvas whenever paths, currentPath, texts, or canvas is reinitialized
  useEffect(() => {
    if (canvasKey === 0) return; // Wait for initial setup
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    
    // Clear the entire canvas (use canvas dimensions, not rect dimensions)
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Fill with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    // Redraw all completed paths (each with its own color and width)
    redrawCanvas(ctx, paths);
    
    // Draw all text elements
    redrawTexts(ctx, texts);
    
    // Draw current path being drawn (with current color and width)
    if (currentPath.length > 0) {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
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
      
      // Draw text if any
      if (currentText) {
        ctx.fillText(currentText, textPosition.x, textPosition.y);
      }
      
      // Draw blinking cursor
      if (cursorVisible) {
        const textWidth = currentText ? ctx.measureText(currentText).width : 0;
        ctx.fillRect(textPosition.x + textWidth, textPosition.y - lineWidth * 2, 2, lineWidth * 3);
      }
    }
  }, [paths, currentPath, texts, currentText, textPosition, isTyping, canvasKey, color, lineWidth, fontFamily, isBold, cursorVisible]);

  // Blinking cursor effect
  useEffect(() => {
    if (!isTyping) return;
    
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500); // Blink every 500ms
    
    return () => clearInterval(interval);
  }, [isTyping]);

  // Update status when mode changes
  useEffect(() => {
    if (onStatusChange) {
      if (isTextMode) {
        onStatusChange('✍️ Continuous text mode - live typing');
      } else {
        onStatusChange('✏️ Continuous draw mode - auto-sends');
      }
    }
  }, [isTextMode, onStatusChange]);

  // Keyboard shortcuts and text input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Handle text input when in typing mode
      if (isTyping && textPosition) {
        if (e.key === 'Enter') {
          // Finish typing
          e.preventDefault();
          if (currentText.trim()) {
            setTexts(prev => [...prev, {
              text: currentText,
              x: textPosition.x,
              y: textPosition.y,
              color: color,
              fontSize: lineWidth * 3,
              fontFamily: fontFamily,
              isBold: isBold
            }]);
            
            // Auto-send the finalized text in continuous mode
            setTimeout(() => {
              const canvas = canvasRef.current;
              if (canvas && socket && socket.connected) {
                const imageData = canvas.toDataURL('image/png');
                socket.emit('send-drawing', {
                  swarmId: swarmId,
                  target: targetAudience,
                  imageData: imageData,
                  timestamp: Date.now()
                });
                onSend?.();
              }
            }, 10);
          }
          setCurrentText('');
          setTextPosition(null);
          setIsTyping(false);
          return;
        } else if (e.key === 'Escape') {
          // Cancel typing
          e.preventDefault();
          setCurrentText('');
          setTextPosition(null);
          setIsTyping(false);
          return;
        } else if (e.key === 'Backspace') {
          e.preventDefault();
          setCurrentText(prev => prev.slice(0, -1));
          
          // Auto-send canvas after backspace in continuous mode
          setTimeout(() => {
            const canvas = canvasRef.current;
            if (canvas && socket && socket.connected) {
              const imageData = canvas.toDataURL('image/png');
              socket.emit('send-drawing', {
                swarmId: swarmId,
                target: targetAudience,
                imageData: imageData,
                timestamp: Date.now()
              });
            }
          }, 10); // Small delay to allow re-render
          
          return;
        } else if (e.key.length === 1) {
          // Regular character
          e.preventDefault();
          setCurrentText(prev => prev + e.key);
          
          // Auto-send canvas after each character in continuous mode
          setTimeout(() => {
            const canvas = canvasRef.current;
            if (canvas && socket && socket.connected) {
              const imageData = canvas.toDataURL('image/png');
              socket.emit('send-drawing', {
                swarmId: swarmId,
                target: targetAudience,
                imageData: imageData,
                timestamp: Date.now()
              });
            }
          }, 10); // Small delay to allow re-render
          
          return;
        }
        return;
      }
      
      // Ctrl+Z or Cmd+Z = Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo(); // Use undo function which auto-sends
        return;
      }
      
      // Backspace or Delete = Clear (only if canvas has content)
      if ((e.key === 'Backspace' || e.key === 'Delete') && (paths.length > 0 || texts.length > 0)) {
        e.preventDefault();
        clearCanvas(); // Use clearCanvas function which auto-sends
        return;
      }
      
      // Ctrl+Enter = Manually resend current drawing (continuous mode)
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && (paths.length > 0 || texts.length > 0) && socket && socket.connected) {
        e.preventDefault();
        sendDrawing();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paths, texts, currentText, textPosition, isTyping, color, lineWidth, socket, swarmId, targetAudience, onSend]);

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
    
    // If in text mode
    if (isTextMode) {
      // If already typing, finish current text first
      if (isTyping && currentText.trim()) {
        setTexts(prev => [...prev, {
          text: currentText,
          x: textPosition!.x,
          y: textPosition!.y,
          color: color,
          fontSize: lineWidth * 3,
          fontFamily: fontFamily,
          isBold: isBold
        }]);
        
        // Auto-send the finalized text in continuous mode
        setTimeout(() => {
          const canvas = canvasRef.current;
          if (canvas && socket && socket.connected) {
            const imageData = canvas.toDataURL('image/png');
            socket.emit('send-drawing', {
              swarmId: swarmId,
              target: targetAudience,
              imageData: imageData,
              timestamp: Date.now()
            });
            onSend?.();
          }
        }, 10);
      }
      
      // Start new text at click position
      const point = getCoordinates(e.nativeEvent);
      setTextPosition(point);
      setCurrentText('');
      setIsTyping(true);
      return;
    }
    
    setIsDrawing(true);
    const point = getCoordinates(e.nativeEvent);
    setCurrentPath([point]);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || isTextMode) return;
    
    const point = getCoordinates(e.nativeEvent);
    setCurrentPath(prev => [...prev, point]);
  };

  const endDrawing = () => {
    if (isDrawing && currentPath.length > 0) {
      const newPath = { points: currentPath, color: color, width: lineWidth };
      setPaths([...paths, newPath]);
      setCurrentPath([]);
      
      // Automatically send the completed stroke immediately (continuous mode)
      if (socket && socket.connected) {
        const canvas = canvasRef.current;
        if (canvas) {
          const imageData = canvas.toDataURL('image/png');
          console.log('📤 Auto-sending stroke to', targetAudience);
          socket.emit('send-drawing', {
            swarmId: swarmId,
            target: targetAudience,
            imageData: imageData,
            timestamp: Date.now()
          });
          onSend?.();
        }
      }
    }
    setIsDrawing(false);
  };

  const redrawCanvas = (ctx: CanvasRenderingContext2D, allPaths: PathData[]) => {
    // Redraw each path with its original color and width
    allPaths.forEach(pathData => {
      if (pathData.points.length < 2) return;
      
      ctx.strokeStyle = pathData.color;
      ctx.lineWidth = pathData.width;
      ctx.beginPath();
      ctx.moveTo(pathData.points[0].x, pathData.points[0].y);
      
      for (let i = 1; i < pathData.points.length; i++) {
        ctx.lineTo(pathData.points[i].x, pathData.points[i].y);
      }
      ctx.stroke();
    });
  };

  const redrawTexts = (ctx: CanvasRenderingContext2D, allTexts: TextData[]) => {
    // Redraw each text with its original properties
    allTexts.forEach(textData => {
      ctx.fillStyle = textData.color;
      const fontWeight = textData.isBold ? 'bold' : 'normal';
      ctx.font = `${fontWeight} ${textData.fontSize}px ${textData.fontFamily}`;
      ctx.fillText(textData.text, textData.x, textData.y);
    });
  };

  const clearCanvas = () => {
    setPaths([]);
    setTexts([]);
    setCurrentPath([]);
    setCurrentText('');
    setTextPosition(null);
    setIsTyping(false);
    
    // Send cleared canvas immediately (continuous mode)
    if (socket && socket.connected) {
      const canvas = canvasRef.current;
      if (canvas) {
        // Wait a tick for the canvas to clear, then send
        setTimeout(() => {
          const imageData = canvas.toDataURL('image/png');
          console.log('📤 Sending cleared canvas');
          socket.emit('send-drawing', {
            swarmId: swarmId,
            target: targetAudience,
            imageData: imageData,
            timestamp: Date.now()
          });
        }, 50);
      }
    }
  };

  const undo = () => {
    // Undo last item (either path or text)
    if (texts.length > 0) {
      // Remove last text
      setTexts(prev => prev.slice(0, -1));
    } else if (paths.length > 0) {
      // Remove last path
      setPaths(prev => prev.slice(0, -1));
    }
    
    // Send updated canvas after undo (continuous mode)
    if (socket && socket.connected) {
      const canvas = canvasRef.current;
      if (canvas) {
        setTimeout(() => {
          const imageData = canvas.toDataURL('image/png');
          console.log('📤 Sending after undo');
          socket.emit('send-drawing', {
            swarmId: swarmId,
            target: targetAudience,
            imageData: imageData,
            timestamp: Date.now()
          });
        }, 50);
      }
    }
  };

  const sendDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas || !socket) {
      console.error('❌ Cannot send: canvas or socket missing', { canvas: !!canvas, socket: !!socket });
      return;
    }
    
    if (!socket.connected) {
      console.error('❌ Socket not connected!');
      return;
    }
    
    // Convert canvas to base64 image (PNG for better quality with white background)
    const imageData = canvas.toDataURL('image/png');
    
    console.log('📤 Manually sending drawing to', targetAudience, `(${Math.round(imageData.length / 1024)}KB)`);
    
    // Send via socket
    socket.emit('send-drawing', {
      swarmId: swarmId,
      target: targetAudience,
      imageData: imageData,
      timestamp: Date.now()
    });
    
    // Call onSend callback if provided
    onSend?.();
    
    // DO NOT clear canvas after sending in continuous mode
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '100%', gap: '10px' }}>
      {/* Tool Selection */}
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Mode Toggle */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '3px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px' }}>
          <button
            onClick={() => setIsTextMode(false)}
            title="Draw Mode"
            style={{
              padding: '6px 12px',
              background: !isTextMode ? 'rgba(59, 130, 246, 0.9)' : 'rgba(255,255,255,0.1)',
              border: !isTextMode ? '2px solid white' : '1px solid rgba(255,255,255,0.2)',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '40px',
              boxShadow: !isTextMode ? '0 0 8px rgba(59, 130, 246, 0.5)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            🖌️
          </button>
          <button
            onClick={() => setIsTextMode(true)}
            title="Text Mode"
            style={{
              padding: '6px 12px',
              background: isTextMode ? 'rgba(168, 85, 247, 0.9)' : 'rgba(255,255,255,0.1)',
              border: isTextMode ? '2px solid white' : '1px solid rgba(255,255,255,0.2)',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '40px',
              boxShadow: isTextMode ? '0 0 8px rgba(168, 85, 247, 0.5)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Aa
          </button>
        </div>
        
        {/* Color Picker */}
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
                transition: 'all 0.2s'
              }}
            />
          ))}
        </div>
        
        {/* Font Selector (Text Mode Only) */}
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
                  fontSize: '0.85rem',
                  fontWeight: '600'
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
                fontSize: '0.9rem'
              }}
              title="Toggle bold"
            >
              B
            </button>
          </>
        )}
        
        {/* Line Width / Font Size Selector */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <label style={{ color: 'white', fontSize: '0.9rem', fontWeight: '600' }}>
            {isTextMode ? 'Size:' : 'Thickness:'}
          </label>
          {lineWidths.map(w => (
            <button
              key={w.value}
              onClick={() => setLineWidth(w.value)}
              title={w.name}
              style={{
                width: '40px',
                height: '32px',
                borderRadius: '6px',
                background: lineWidth === w.value ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                border: lineWidth === w.value ? '2px solid white' : '1px solid rgba(255,255,255,0.3)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                width: '24px',
                height: `${w.value}px`,
                background: 'white',
                borderRadius: '2px'
              }} />
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div style={{ 
        flex: 1,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 0,
        minWidth: 0,
        position: 'relative'
      }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          style={{
            width: 'auto',
            height: 'auto',
            maxWidth: '100%',
            maxHeight: '100%',
            aspectRatio: '1',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            touchAction: 'none',
            cursor: isTextMode ? 'text' : 'crosshair',
            background: '#fff'
          }}
        />
        {isTyping && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '0.85rem'
          }}>
            Type text • Enter to finish • Esc to cancel
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        <button onClick={undo} disabled={paths.length === 0 && texts.length === 0} style={{
          ...buttonStyle,
          background: (paths.length === 0 && texts.length === 0) ? '#555' : '#667eea',
          opacity: (paths.length === 0 && texts.length === 0) ? 0.5 : 1
        }} title="Undo last item (Ctrl+Z)">
          ↶ Undo
        </button>
        <button onClick={clearCanvas} disabled={paths.length === 0 && texts.length === 0} style={{
          ...buttonStyle,
          background: (paths.length === 0 && texts.length === 0) ? '#555' : '#f44336',
          opacity: (paths.length === 0 && texts.length === 0) ? 0.5 : 1
        }} title="Clear canvas (Backspace/Delete)">
          🗑️ Clear
        </button>
        <button 
          onClick={sendDrawing} 
          disabled={(paths.length === 0 && texts.length === 0) || !socket || !socket.connected}
          style={{
            ...buttonStyle,
            background: ((paths.length === 0 && texts.length === 0) || !socket || !socket.connected) ? '#555' : '#4CAF50',
            opacity: ((paths.length === 0 && texts.length === 0) || !socket || !socket.connected) ? 0.5 : 1,
            flex: 1,
            fontSize: '1.1rem'
          }}
          title="Manually resend current drawing (auto-sends on each change)"
        >
          🔄 Resend Canvas
          {socket && !socket.connected && ' (Connecting...)'}
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: '12px 20px',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '8px',
  color: 'white',
  cursor: 'pointer',
  fontWeight: '600' as const,
  transition: 'all 0.2s'
};


