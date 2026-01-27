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
  MdDelete,
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

// CameraModal Component - Mobile/PWA Compatible
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

  // Drawing states
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#ff0000');
  const [drawTool, setDrawTool] = useState('pen');
  const [drawHistory, setDrawHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [startPoint, setStartPoint] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState(null);
  const [tempElement, setTempElement] = useState(null);
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDraggingElement, setIsDraggingElement] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showDeleteZone, setShowDeleteZone] = useState(false);
  const [isOverDeleteZone, setIsOverDeleteZone] = useState(false);
  const [cameraError, setCameraError] = useState(null);

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
      initializeCamera();
    } else if (isOpen && mode === "video") {
      initializeVideoRecorder();
    }
    
    return () => {
      stopCamera();
    };
  }, [isOpen, mode]);

  useEffect(() => {
    if (isCropping && imageToEdit && imageDimensions.width) {
      // Set crop to cover entire image by default
      setCropRect({
        x: 0,
        y: 0,
        width: imageDimensions.width,
        height: imageDimensions.height
      });
    }
  }, [isCropping, imageToEdit, imageDimensions]);

  const initializeCamera = async () => {
    try {
      setCameraError(null);
      
      // Mobile-friendly camera constraints
      const constraints = {
        video: {
          facingMode: { ideal: "environment" }, // Prefer rear camera
          width: { ideal: 1920, max: 1920 }, // Limit resolution for mobile
          height: { ideal: 1080, max: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: false
      };

      // Check if running in PWA/standalone mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         window.navigator.standalone === true;
      
      // Add more flexible constraints for mobile
      if (isMobileDevice()) {
        constraints.video = {
          facingMode: { ideal: "environment" },
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 }
        };
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.warn("Video play error:", e));
      }

      // Get available devices
      try {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(
          (device) => device.kind === "videoinput",
        );
        setDevices(videoDevices);
      } catch (deviceErr) {
        console.warn("Device enumeration error:", deviceErr);
      }
    } catch (err) {
      console.error("Camera initialization error:", err);
      setCameraError(err.message || "Cannot access camera");
      
      // Try with more basic constraints
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        setStream(fallbackStream);
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
        }
        setCameraError(null);
      } catch (fallbackErr) {
        console.error("Fallback camera error:", fallbackErr);
        setCameraError("Camera access denied. Please check permissions.");
      }
    }
  };

  const initializeVideoRecorder = async () => {
    try {
      setCameraError(null);
      
      // Mobile-friendly video constraints
      const constraints = {
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: { ideal: "environment" }
        },
        audio: true
      };

      if (isMobileDevice()) {
        constraints.video = {
          width: { min: 640, ideal: 1280 },
          height: { min: 480, ideal: 720 },
          facingMode: { ideal: "environment" }
        };
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.play().catch(e => console.warn("Video play error:", e));
      }

      // Initialize MediaRecorder
      const options = { mimeType: 'video/webm;codecs=vp9,opus' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm;codecs=vp8,opus';
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm';
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/mp4';
      }

      mediaRecorderRef.current = new MediaRecorder(stream, options);
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: options.mimeType });
        const videoUrl = URL.createObjectURL(blob);
        setRecordedVideo(videoUrl);
        setPreview(videoUrl);
      };

    } catch (err) {
      console.error("Video recorder initialization error:", err);
      setCameraError(err.message || "Cannot access camera/microphone");
      
      // Try without audio
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        setStream(fallbackStream);
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
        }
        setCameraError("Audio not available, video only");
      } catch (fallbackErr) {
        console.error("Fallback video error:", fallbackErr);
        setCameraError("Camera access denied. Please check permissions.");
      }
    }
  };

  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      setStream(null);
    }
  };

  const switchCamera = async () => {
    if (devices.length <= 1) return;
    
    stopCamera();
    
    const currentTrack = stream?.getVideoTracks()[0];
    const currentDeviceId = currentTrack?.getSettings()?.deviceId;
    
    const allDevices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = allDevices.filter(device => device.kind === "videoinput");
    
    const currentIndex = videoDevices.findIndex(device => device.deviceId === currentDeviceId);
    const nextIndex = (currentIndex + 1) % videoDevices.length;
    
    try {
      const constraints = {
        video: { deviceId: { exact: videoDevices[nextIndex].deviceId } }
      };
      
      if (mode === "video") {
        constraints.audio = true;
      }
      
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play().catch(e => console.warn("Video play error:", e));
      }
    } catch (err) {
      console.error("Error switching camera:", err);
      // Try to reinitialize with default camera
      mode === "video" ? initializeVideoRecorder() : initializeCamera();
    }
  };

  const startRecording = () => {
    if (mediaRecorderRef.current?.state === "inactive") {
      try {
        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Error starting recording:", err);
        // Try with different mimeType
        const stream = videoRef.current?.srcObject;
        if (stream) {
          const options = { mimeType: 'video/webm' };
          mediaRecorderRef.current = new MediaRecorder(stream, options);
          const chunks = [];
          
          mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) chunks.push(event.data);
          };
          
          mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const videoUrl = URL.createObjectURL(blob);
            setRecordedVideo(videoUrl);
            setPreview(videoUrl);
          };
          
          mediaRecorderRef.current.start();
          setIsRecording(true);
        }
      }
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
    
    if (!video || !canvas || video.readyState !== 4) return;
    
    const ctx = canvas.getContext("2d");
    
    // Handle mobile rotation/orientation
    let width = video.videoWidth;
    let height = video.videoHeight;
    
    // Check if we need to adjust for device orientation
    const orientation = window.screen.orientation?.type || window.orientation;
    if (Math.abs(orientation) === 90 || orientation.includes('landscape')) {
      // Swap dimensions for landscape
      [width, height] = [height, width];
      canvas.width = height;
      canvas.height = width;
      ctx.save();
      ctx.translate(height/2, width/2);
      ctx.rotate(Math.PI/2);
      ctx.translate(-width/2, -height/2);
      ctx.drawImage(video, 0, 0, width, height);
      ctx.restore();
    } else {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(video, 0, 0);
    }
    
    const dataUrl = canvas.toDataURL("image/png", 0.9); // Reduced quality for mobile
    
    setImageToEdit(dataUrl);
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
    
    setIsCropping(true);
    stopCamera();
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
          setIsCropping(true);
        };
        img.src = ev.target.result;
      } else if (file.type.startsWith("video/")) {
        setPreview(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    if (editorMode !== 'draw') return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const coords = getCanvasCoordinates(touch);
    
    // Check if touching an existing element
    const clickedElement = findElementAtPosition(coords.x, coords.y);
    
    if (clickedElement) {
      setSelectedElement(clickedElement);
      const offsetX = coords.x - clickedElement.x;
      const offsetY = coords.y - clickedElement.y;
      setDragOffset({ x: offsetX, y: offsetY });
      setIsDraggingElement(true);
      setShowDeleteZone(true);
      return;
    }
    
    // Deselect if touching empty space
    setSelectedElement(null);
    
    // Start new drawing
    if (drawTool === 'text') {
      setTextPosition(coords);
      return;
    }
    
    setIsDrawing(true);
    setStartPoint(coords);
    
    if (drawTool === 'pen') {
      setTempElement({
        type: 'pen',
        color: drawColor,
        points: [coords],
        width: 3
      });
    } else {
      setTempElement({
        type: drawTool,
        color: drawColor,
        x: coords.x,
        y: coords.y,
        width: 0,
        height: 0
      });
    }
  };

  const handleTouchMove = (e) => {
    if (editorMode !== 'draw') return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const coords = getCanvasCoordinates(touch);
    
    if (isDraggingElement && selectedElement) {
      // Check if over delete zone
      const containerRect = containerRef.current.getBoundingClientRect();
      const deleteZoneTop = 50;
      const isOverDelete = touch.clientY - containerRect.top < deleteZoneTop;
      setIsOverDeleteZone(isOverDelete);
      
      // Update element position
      const newX = coords.x - dragOffset.x;
      const newY = coords.y - dragOffset.y;
      
      const updatedElements = elements.map(el => 
        el.id === selectedElement.id 
          ? { ...el, x: newX, y: newY }
          : el
      );
      setElements(updatedElements);
      return;
    }
    
    if (!isDrawing) return;
    
    if (drawTool === 'pen') {
      setTempElement(prev => ({
        ...prev,
        points: [...prev.points, coords]
      }));
    } else {
      setTempElement(prev => ({
        ...prev,
        width: coords.x - prev.x,
        height: coords.y - prev.y
      }));
    }
  };

  const handleTouchEnd = (e) => {
    if (isDraggingElement && selectedElement) {
      // If dropped in delete zone, delete the element
      if (isOverDeleteZone) {
        deleteElement(selectedElement);
      }
      
      setIsDraggingElement(false);
      setIsOverDeleteZone(false);
      setShowDeleteZone(false);
      saveDrawingState();
      return;
    }
    
    if (!isDrawing || !tempElement) return;
    
    if (drawTool === 'pen' && tempElement.points.length < 2) {
      setIsDrawing(false);
      setTempElement(null);
      return;
    }
    
    const newElement = {
      ...tempElement,
      id: Date.now() + Math.random()
    };
    
    setElements([...elements, newElement]);
    saveDrawingState();
    
    setIsDrawing(false);
    setTempElement(null);
  };

  const handleCanvasClick = (e) => {
    if (editorMode !== 'draw' || drawTool !== 'text') return;
    const coords = getCanvasCoordinates(e);
    setTextPosition(coords);
    setSelectedElement(null);
  };

  // Combined mouse and touch event handler
  const handleInteractionStart = (e) => {
    if (e.type === 'touchstart') {
      handleTouchStart(e);
    } else {
      handleMouseDown(e);
    }
  };

  const handleInteractionMove = (e) => {
    if (e.type === 'touchmove') {
      handleTouchMove(e);
    } else {
      handleMouseMove(e);
    }
  };

  const handleInteractionEnd = (e) => {
    if (e.type === 'touchend') {
      handleTouchEnd(e);
    } else {
      handleMouseUp(e);
    }
  };

  // Drawing functions
  const getCanvasCoordinates = (event) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Get client coordinates from mouse or touch event
    const clientX = event.clientX || (event.touches && event.touches[0].clientX) || 0;
    const clientY = event.clientY || (event.touches && event.touches[0].clientY) || 0;
    
    const scaleX = imageDimensions.width / rect.width;
    const scaleY = imageDimensions.height / rect.height;
    const scale = Math.min(scaleX, scaleY);
    
    const offsetX = (rect.width - imageDimensions.width / scale) / 2;
    const offsetY = (rect.height - imageDimensions.height / scale) / 2;
    
    const x = (clientX - rect.left - offsetX) * scale;
    const y = (clientY - rect.top - offsetY) * scale;
    
    return { x, y };
  };

  const handleMouseDown = (e) => {
    if (editorMode !== 'draw') return;
    
    const coords = getCanvasCoordinates(e);
    
    // Check if clicking on an existing element
    const clickedElement = findElementAtPosition(coords.x, coords.y);
    
    if (clickedElement) {
      setSelectedElement(clickedElement);
      const offsetX = coords.x - clickedElement.x;
      const offsetY = coords.y - clickedElement.y;
      setDragOffset({ x: offsetX, y: offsetY });
      setIsDraggingElement(true);
      setShowDeleteZone(true);
      return;
    }
    
    // Deselect if clicking empty space
    setSelectedElement(null);
    
    // Start new drawing
    if (drawTool === 'text') {
      setTextPosition(coords);
      return;
    }
    
    setIsDrawing(true);
    setStartPoint(coords);
    
    if (drawTool === 'pen') {
      setTempElement({
        type: 'pen',
        color: drawColor,
        points: [coords],
        width: 3
      });
    } else {
      setTempElement({
        type: drawTool,
        color: drawColor,
        x: coords.x,
        y: coords.y,
        width: 0,
        height: 0
      });
    }
  };

  const handleMouseMove = (e) => {
    if (editorMode !== 'draw') return;
    
    const coords = getCanvasCoordinates(e);
    
    if (isDraggingElement && selectedElement) {
      // Check if over delete zone
      const containerRect = containerRef.current.getBoundingClientRect();
      const deleteZoneTop = 50;
      const isOverDelete = e.clientY - containerRect.top < deleteZoneTop;
      setIsOverDeleteZone(isOverDelete);
      
      // Update element position
      const newX = coords.x - dragOffset.x;
      const newY = coords.y - dragOffset.y;
      
      const updatedElements = elements.map(el => 
        el.id === selectedElement.id 
          ? { ...el, x: newX, y: newY }
          : el
      );
      setElements(updatedElements);
      return;
    }
    
    if (!isDrawing) return;
    
    if (drawTool === 'pen') {
      setTempElement(prev => ({
        ...prev,
        points: [...prev.points, coords]
      }));
    } else {
      setTempElement(prev => ({
        ...prev,
        width: coords.x - prev.x,
        height: coords.y - prev.y
      }));
    }
  };

  const handleMouseUp = () => {
    if (isDraggingElement && selectedElement) {
      // If dropped in delete zone, delete the element
      if (isOverDeleteZone) {
        deleteElement(selectedElement);
      }
      
      setIsDraggingElement(false);
      setIsOverDeleteZone(false);
      setShowDeleteZone(false);
      saveDrawingState();
      return;
    }
    
    if (!isDrawing || !tempElement) return;
    
    if (drawTool === 'pen' && tempElement.points.length < 2) {
      setIsDrawing(false);
      setTempElement(null);
      return;
    }
    
    const newElement = {
      ...tempElement,
      id: Date.now() + Math.random()
    };
    
    setElements([...elements, newElement]);
    saveDrawingState();
    
    setIsDrawing(false);
    setTempElement(null);
  };

  const findElementAtPosition = (x, y) => {
    for (const element of elements) {
      if (isPointInElement(x, y, element)) {
        return element;
      }
    }
    return null;
  };

  const isPointInElement = (x, y, element) => {
    if (element.type === 'pen') {
      for (let i = 0; i < element.points.length - 1; i++) {
        const p1 = element.points[i];
        const p2 = element.points[i + 1];
        const distance = pointToLineDistance(x, y, p1.x, p1.y, p2.x, p2.y);
        if (distance < 20) return true; // Larger tolerance for touch
      }
      return false;
    } else if (element.type === 'text') {
      const bounds = getTextBounds(element);
      return x >= bounds.x - 20 && x <= bounds.x + bounds.width + 20 &&
             y >= bounds.y - bounds.height - 20 && y <= bounds.y + 20;
    } else if (element.type === 'circle') {
      const radius = Math.sqrt(Math.pow(element.width, 2) + Math.pow(element.height, 2));
      const distance = Math.sqrt(Math.pow(x - element.x, 2) + Math.pow(y - element.y, 2));
      return Math.abs(distance - radius) < 25; // Larger tolerance
    } else {
      const bounds = getElementBounds(element);
      return x >= bounds.x - 20 && x <= bounds.x + bounds.width + 20 &&
             y >= bounds.y - 20 && y <= bounds.y + bounds.height + 20;
    }
  };

  const pointToLineDistance = (x, y, x1, y1, x2, y2) => {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    
    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTextSubmit = () => {
    if (!textInput || !textPosition) return;
    
    const newElement = {
      id: Date.now() + Math.random(),
      type: 'text',
      color: drawColor,
      text: textInput,
      x: textPosition.x,
      y: textPosition.y,
      fontSize: 32 // Larger font for mobile
    };
    
    setElements([...elements, newElement]);
    saveDrawingState();
    
    setTextInput('');
    setTextPosition(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && textInput.trim()) {
      handleTextSubmit();
    }
  };

  const saveDrawingState = () => {
    const newHistory = drawHistory.slice(0, historyStep + 1);
    newHistory.push({
      elements: [...elements],
      timestamp: Date.now()
    });
    setDrawHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      setElements(drawHistory[historyStep - 1].elements);
    }
  };

  const handleRedo = () => {
    if (historyStep < drawHistory.length - 1) {
      setHistoryStep(historyStep + 1);
      setElements(drawHistory[historyStep + 1].elements);
    }
  };

  const deleteElement = (element) => {
    const newElements = elements.filter(el => el.id !== element.id);
    setElements(newElements);
    setSelectedElement(null);
    saveDrawingState();
  };

  const getElementBounds = (element) => {
    if (element.type === 'arrow') {
      return {
        x: Math.min(element.x, element.x + element.width),
        y: Math.min(element.y, element.y + element.height),
        width: Math.abs(element.width),
        height: Math.abs(element.height)
      };
    } else if (element.type === 'pen') {
      const minX = Math.min(...element.points.map(p => p.x));
      const minY = Math.min(...element.points.map(p => p.y));
      const maxX = Math.max(...element.points.map(p => p.x));
      const maxY = Math.max(...element.points.map(p => p.y));
      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      };
    } else if (element.type === 'circle') {
      const radius = Math.sqrt(Math.pow(element.width, 2) + Math.pow(element.height, 2));
      return {
        x: element.x - radius,
        y: element.y - radius,
        width: radius * 2,
        height: radius * 2
      };
    } else if (element.type === 'text') {
      return getTextBounds(element);
    }
    return element;
  };

  const getTextBounds = (element) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = `${element.fontSize}px Arial`;
    const width = ctx.measureText(element.text).width;
    return {
      x: element.x,
      y: element.y,
      width: width,
      height: element.fontSize
    };
  };

  const drawElement = (ctx, element, isSelected = false) => {
    ctx.strokeStyle = element.color;
    ctx.fillStyle = element.color;
    ctx.lineWidth = element.type === 'pen' ? element.width : 3; // Thicker lines for mobile
    
    if (element.type === 'pen') {
      ctx.beginPath();
      ctx.moveTo(element.points[0].x, element.points[0].y);
      element.points.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    } else if (element.type === 'arrow') {
      const fromX = element.x;
      const fromY = element.y;
      const toX = element.x + element.width;
      const toY = element.y + element.height;
      
      const headLength = 25; // Larger arrow head for mobile
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
    } else if (element.type === 'circle') {
      const radius = Math.sqrt(Math.pow(element.width, 2) + Math.pow(element.height, 2));
      ctx.beginPath();
      ctx.arc(element.x, element.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (element.type === 'square') {
      ctx.strokeRect(element.x, element.y, element.width, element.height);
    } else if (element.type === 'text') {
      ctx.font = `${element.fontSize}px Arial`;
      ctx.fillText(element.text, element.x, element.y);
    }
    
    // Draw selection border
    if (isSelected) {
      const bounds = getElementBounds(element);
      
      ctx.strokeStyle = '#10b981';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 3; // Thicker selection border
      ctx.strokeRect(bounds.x - 10, bounds.y - 10, bounds.width + 20, bounds.height + 20);
      ctx.setLineDash([]);
    }
  };

  const renderDrawing = () => {
    if (!drawingCanvasRef.current || !imageDimensions.width) return;
    
    const canvas = drawingCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw all elements
    elements.forEach(element => {
      drawElement(ctx, element, selectedElement?.id === element.id);
    });
    
    // Draw temporary element
    if (tempElement) {
      drawElement(ctx, tempElement);
    }
  };

  useEffect(() => {
    renderDrawing();
  }, [elements, tempElement, selectedElement, imageDimensions]);

  useEffect(() => {
    if (imageToEdit && editorMode === 'draw' && drawingCanvasRef.current) {
      const img = new Image();
      img.onload = () => {
        const canvas = drawingCanvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
        setElements([]);
        setDrawHistory([]);
        setHistoryStep(-1);
      };
      img.src = imageToEdit;
    }
  }, [imageToEdit, editorMode]);

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
        
        // Draw annotations
        const drawCanvas = drawingCanvasRef.current;
        if (drawCanvas) {
          const drawCtx = drawCanvas.getContext('2d');
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          tempCanvas.width = drawCanvas.width;
          tempCanvas.height = drawCanvas.height;
          
          tempCtx.drawImage(drawCanvas, 0, 0);
          
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
        }, 'image/png', 0.9); // Reduced quality for mobile
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
    setElements([]);
    setDrawHistory([]);
    setHistoryStep(-1);
    setRotation(0);
    setBrightness(100);
    setEditorMode('crop');
    setDrawColor('#ff0000');
    setDrawTool('pen');
    setTextInput('');
    setTextPosition(null);
    setSelectedElement(null);
    setShowDeleteZone(false);
    setIsOverDeleteZone(false);
    setCameraError(null);
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
          const startX = e.clientX || (e.touches && e.touches[0].clientX);
          const startY = e.clientY || (e.touches && e.touches[0].clientY);
          const startCrop = { ...cropRect };
          
          const handleMouseMove = (moveEvent) => {
            const moveX = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX);
            const moveY = moveEvent.clientY || (moveEvent.touches && moveEvent.touches[0].clientY);
            const deltaX = (moveX - startX) / scale;
            const deltaY = (moveY - startY) / scale;
            
            setCropRect({
              x: Math.max(0, Math.min(imageDimensions.width - startCrop.width, startCrop.x + deltaX)),
              y: Math.max(0, Math.min(imageDimensions.height - startCrop.height, startCrop.y + deltaY)),
              width: startCrop.width,
              height: startCrop.height
            });
          };
          
          const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchmove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchend', handleMouseUp);
          };
          
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('touchmove', handleMouseMove, { passive: false });
          document.addEventListener('mouseup', handleMouseUp);
          document.addEventListener('touchend', handleMouseUp);
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
        
        {/* Crop rectangle - now full image by default */}
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
          {/* Corner handles - larger for mobile */}
          {['nw', 'ne', 'sw', 'se'].map((corner) => {
            const style = {
              position: 'absolute',
              width: '30px', // Larger for touch
              height: '30px',
              backgroundColor: 'white',
              border: '2px solid #10b981',
              borderRadius: '4px'
            };
            
            if (corner === 'nw') {
              style.top = '-15px';
              style.left = '-15px';
              style.cursor = 'nw-resize';
            } else if (corner === 'ne') {
              style.top = '-15px';
              style.right = '-15px';
              style.cursor = 'ne-resize';
            } else if (corner === 'sw') {
              style.bottom = '-15px';
              style.left = '-15px';
              style.cursor = 'sw-resize';
            } else if (corner === 'se') {
              style.bottom = '-15px';
              style.right = '-15px';
              style.cursor = 'se-resize';
            }
            
            return (
              <div
                key={corner}
                style={style}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  const startX = e.clientX || (e.touches && e.touches[0].clientX);
                  const startY = e.clientY || (e.touches && e.touches[0].clientY);
                  const startCrop = { ...cropRect };
                  
                  const handleMouseMove = (moveEvent) => {
                    const moveX = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX);
                    const moveY = moveEvent.clientY || (moveEvent.touches && moveEvent.touches[0].clientY);
                    const deltaX = (moveX - startX) / scale;
                    const deltaY = (moveY - startY) / scale;
                    
                    let newWidth = startCrop.width;
                    let newHeight = startCrop.height;
                    let newX = startCrop.x;
                    let newY = startCrop.y;
                    
                    if (corner === 'nw') {
                      newWidth = Math.max(100, startCrop.width - deltaX); // Larger minimum for mobile
                      newHeight = Math.max(100, startCrop.height - deltaY);
                      newX = startCrop.x + deltaX;
                      newY = startCrop.y + deltaY;
                    } else if (corner === 'ne') {
                      newWidth = Math.max(100, startCrop.width + deltaX);
                      newHeight = Math.max(100, startCrop.height - deltaY);
                      newY = startCrop.y + deltaY;
                    } else if (corner === 'sw') {
                      newWidth = Math.max(100, startCrop.width - deltaX);
                      newHeight = Math.max(100, startCrop.height + deltaY);
                      newX = startCrop.x + deltaX;
                    } else if (corner === 'se') {
                      newWidth = Math.max(100, startCrop.width + deltaX);
                      newHeight = Math.max(100, startCrop.height + deltaY);
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
                    document.removeEventListener('touchmove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                    document.removeEventListener('touchend', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('touchmove', handleMouseMove, { passive: false });
                  document.addEventListener('mouseup', handleMouseUp);
                  document.addEventListener('touchend', handleMouseUp);
                }}
              />
            );
          })}
        </div>
      </div>
    );
  };

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
        zIndex: 20000,
        touchAction: 'none' // Important for mobile touch handling
      }}
      onClick={() => {
        if (!isCropping && !textPosition) {
          stopCamera();
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
          zIndex: 20001,
          WebkitOverflowScrolling: 'touch' // Smooth scrolling on iOS
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
              stopCamera();
              resetStates();
              onClose();
            }}
            style={{
              background: "#374151",
              border: "none",
              fontSize: "1.25rem",
              color: "#9ca3af",
              cursor: "pointer",
              width: "40px", // Larger for mobile
              height: "40px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              touchAction: 'manipulation' // Better touch handling
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
                marginBottom: "1rem",
                touchAction: 'none' // Important for drawing
              }}
              onMouseDown={editorMode === 'draw' ? handleInteractionStart : undefined}
              onMouseMove={editorMode === 'draw' ? handleInteractionMove : undefined}
              onMouseUp={editorMode === 'draw' ? handleInteractionEnd : undefined}
              onTouchStart={editorMode === 'draw' ? handleInteractionStart : undefined}
              onTouchMove={editorMode === 'draw' ? handleInteractionMove : undefined}
              onTouchEnd={editorMode === 'draw' ? handleInteractionEnd : undefined}
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
                  filter: `brightness(${brightness}%)`,
                  ...(textPosition && {
                    filter: `brightness(${brightness}%) blur(2px)`,
                    opacity: 0.7
                  })
                }}
              />
              
              {/* Delete Zone (shown when dragging element) */}
              {showDeleteZone && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '60px', // Taller for mobile
                  backgroundColor: isOverDeleteZone ? 'rgba(239, 68, 68, 0.8)' : 'rgba(239, 68, 68, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.3s ease',
                  zIndex: 50,
                  touchAction: 'none'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '0.9rem' // Smaller text for mobile
                  }}>
                    <MdDelete size={28} /> {/* Larger icon */}
                    <span>Drag here to delete</span>
                  </div>
                </div>
              )}
              
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
                    cursor: drawTool === 'text' ? 'text' : 'crosshair',
                    touchAction: 'none'
                  }}
                />
              )}
              
              {/* Text Input Overlay */}
              {textPosition && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  minWidth: '300px',
                  width: '80%', // Responsive width
                  maxWidth: '400px',
                  zIndex: 100,
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)' // Safari support
                }}>
                  <span style={{ 
                    color: 'white', 
                    fontWeight: '600',
                    fontSize: '1rem',
                    marginBottom: '0.5rem'
                  }}>
                    Add Text
                  </span>
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type text and press Enter..."
                    autoFocus
                    style={{
                      padding: '0.75rem',
                      borderRadius: '0.25rem',
                      border: '1px solid #4b5563',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '1rem',
                      WebkitAppearance: 'none', // Remove iOS styling
                      MozAppearance: 'textfield' // Remove Firefox styling
                    }}
                    onKeyPress={handleKeyPress}
                  />
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    justifyContent: 'flex-end',
                    marginTop: '0.5rem'
                  }}>
                    <button
                      onClick={() => {
                        setTextPosition(null);
                        setTextInput('');
                      }}
                      style={{
                        padding: '0.75rem 1.5rem', // Larger for mobile
                        backgroundColor: 'rgba(107, 114, 128, 0.5)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        touchAction: 'manipulation'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleTextSubmit}
                      disabled={!textInput.trim()}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: textInput.trim() ? '#10b981' : '#4b5563',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: textInput.trim() ? 'pointer' : 'not-allowed',
                        fontSize: '0.9rem',
                        opacity: textInput.trim() ? 1 : 0.5,
                        touchAction: 'manipulation'
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
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
              {/* Camera Error Message */}
              {cameraError && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2rem',
                  zIndex: 10,
                  color: 'white',
                  textAlign: 'center'
                }}>
                  <MdCamera size={48} style={{ marginBottom: '1rem' }} />
                  <h3 style={{ marginBottom: '0.5rem' }}>Camera Error</h3>
                  <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>{cameraError}</p>
                  <button
                    onClick={() => {
                      setCameraError(null);
                      mode === "video" ? initializeVideoRecorder() : initializeCamera();
                    }}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    Retry
                  </button>
                </div>
              )}
              
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
                  display: "block",
                  transform: mode === "photo" ? "scaleX(-1)" : "none" // Mirror for selfie
                }}
              />
              
              {mode === "photo" && devices.length > 1 && (
                <button
                  onClick={switchCamera}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    border: "none",
                    width: "48px", // Larger for mobile
                    height: "48px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    touchAction: 'manipulation'
                  }}
                  title="Switch Camera"
                >
                  <MdFlipCameraAndroid size={24} />
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
                      width: "72px", // Larger for mobile
                      height: "72px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                      transition: "all 0.2s ease",
                      touchAction: 'manipulation'
                    }}
                  >
                    <MdCamera size={32} />
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
                          padding: "0.75rem 1.5rem", // Larger for mobile
                          borderRadius: "9999px",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                          touchAction: 'manipulation'
                        }}
                      >
                        <MdPlayArrow size={20} />
                        <span>Start Recording</span>
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        style={{
                          background: "#dc2626",
                          color: "white",
                          padding: "0.75rem 1.5rem",
                          borderRadius: "9999px",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                          border: "none",
                          cursor: "pointer",
                          display: 'flex',
                          alignItems: 'center',
                          gap: "0.5rem",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                          touchAction: 'manipulation'
                        }}
                      >
                        <MdStop size={20} />
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
              marginBottom: '1rem',
              flexWrap: 'wrap' // Wrap on small screens
            }}>
              <button
                onClick={() => setEditorMode('crop')}
                style={{
                  padding: '0.75rem 1rem', // Larger for mobile
                  backgroundColor: editorMode === 'crop' ? '#10b981' : '#374151',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  minWidth: '100px', // Minimum width for touch
                  touchAction: 'manipulation'
                }}
              >
                <MdCrop size={18} />
                Crop
              </button>
              
              <button
                onClick={() => setEditorMode('draw')}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: editorMode === 'draw' ? '#10b981' : '#374151',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  minWidth: '100px',
                  touchAction: 'manipulation'
                }}
              >
                <MdBrush size={18} />
                Draw
              </button>
              
              <button
                onClick={() => setEditorMode('filter')}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: editorMode === 'filter' ? '#10b981' : '#374151',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  minWidth: '100px',
                  touchAction: 'manipulation'
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
                      gap: '0.25rem',
                      minWidth: '60px', // Minimum for touch
                      touchAction: 'manipulation'
                    }}
                  >
                    <MdBrush size={22} />
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
                      gap: '0.25rem',
                      minWidth: '60px',
                      touchAction: 'manipulation'
                    }}
                  >
                    <FaArrowRight size={20} />
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
                      gap: '0.25rem',
                      minWidth: '60px',
                      touchAction: 'manipulation'
                    }}
                  >
                    <MdCircle size={22} />
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
                      gap: '0.25rem',
                      minWidth: '60px',
                      touchAction: 'manipulation'
                    }}
                  >
                    <MdSquare size={22} />
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
                      gap: '0.25rem',
                      minWidth: '60px',
                      touchAction: 'manipulation'
                    }}
                  >
                    <MdTextFields size={22} />
                  </button>
                </div>
                
                {/* Color Selection */}
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '0.5rem',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Color:</span>
                  {['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#ffffff', '#000000'].map(color => (
                    <button
                      key={color}
                      onClick={() => setDrawColor(color)}
                      style={{
                        width: '32px', // Larger for mobile
                        height: '32px',
                        backgroundColor: color,
                        border: drawColor === color ? '3px solid #10b981' : '2px solid #6b7280',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        touchAction: 'manipulation'
                      }}
                    />
                  ))}
                </div>
                
                {/* Instructions */}
                <div style={{
                  textAlign: 'center',
                  color: '#9ca3af',
                  fontSize: '0.8rem',
                  padding: '0.5rem',
                  lineHeight: '1.4'
                }}>
                  {selectedElement ? (
                    <span>Drag to move • Drag to top red zone to delete • Tap outside to deselect</span>
                  ) : (
                    <span>Tap to select • Touch and drag to draw • Tap anywhere to add text</span>
                  )}
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
                      padding: '0.75rem 1.5rem', // Larger for mobile
                      backgroundColor: historyStep <= 0 ? '#4b5563' : '#374151',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: historyStep <= 0 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      opacity: historyStep <= 0 ? 0.5 : 1,
                      touchAction: 'manipulation',
                      minWidth: '120px'
                    }}
                  >
                    <MdUndo size={22} />
                    Undo
                  </button>
                  <button
                    onClick={handleRedo}
                    disabled={historyStep >= drawHistory.length - 1}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: historyStep >= drawHistory.length - 1 ? '#4b5563' : '#374151',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: historyStep >= drawHistory.length - 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      opacity: historyStep >= drawHistory.length - 1 ? 0.5 : 1,
                      touchAction: 'manipulation',
                      minWidth: '120px'
                    }}
                  >
                    <MdRedo size={22} />
                    Redo
                  </button>
                </div>
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
                    <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Brightness</span>
                    <span style={{ color: 'white', fontSize: '0.9rem' }}>{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    style={{ 
                      width: '100%',
                      height: '30px', // Taller for mobile
                      WebkitAppearance: 'none',
                      appearance: 'none',
                      background: 'transparent'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Rotation Controls */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '1rem',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => handleRotate(-90)}
                style={{
                  padding: '0.75rem 1.5rem', // Larger for mobile
                  backgroundColor: '#374151',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  touchAction: 'manipulation',
                  minWidth: '140px'
                }}
              >
                <MdRotateLeft size={20} />
                Rotate Left
              </button>
              
              <button
                onClick={() => handleRotate(90)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#374151',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  touchAction: 'manipulation',
                  minWidth: '140px'
                }}
              >
                <MdRotateRight size={20} />
                Rotate Right
              </button>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              flexDirection: isMobileDevice() ? 'column' : 'row' // Stack on mobile
            }}>
              <button
                onClick={handleSaveImage}
                style={{
                  flex: 1,
                  padding: '1rem', // Larger for mobile
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  touchAction: 'manipulation'
                }}
              >
                ✓ Save Image
              </button>
              
              <button
                onClick={() => {
                  setIsCropping(false);
                  resetStates();
                }}
                style={{
                  padding: '1rem 1.5rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  touchAction: 'manipulation'
                }}
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
                  padding: '1rem', // Larger for mobile
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  textAlign: 'center',
                  width: '100%',
                  touchAction: 'manipulation'
                }}>
                  <MdFileUpload size={20} />
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
                  padding: '1rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  textAlign: 'center',
                  width: '100%',
                  touchAction: 'manipulation'
                }}>
                  <MdFileUpload size={20} />
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
                    padding: '1rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '1rem',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'center',
                    width: '100%',
                    touchAction: 'manipulation'
                  }}
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