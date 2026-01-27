import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  MdCamera,
  MdFileUpload,
  MdFlipCameraAndroid,
  MdVideocam,
  MdStop,
  MdPlayArrow,
  MdCheck,
  MdCrop,
  MdZoomIn,
  MdZoomOut,
  MdRotateRight,
  MdRotateLeft,
  MdTextFields,
  MdOutlineSquare,
  MdOutlineCircle,
  MdArrowRightAlt,
  MdOutlineHorizontalRule,
  MdClose,
  MdUndo,
  MdRedo,
  MdDownload,
  MdBrush,
  MdCircle,
  MdSquare,
} from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';

export default function WhatsAppCamera() {
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [mode, setMode] = useState("photo");

  const handleImageCaptured = (imageUrl) => {
    setCapturedImages([...capturedImages, {
      url: imageUrl,
      type: mode,
      timestamp: new Date().toLocaleString()
    }]);
    setCameraModalOpen(false);
  };

  const clearAllImages = () => {
    setCapturedImages([]);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f9fafb, #ffffff)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '3rem',
        maxWidth: '800px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '1rem',
          letterSpacing: '-0.025em'
        }}>
          WhatsApp Image Editor
        </h1>
        <p style={{
          color: '#4b5563',
          fontSize: '1.125rem',
          maxWidth: '48rem',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Capture, edit and annotate images with WhatsApp-like editing features
        </p>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        width: '100%',
        maxWidth: '72rem'
      }}>
        {/* Camera Control Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          width: '100%',
          maxWidth: '600px'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            Capture & Edit Media
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <button
              onClick={() => {
                setMode("photo");
                setCameraModalOpen(true);
              }}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              <MdCamera size={32} />
              <span>Take & Edit Photo</span>
            </button>

            <button
              onClick={() => {
                setMode("video");
                setCameraModalOpen(true);
              }}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              <MdVideocam size={32} />
              <span>Record Video</span>
            </button>
          </div>

          {capturedImages.length > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              <button
                onClick={clearAllImages}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Gallery Section */}
        {capturedImages.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            padding: '2rem',
            width: '100%'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              Captured Media ({capturedImages.length})
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              {capturedImages.map((item, index) => (
                <div
                  key={index}
                  style={{
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#f9fafb'
                  }}
                >
                  {item.type === 'photo' ? (
                    <img
                      src={item.url}
                      alt={`Capture ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <video
                      src={item.url}
                      controls
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover'
                      }}
                    />
                  )}
                  <div style={{
                    padding: '1rem',
                    borderTop: '1px solid #e5e7eb'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: item.type === 'photo' ? '#10b981' : '#3b82f6'
                      }}>
                        {item.type === 'photo' ? 'Photo' : 'Video'}
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }}>
                        {item.timestamp}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem'
                    }}>
                      <a
                        href={item.url}
                        download={`${item.type}_${index + 1}.${item.type === 'photo' ? 'png' : 'webm'}`}
                        style={{
                          flex: 1,
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          padding: '0.5rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          textAlign: 'center',
                          textDecoration: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                      >
                        Download
                      </a>
                      <button
                        onClick={() => {
                          const newImages = [...capturedImages];
                          newImages.splice(index, 1);
                          setCapturedImages(newImages);
                        }}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#fef2f2',
                          color: '#ef4444',
                          border: 'none',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#fee2e2'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#fef2f2'}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Back to Home Link */}
      <div style={{
        marginTop: '3rem',
        textAlign: 'center'
      }}>
        <Link
          to="/"
          style={{
            color: '#6b7280',
            textDecoration: 'none',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          ← Back to Home
        </Link>
      </div>

      {/* Camera Modal */}
      {cameraModalOpen && (
        <CameraModal
          isOpen={cameraModalOpen}
          onClose={() => setCameraModalOpen(false)}
          onImageCaptured={handleImageCaptured}
          mode={mode}
        />
      )}
    </div>
  );
}

// CameraModal Component - Combined features
function CameraModal({
  isOpen,
  onClose,
  onImageCaptured,
  mode = "photo",
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const containerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [devices, setDevices] = useState([]);
  const [imageToEdit, setImageToEdit] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);

  // Editor states
  const [isCropping, setIsCropping] = useState(false);
  const [cropRect, setCropRect] = useState({
    x: 0, y: 0, width: 0, height: 0
  });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [editorMode, setEditorMode] = useState('crop');
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);

  // Drawing states (from second code)
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#ff0000');
  const [drawTool, setDrawTool] = useState('pen'); // 'pen', 'arrow', 'circle', 'square', 'text'
  const [drawHistory, setDrawHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [startPoint, setStartPoint] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && mode === "photo") {
      const initializeCamera = async () => {
        try {
          const constraints = {
            video: { facingMode: "environment" }
          };

          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          setStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }

          const allDevices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = allDevices.filter(
            (device) => device.kind === "videoinput",
          );
          setDevices(videoDevices);
        } catch (err) {
          console.error("Camera initialization error:", err);
          // Fallback to user camera
          try {
            const fallbackStream = await navigator.mediaDevices.getUserMedia({
              video: true,
            });
            setStream(fallbackStream);
            if (videoRef.current) {
              videoRef.current.srcObject = fallbackStream;
            }
          } catch (fallbackErr) {
            console.error("Fallback camera error:", fallbackErr);
          }
        }
      };

      initializeCamera();
    } else if (isOpen && mode === "video") {
      initializeVideoRecorder();
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, mode]);

  const initializeVideoRecorder = async () => {
    try {
      const constraints = {
        video: true,
        audio: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(blob);
        setRecordedVideo(videoUrl);
        setPreview(videoUrl);
      };
    } catch (err) {
      console.error("Video recorder initialization error:", err);
    }
  };

  const startRecording = () => {
    if (mediaRecorderRef.current?.state === "inactive") {
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) return;
    
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/png");
    
    // Set image for editing
    setImageToEdit(dataUrl);
    setImageDimensions({ width: video.videoWidth, height: video.videoHeight });
    
    // Initialize crop rectangle
    const rectWidth = video.videoWidth * 0.8;
    const rectHeight = video.videoHeight * 0.8;
    setCropRect({
      x: (video.videoWidth - rectWidth) / 2,
      y: (video.videoHeight - rectHeight) / 2,
      width: rectWidth,
      height: rectHeight
    });
    
    setIsCropping(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (file.type.startsWith("image/")) {
        const img = new Image();
        img.onload = () => {
          setImageToEdit(ev.target.result);
          setImageDimensions({ width: img.width, height: img.height });
          
          const rectWidth = img.width * 0.8;
          const rectHeight = img.height * 0.8;
          setCropRect({
            x: (img.width - rectWidth) / 2,
            y: (img.height - rectHeight) / 2,
            width: rectWidth,
            height: rectHeight
          });
          
          setIsCropping(true);
        };
        img.src = ev.target.result;
      } else if (file.type.startsWith("video/")) {
        setPreview(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drawing functions (from second code)
  const getCanvasCoordinates = (e) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const img = new Image();
    img.src = imageToEdit;
    
    // Calculate scale to maintain aspect ratio
    const containerRatio = rect.width / rect.height;
    const imageRatio = img.width / img.height;
    
    let displayWidth, displayHeight, offsetX, offsetY;
    
    if (containerRatio > imageRatio) {
      // Container is wider than image
      displayHeight = rect.height;
      displayWidth = img.width * (rect.height / img.height);
      offsetX = (rect.width - displayWidth) / 2;
      offsetY = 0;
    } else {
      // Container is taller than image
      displayWidth = rect.width;
      displayHeight = img.height * (rect.width / img.width);
      offsetX = 0;
      offsetY = (rect.height - displayHeight) / 2;
    }
    
    // Convert mouse coordinates to image coordinates
    const scale = img.width / displayWidth;
    const x = (e.clientX - rect.left - offsetX) * scale;
    const y = (e.clientY - rect.top - offsetY) * scale;
    
    return { x, y };
  };

  const handleMouseDown = (e) => {
    if (editorMode !== 'draw' || drawTool === 'text') return;
    setIsDrawing(true);
    const coords = getCanvasCoordinates(e);
    setStartPoint(coords);
    
    if (drawTool === 'pen') {
      const canvas = drawingCanvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || editorMode !== 'draw') return;
    const coords = getCanvasCoordinates(e);
    const canvas = drawingCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (drawTool === 'pen') {
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing || editorMode !== 'draw') return;
    const coords = getCanvasCoordinates(e);
    const canvas = drawingCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.strokeStyle = drawColor;
    ctx.fillStyle = drawColor;
    ctx.lineWidth = 3;
    
    if (drawTool === 'arrow') {
      drawArrow(ctx, startPoint.x, startPoint.y, coords.x, coords.y);
    } else if (drawTool === 'circle') {
      const radius = Math.sqrt(Math.pow(coords.x - startPoint.x, 2) + Math.pow(coords.y - startPoint.y, 2));
      ctx.beginPath();
      ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (drawTool === 'square') {
      const width = coords.x - startPoint.x;
      const height = coords.y - startPoint.y;
      ctx.strokeRect(startPoint.x, startPoint.y, width, height);
    }
    
    setIsDrawing(false);
    saveDrawingState();
  };

  const drawArrow = (ctx, fromX, fromY, toX, toY) => {
    const headLength = 15;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
    ctx.lineTo(toX, toY);
    ctx.fill();
  };

  const handleCanvasClick = (e) => {
    if (editorMode !== 'draw' || drawTool !== 'text') return;
    const coords = getCanvasCoordinates(e);
    setTextPosition(coords);
  };

  const handleTextSubmit = () => {
    if (!textInput || !textPosition) return;
    
    const canvas = drawingCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = drawColor;
    ctx.font = '24px Arial';
    ctx.fillText(textInput, textPosition.x, textPosition.y);
    
    setTextInput('');
    setTextPosition(null);
    saveDrawingState();
  };

  const saveDrawingState = () => {
    const canvas = drawingCanvasRef.current;
    const newHistory = drawHistory.slice(0, historyStep + 1);
    newHistory.push(canvas.toDataURL());
    setDrawHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      restoreDrawingState(historyStep - 1);
    }
  };

  const handleRedo = () => {
    if (historyStep < drawHistory.length - 1) {
      setHistoryStep(historyStep + 1);
      restoreDrawingState(historyStep + 1);
    }
  };

  const restoreDrawingState = (step) => {
    const canvas = drawingCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = drawHistory[step];
  };

  const handleSaveImage = async () => {
    if (!imageToEdit) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.src = imageToEdit;
    
    await new Promise((resolve) => {
      img.onload = () => {
        // Set canvas size to cropped area
        canvas.width = cropRect.width;
        canvas.height = cropRect.height;
        
        // Apply rotation
        if (rotation !== 0) {
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(rotation * Math.PI / 180);
          ctx.translate(-canvas.width / 2, -canvas.height / 2);
        }
        
        // Draw cropped image
        ctx.drawImage(
          img,
          cropRect.x, cropRect.y, cropRect.width, cropRect.height,
          0, 0, canvas.width, canvas.height
        );
        
        if (rotation !== 0) {
          ctx.restore();
        }
        
        // Apply brightness
        ctx.filter = `brightness(${brightness}%)`;
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(canvas, 0, 0);
        
        // Draw annotations from drawing canvas
        if (drawingCanvasRef.current) {
          const drawCanvas = drawingCanvasRef.current;
          const drawCtx = drawCanvas.getContext('2d');
          
          // Create a temporary canvas for drawing transformations
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          tempCanvas.width = drawCanvas.width;
          tempCanvas.height = drawCanvas.height;
          
          // Copy drawing to temp canvas
          tempCtx.drawImage(drawCanvas, 0, 0);
          
          // Draw cropped portion of annotations
          ctx.drawImage(
            tempCanvas,
            cropRect.x, cropRect.y, cropRect.width, cropRect.height,
            0, 0, canvas.width, canvas.height
          );
        }
        
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          onImageCaptured(url);
          onClose();
        }, 'image/png');
        resolve();
      };
    });
  };

  const handleSaveVideo = () => {
    if (preview) {
      onImageCaptured(preview);
      onClose();
    }
  };

  const handleRotate = (degrees) => {
    setRotation(prev => (prev + degrees) % 360);
  };

  const resetStates = () => {
    setPreview(null);
    setImageToEdit(null);
    setIsCropping(false);
    setIsRecording(false);
    setRecordedVideo(null);
    setDrawHistory([]);
    setHistoryStep(-1);
    setRotation(0);
    setBrightness(100);
    setEditorMode('crop');
    setDrawColor('#ff0000');
    setDrawTool('pen');
    setTextInput('');
    setTextPosition(null);
  };

  const renderCropOverlay = () => {
    if (!containerRef.current || !imageDimensions.width) return null;
    
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = imageDimensions.width / rect.width;
    const scaleY = imageDimensions.height / rect.height;
    const scale = Math.min(scaleX, scaleY);
    
    const offsetX = (rect.width - imageDimensions.width / scale) / 2;
    const offsetY = (rect.height - imageDimensions.height / scale) / 2;
    
    const screenX = cropRect.x * scale + offsetX;
    const screenY = cropRect.y * scale + offsetY;
    const screenWidth = cropRect.width * scale;
    const screenHeight = cropRect.height * scale;
    
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          cursor: 'move'
        }}
        onMouseDown={(e) => {
          // Simple crop area adjustment - can be enhanced for drag handles
          const startX = e.clientX;
          const startY = e.clientY;
          const startCrop = { ...cropRect };
          
          const handleMouseMove = (moveEvent) => {
            const deltaX = (moveEvent.clientX - startX) / scale;
            const deltaY = (moveEvent.clientY - startY) / scale;
            
            setCropRect({
              x: Math.max(0, Math.min(imageDimensions.width - startCrop.width, startCrop.x + deltaX)),
              y: Math.max(0, Math.min(imageDimensions.height - startCrop.height, startCrop.y + deltaY)),
              width: startCrop.width,
              height: startCrop.height
            });
          };
          
          const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          };
          
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }}
      >
        {/* Semi-transparent overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }} />
        
        {/* Crop rectangle */}
        <div
          style={{
            position: 'absolute',
            left: `${screenX}px`,
            top: `${screenY}px`,
            width: `${screenWidth}px`,
            height: `${screenHeight}px`,
            border: '2px solid white',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
            boxSizing: 'border-box'
          }}
        >
          {/* Corner handles */}
          {['nw', 'ne', 'sw', 'se'].map((corner) => {
            const style = {
              position: 'absolute',
              width: '20px',
              height: '20px',
              backgroundColor: 'white',
              border: '2px solid #10b981',
              borderRadius: '2px'
            };
            
            if (corner === 'nw') {
              style.top = '-10px';
              style.left = '-10px';
              style.cursor = 'nw-resize';
            } else if (corner === 'ne') {
              style.top = '-10px';
              style.right = '-10px';
              style.cursor = 'ne-resize';
            } else if (corner === 'sw') {
              style.bottom = '-10px';
              style.left = '-10px';
              style.cursor = 'sw-resize';
            } else if (corner === 'se') {
              style.bottom = '-10px';
              style.right = '-10px';
              style.cursor = 'se-resize';
            }
            
            return (
              <div
                key={corner}
                style={style}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  const startX = e.clientX;
                  const startY = e.clientY;
                  const startCrop = { ...cropRect };
                  
                  const handleMouseMove = (moveEvent) => {
                    const deltaX = (moveEvent.clientX - startX) / scale;
                    const deltaY = (moveEvent.clientY - startY) / scale;
                    
                    let newWidth = startCrop.width;
                    let newHeight = startCrop.height;
                    let newX = startCrop.x;
                    let newY = startCrop.y;
                    
                    if (corner === 'nw') {
                      newWidth = Math.max(50, startCrop.width - deltaX);
                      newHeight = Math.max(50, startCrop.height - deltaY);
                      newX = startCrop.x + deltaX;
                      newY = startCrop.y + deltaY;
                    } else if (corner === 'ne') {
                      newWidth = Math.max(50, startCrop.width + deltaX);
                      newHeight = Math.max(50, startCrop.height - deltaY);
                      newY = startCrop.y + deltaY;
                    } else if (corner === 'sw') {
                      newWidth = Math.max(50, startCrop.width - deltaX);
                      newHeight = Math.max(50, startCrop.height + deltaY);
                      newX = startCrop.x + deltaX;
                    } else if (corner === 'se') {
                      newWidth = Math.max(50, startCrop.width + deltaX);
                      newHeight = Math.max(50, startCrop.height + deltaY);
                    }
                    
                    setCropRect({
                      x: Math.max(0, Math.min(imageDimensions.width - newWidth, newX)),
                      y: Math.max(0, Math.min(imageDimensions.height - newHeight, newY)),
                      width: newWidth,
                      height: newHeight
                    });
                  };
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              />
            );
          })}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (imageToEdit && editorMode === 'draw' && drawingCanvasRef.current) {
      const img = new Image();
      img.onload = () => {
        const canvas = drawingCanvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
        // Initialize with blank canvas
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        saveDrawingState();
      };
      img.src = imageToEdit;
    }
  }, [imageToEdit, editorMode]);

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20000
      }}
      onClick={() => {
        if (!isCropping && !textPosition) {
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          resetStates();
          onClose();
        }
      }}
    >
      <div 
        style={{
          backgroundColor: '#1f2937',
          borderRadius: '0.75rem',
          maxHeight: '95vh',
          overflow: 'auto',
          width: '95vw',
          maxWidth: '800px',
          zIndex: 20001
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          borderBottom: '1px solid #374151'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '700',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            margin: 0
          }}>
            {mode === "video" ? (
              <>
                <MdVideocam style={{ fontSize: "1.25rem" }} />
                <span>Record Video</span>
              </>
            ) : isCropping ? (
              <>
                <MdCrop style={{ fontSize: "1.25rem" }} />
                <span>Edit Image</span>
              </>
            ) : (
              <>
                <MdCamera style={{ fontSize: "1.25rem" }} />
                <span>Capture Photo</span>
              </>
            )}
          </h3>
          <button
            onClick={() => {
              if (stream) {
                stream.getTracks().forEach(track => track.stop());
              }
              resetStates();
              onClose();
            }}
            style={{
              background: "#374151",
              border: "none",
              fontSize: "1.25rem",
              color: "#9ca3af",
              cursor: "pointer",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#4b5563"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#374151"}
          >
            ×
          </button>
        </div>

        {/* Main Content Area */}
        <div style={{ 
          padding: '1rem',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {isCropping ? (
            <div 
              ref={containerRef}
              style={{ 
                position: "relative",
                width: "100%",
                height: "50vh",
                minHeight: "300px",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#000",
                marginBottom: "1rem"
              }}
              onMouseDown={editorMode === 'draw' ? handleMouseDown : undefined}
              onMouseMove={editorMode === 'draw' ? handleMouseMove : undefined}
              onMouseUp={editorMode === 'draw' ? handleMouseUp : undefined}
              onClick={editorMode === 'draw' ? handleCanvasClick : undefined}
            >
              <img
                src={imageToEdit}
                alt="Edit preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transform: `rotate(${rotation}deg)`,
                  filter: `brightness(${brightness}%)`
                }}
              />
              
              {editorMode === 'crop' && renderCropOverlay()}
              
              {/* Drawing Canvas Overlay */}
              {editorMode === 'draw' && (
                <canvas
                  ref={drawingCanvasRef}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    cursor: drawTool === 'text' ? 'text' : 'crosshair'
                  }}
                />
              )}
            </div>
          ) : preview ? (
            <div style={{
              position: "relative",
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "#000",
              marginBottom: "1rem",
              minHeight: "300px"
            }}>
              {mode === "photo" ? (
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "50vh",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              ) : (
                <video
                  src={preview}
                  controls
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "50vh",
                    objectFit: "contain",
                    display: "block"
                  }}
                />
              )}
            </div>
          ) : (
            <div style={{
              position: "relative",
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "#000",
              marginBottom: "1rem",
              minHeight: "300px"
            }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={mode === "video"}
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "50vh",
                  objectFit: "contain",
                  display: "block"
                }}
              />
              
              {mode === "photo" && devices.length > 1 && (
                <button
                  onClick={async () => {
                    if (stream) {
                      stream.getTracks().forEach(track => track.stop());
                    }
                    
                    const allDevices = await navigator.mediaDevices.enumerateDevices();
                    const videoDevices = allDevices.filter(
                      (device) => device.kind === "videoinput",
                    );
                    
                    const currentIndex = videoDevices.findIndex(
                      device => device.deviceId === stream?.getVideoTracks()[0]?.getSettings()?.deviceId
                    );
                    
                    const nextIndex = (currentIndex + 1) % videoDevices.length;
                    
                    try {
                      const newStream = await navigator.mediaDevices.getUserMedia({
                        video: { deviceId: { exact: videoDevices[nextIndex].deviceId } }
                      });
                      
                      setStream(newStream);
                      if (videoRef.current) {
                        videoRef.current.srcObject = newStream;
                      }
                    } catch (err) {
                      console.error("Error switching camera:", err);
                    }
                  }}
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    background: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    border: "none",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  title="Switch Camera"
                  onMouseOver={(e) => e.target.style.backgroundColor = "rgba(0, 0, 0, 0.8)"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "rgba(0, 0, 0, 0.6)"}
                >
                  <MdFlipCameraAndroid size={20} />
                </button>
              )}
              
              {mode === "photo" && !isCropping && (
                <div style={{
                  position: "absolute",
                  bottom: "20px",
                  left: 0,
                  right: 0,
                  display: "flex",
                  justifyContent: "center"
                }}>
                  <button
                    onClick={captureImage}
                    style={{
                      background: "white",
                      color: "#1f2937",
                      border: "4px solid #d1d5db",
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => e.target.style.transform = "scale(1.1)"}
                    onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                  >
                    <MdCamera size={28} />
                  </button>
                </div>
              )}
              
              {mode === "video" && (
                <div style={{
                  position: "absolute",
                  bottom: "20px",
                  left: 0,
                  right: 0,
                  display: "flex",
                  justifyContent: "center"
                }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        style={{
                          background: "#dc2626",
                          color: "white",
                          padding: "0.75rem 1.25rem",
                          borderRadius: "9999px",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
                        }}
                        onMouseOver={(e) => e.target.style.opacity = "0.9"}
                        onMouseOut={(e) => e.target.style.opacity = "1"}
                      >
                        <MdPlayArrow size={18} />
                        <span>Start Recording</span>
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        style={{
                          background: "#dc2626",
                          color: "white",
                          padding: "0.75rem 1.25rem",
                          borderRadius: "9999px",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: 'center',
                          gap: "0.5rem",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
                        }}
                        onMouseOver={(e) => e.target.style.opacity = "0.9"}
                        onMouseOut={(e) => e.target.style.opacity = "1"}
                      >
                        <MdStop size={18} />
                        <span>Stop Recording</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        </div>

        {/* Editor Controls */}
        {isCropping && (
          <div style={{
            padding: '1rem',
            borderTop: '1px solid #374151',
            backgroundColor: '#111827'
          }}>
            {/* Mode Selection */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <button
                onClick={() => setEditorMode('crop')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: editorMode === 'crop' ? '#10b981' : '#374151',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <MdCrop size={16} />
                Crop
              </button>
              
              <button
                onClick={() => setEditorMode('draw')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: editorMode === 'draw' ? '#10b981' : '#374151',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <MdBrush size={16} />
                Draw
              </button>
              
              <button
                onClick={() => setEditorMode('filter')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: editorMode === 'filter' ? '#10b981' : '#374151',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                Filter
              </button>
            </div>

            {/* Drawing Tools */}
            {editorMode === 'draw' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                {/* Drawing Tools Selection */}
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={() => setDrawTool('pen')}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: drawTool === 'pen' ? '#10b981' : '#374151',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <MdBrush size={20} />
                  </button>
                  <button
                    onClick={() => setDrawTool('arrow')}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: drawTool === 'arrow' ? '#10b981' : '#374151',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <FaArrowRight size={18} />
                  </button>
                  <button
                    onClick={() => setDrawTool('circle')}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: drawTool === 'circle' ? '#10b981' : '#374151',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <MdCircle size={20} />
                  </button>
                  <button
                    onClick={() => setDrawTool('square')}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: drawTool === 'square' ? '#10b981' : '#374151',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <MdSquare size={20} />
                  </button>
                  <button
                    onClick={() => setDrawTool('text')}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: drawTool === 'text' ? '#10b981' : '#374151',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <MdTextFields size={20} />
                  </button>
                </div>
                
                {/* Color Selection */}
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Color:</span>
                  {['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#ffffff', '#000000'].map(color => (
                    <button
                      key={color}
                      onClick={() => setDrawColor(color)}
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: color,
                        border: drawColor === color ? '2px solid #10b981' : '1px solid #6b7280',
                        borderRadius: '50%',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
                
                {/* Undo/Redo */}
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  justifyContent: 'center'
                }}>
                  <button
                    onClick={handleUndo}
                    disabled={historyStep <= 0}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: historyStep <= 0 ? '#4b5563' : '#374151',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: historyStep <= 0 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      opacity: historyStep <= 0 ? 0.5 : 1
                    }}
                  >
                    <MdUndo size={20} />
                    Undo
                  </button>
                  <button
                    onClick={handleRedo}
                    disabled={historyStep >= drawHistory.length - 1}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: historyStep >= drawHistory.length - 1 ? '#4b5563' : '#374151',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: historyStep >= drawHistory.length - 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      opacity: historyStep >= drawHistory.length - 1 ? 0.5 : 1
                    }}
                  >
                    <MdRedo size={20} />
                    Redo
                  </button>
                </div>
                
                {/* Text Input */}
                {textPosition && (
                  <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    gap: '0.5rem'
                  }}>
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Enter text..."
                      autoFocus
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: '0.25rem',
                        border: 'none',
                        backgroundColor: '#374151',
                        color: 'white'
                      }}
                    />
                    <button
                      onClick={handleTextSubmit}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: 'pointer'
                      }}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Filter Controls */}
            {editorMode === 'filter' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.25rem'
                  }}>
                    <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Brightness</span>
                    <span style={{ color: 'white', fontSize: '0.85rem' }}>{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            )}

            {/* Rotation Controls */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <button
                onClick={() => handleRotate(-90)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#374151',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <MdRotateLeft size={18} />
                Rotate Left
              </button>
              
              <button
                onClick={() => handleRotate(90)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#374151',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <MdRotateRight size={18} />
                Rotate Right
              </button>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '0.75rem'
            }}>
              <button
                onClick={handleSaveImage}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.opacity = '0.9'}
                onMouseOut={(e) => e.target.style.opacity = '1'}
              >
                ✓ Save Image
              </button>
              
              <button
                onClick={() => {
                  setIsCropping(false);
                  resetStates();
                }}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#4b5563'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#6b7280'}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Footer Buttons (when not cropping) */}
        {!isCropping && (
          <div style={{ 
            padding: '1rem',
            borderTop: '1px solid #374151'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              {mode === "photo" && !preview && (
                <label style={{
                  background: '#374151',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  textAlign: 'center',
                  width: '100%'
                }}>
                  <MdFileUpload size={18} />
                  <span>Choose Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
              
              {mode === "video" && !isRecording && !preview && (
                <label style={{
                  background: '#374151',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  textAlign: 'center',
                  width: '100%'
                }}>
                  <MdFileUpload size={18} />
                  <span>Choose Video</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
              
              {preview && (
                <button
                  onClick={mode === "video" ? handleSaveVideo : handleSaveImage}
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'center',
                    width: '100%'
                  }}
                  onMouseOver={(e) => e.target.style.opacity = '0.9'}
                  onMouseOut={(e) => e.target.style.opacity = '1'}
                >
                  {mode === "video" ? "Use Video" : "Use Photo"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}