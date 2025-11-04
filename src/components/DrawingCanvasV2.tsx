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

interface DrawingCanvasProps {
  socket: Socket | null;
  targetAudience: string;
  swarmId: string;
  onSend?: () => void;
  onStatusChange?: (status: string) => void;
}

export default function DrawingCanvasV2({ socket, targetAudience, swarmId, onSend, onStatusChange }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [canvasKey, setCanvasKey] = useState(0); // Use counter to force redraw on resize
  const currentPathRef = useRef<Point[]>([]); // Store current path without triggering re-renders
  const isDrawingRef = useRef(false);
  
  // Drawing settings
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(4); // Default to Medium

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

  // Redraw canvas whenever paths change or canvas is reinitialized
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
  }, [paths, canvasKey]);

  // Update status when paths change
  useEffect(() => {
    if (onStatusChange) {
      if (paths.length === 0) {
        onStatusChange('✏️ Start drawing on the canvas');
      } else {
        onStatusChange(`📝 ${paths.length} stroke${paths.length > 1 ? 's' : ''} drawn`);
      }
    }
  }, [paths.length, onStatusChange]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Ctrl+Z or Cmd+Z = Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (paths.length > 0) {
          const newPaths = paths.slice(0, -1);
          setPaths(newPaths);
        }
        return;
      }
      
      // Backspace or Delete = Clear (only if canvas has strokes)
      if ((e.key === 'Backspace' || e.key === 'Delete') && paths.length > 0) {
        e.preventDefault();
        setPaths([]);
        currentPathRef.current = [];
        return;
      }
      
      // Enter = Send drawing (only if canvas has strokes and socket is connected)
      if (e.key === 'Enter' && paths.length > 0 && socket && socket.connected) {
        e.preventDefault();
        const canvas = canvasRef.current;
        if (canvas) {
          const imageData = canvas.toDataURL('image/png');
          console.log('📤 Sending drawing via Enter key');
          socket.emit('send-drawing', {
            swarmId: swarmId,
            target: targetAudience,
            imageData: imageData,
            timestamp: Date.now()
          });
          onSend?.();
          setPaths([]);
          currentPathRef.current = [];
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paths, socket, swarmId, targetAudience, onSend]);

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
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    
    isDrawingRef.current = true;
    setIsDrawing(true);
    const point = getCoordinates(e.nativeEvent);
    currentPathRef.current = [point];
    
    // Start drawing path
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawingRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    
    const point = getCoordinates(e.nativeEvent);
    currentPathRef.current.push(point);
    
    // Draw immediately to canvas without waiting for state update
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  };

  const endDrawing = () => {
    if (isDrawingRef.current && currentPathRef.current.length > 0) {
      // Save the completed path to state
      setPaths(prev => [...prev, { 
        points: [...currentPathRef.current], 
        color: color, 
        width: lineWidth 
      }]);
      currentPathRef.current = [];
    }
    isDrawingRef.current = false;
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

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath([]);
    // The useEffect will handle redrawing (with empty paths)
  };

  const undo = () => {
    if (paths.length > 0) {
      const newPaths = paths.slice(0, -1);
      setPaths(newPaths);
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
    
    console.log('📤 Sending drawing to', targetAudience, `(${Math.round(imageData.length / 1024)}KB)`);
    
    // Send via socket
    socket.emit('send-drawing', {
      swarmId: swarmId,
      target: targetAudience,
      imageData: imageData,
      timestamp: Date.now()
    });
    
    // Call onSend callback if provided
    onSend?.();
    
    // Clear canvas after sending
    clearCanvas();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '100%', gap: '10px' }}>
      {/* Tool Selection */}
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
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
        
        {/* Line Width Selector */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <label style={{ color: 'white', fontSize: '0.9rem', fontWeight: '600' }}>Thickness:</label>
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
            width: 'min(100%, calc(100vh - 300px))',
            height: 'min(100%, calc(100vh - 300px))',
            aspectRatio: '1 / 1',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            touchAction: 'none',
            cursor: 'crosshair',
            background: '#fff'
          }}
        />
      </div>
      
      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        <button onClick={undo} disabled={paths.length === 0} style={{
          ...buttonStyle,
          background: paths.length === 0 ? '#555' : '#667eea',
          opacity: paths.length === 0 ? 0.5 : 1
        }} title="Undo last stroke (Ctrl+Z)">
          ↶ Undo
        </button>
        <button onClick={clearCanvas} disabled={paths.length === 0} style={{
          ...buttonStyle,
          background: paths.length === 0 ? '#555' : '#f44336',
          opacity: paths.length === 0 ? 0.5 : 1
        }} title="Clear canvas (Backspace/Delete)">
          🗑️ Clear
        </button>
        <button 
          onClick={sendDrawing} 
          disabled={paths.length === 0 || !socket || !socket.connected}
          style={{
            ...buttonStyle,
            background: (paths.length === 0 || !socket || !socket.connected) ? '#555' : '#4CAF50',
            opacity: (paths.length === 0 || !socket || !socket.connected) ? 0.5 : 1,
            flex: 1,
            fontSize: '1.1rem'
          }}
          title="Send drawing to all groups (Enter)"
        >
          📤 Send Drawing
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

