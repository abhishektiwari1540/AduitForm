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
  MdInstallMobile,
  MdInfo
} from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';

export default function WhatsAppCamera() {
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [mode, setMode] = useState("photo");
  const [isPWA, setIsPWA] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [showPWAInstallPrompt, setShowPWAInstallPrompt] = useState(false);
  const deferredPrompt = useRef(null);

  // Check if running in PWA/installed mode
  useEffect(() => {
    // Check if running in PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                       window.navigator.standalone === true;
    setIsPWA(isStandalone);

    // Check if app can be installed
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt.current = e;
      setShowPWAInstallPrompt(true);
    });

    // Check camera permission
    checkCameraPermission();

    // Listen for app install
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed successfully');
      setIsPWA(true);
      setShowPWAInstallPrompt(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const checkCameraPermission = async () => {
    try {
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'camera' });
        setCameraPermission(permission.state);
        
        permission.onchange = () => {
          setCameraPermission(permission.state);
        };
      }
    } catch (err) {
      console.log("Permission API not supported");
    }
  };

  const handleInstallPWA = async () => {
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt();
      const { outcome } = await deferredPrompt.current.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      deferredPrompt.current = null;
      setShowPWAInstallPrompt(false);
    }
  };

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

  const requestCameraPermission = async () => {
    try {
      // Try to get camera permission by accessing camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setCameraPermission('granted');
      return true;
    } catch (err) {
      setCameraPermission('denied');
      return false;
    }
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
      {/* PWA Install Banner */}
      {showPWAInstallPrompt && !isPWA && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#7c3aed',
          color: 'white',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10000,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MdInstallMobile size={24} />
            <div>
              <strong>Install App</strong>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                For better camera experience
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleInstallPWA}
              style={{
                backgroundColor: 'white',
                color: '#7c3aed',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Install
            </button>
            <button
              onClick={() => setShowPWAInstallPrompt(false)}
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                padding: '0.5rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

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
          WhatsApp Image Editor {isPWA && "📱"}
        </h1>
        <p style={{
          color: '#4b5563',
          fontSize: '1.125rem',
          maxWidth: '48rem',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          {isPWA ? 
            "Capture, edit and annotate images with full camera access" :
            "Capture, edit and annotate images with WhatsApp-like editing features"}
        </p>
        
        {/* Camera Permission Status */}
        {cameraPermission && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: cameraPermission === 'granted' ? '#10b98120' : '#ef444420',
            borderRadius: '0.5rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: cameraPermission === 'granted' ? '#10b981' : '#ef4444'
          }}>
            <MdInfo size={16} />
            <span>
              Camera permission: <strong>{cameraPermission}</strong>
            </span>
            {cameraPermission === 'denied' && !isPWA && (
              <button
                onClick={requestCameraPermission}
                style={{
                  marginLeft: '0.5rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  border: 'none',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                Request Again
              </button>
            )}
          </div>
        )}
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
              onClick={async () => {
                if (!isPWA && cameraPermission === 'denied') {
                  if (!await requestCameraPermission()) {
                    alert("Camera permission is required. Please install the app or grant permission in browser settings.");
                    return;
                  }
                }
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
              onClick={async () => {
                if (!isPWA && cameraPermission === 'denied') {
                  if (!await requestCameraPermission()) {
                    alert("Camera permission is required. Please install the app or grant permission in browser settings.");
                    return;
                  }
                }
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

          {/* PWA Info */}
          {!isPWA && (
            <div style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <MdInfo size={20} color="#f59e0b" />
                <strong style={{ color: '#92400e' }}>For Better Camera Experience</strong>
              </div>
              <p style={{
                color: '#92400e',
                fontSize: '0.875rem',
                margin: 0,
                lineHeight: '1.5'
              }}>
                Install this app on your device for full camera access and better performance on iOS and Android.
              </p>
            </div>
          )}

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
          isPWA={isPWA}
          cameraPermission={cameraPermission}
        />
      )}
    </div>
  );
}

// CameraModal Component - Enhanced for PWA
function CameraModal({
  isOpen,
  onClose,
  onImageCaptured,
  mode = "photo",
  isPWA = false,
  cameraPermission = null
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
  const [showPermissionHelp, setShowPermissionHelp] = useState(false);

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
  const [isInitializing, setIsInitializing] = useState(false);

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
      setIsInitializing(true);
      setCameraError(null);
      
      // Enhanced camera constraints for PWA
      const constraints = {
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: { ideal: "environment" },
          frameRate: { ideal: 30 }
        },
        audio: false
      };

      // Different constraints for iOS PWA
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      const isAndroid = /Android/.test(navigator.userAgent);
      
      if (isIOS && isPWA) {
        // iOS PWA needs specific constraints
        constraints.video = {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        };
      } else if (isAndroid && isPWA) {
        // Android PWA
        constraints.video = {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        };
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(e => {
          console.warn("Video play error:", e);
          // Try again with muted
          videoRef.current.muted = true;
          return videoRef.current.play();
        });
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

      setIsInitializing(false);
    } catch (err) {
      console.error("Camera initialization error:", err);
      setIsInitializing(false);
      
      // Handle specific permission errors
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError("Camera access denied. Please check app permissions.");
        setShowPermissionHelp(true);
      } else if (err.name === 'NotFoundError') {
        setCameraError("No camera found on this device.");
      } else if (err.name === 'NotReadableError') {
        setCameraError("Camera is already in use by another application.");
      } else {
        setCameraError(`Camera error: ${err.message}`);
      }
      
      // Try fallback for PWA
      if (isPWA) {
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: mode === "video"
          });
          setStream(fallbackStream);
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
          }
          setCameraError(null);
          setShowPermissionHelp(false);
        } catch (fallbackErr) {
          console.error("Fallback camera error:", fallbackErr);
        }
      }
    }
  };

  const initializeVideoRecorder = async () => {
    try {
      setIsInitializing(true);
      setCameraError(null);
      
      const constraints = {
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: { ideal: "environment" }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      };

      // iOS PWA specific settings
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS && isPWA) {
        constraints.video = {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        };
        constraints.audio = true; // Simple audio for iOS
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        await videoRef.current.play();
      }

      // Initialize MediaRecorder with PWA compatibility
      let options = { mimeType: 'video/webm;codecs=vp9,opus' };
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

      setIsInitializing(false);
    } catch (err) {
      console.error("Video recorder initialization error:", err);
      setIsInitializing(false);
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError("Camera/microphone access denied. Please check app permissions.");
        setShowPermissionHelp(true);
      } else if (err.name === 'NotFoundError') {
        setCameraError("No camera found on this device.");
      } else {
        setCameraError(`Video error: ${err.message}`);
      }
      
      // Try without audio for PWA
      if (isPWA) {
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
        }
      }
    }
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
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const dataUrl = canvas.toDataURL("image/png", 0.9);
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

  // Rest of the camera modal functions remain the same...
  // [Keep all the existing event handlers and drawing functions from the original code]

  // For brevity, I'm keeping the existing event handlers and drawing functions
  // They should remain exactly as they were in your original code

  const handleSaveImage = async () => {
    if (!imageToEdit) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.src = imageToEdit;
    
    await new Promise((resolve) => {
      img.onload = () => {
        canvas.width = cropRect.width;
        canvas.height = cropRect.height;
        
        if (rotation !== 0) {
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(rotation * Math.PI / 180);
          ctx.translate(-canvas.width / 2, -canvas.height / 2);
        }
        
        ctx.drawImage(
          img,
          cropRect.x, cropRect.y, cropRect.width, cropRect.height,
          0, 0, canvas.width, canvas.height
        );
        
        if (rotation !== 0) {
          ctx.restore();
        }
        
        ctx.filter = `brightness(${brightness}%)`;
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(canvas, 0, 0);
        
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
        }, 'image/png', 0.9);
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
    setShowPermissionHelp(false);
  };

  const openAppSettings = () => {
    if (isPWA) {
      // For PWA, we can't open settings directly
      alert("Please check camera permissions in your device settings under 'App permissions'");
    } else {
      // For browser, try to open settings
      if (navigator.permissions && navigator.permissions.query) {
        // This might work in some browsers
        navigator.permissions.query({ name: 'camera' }).then(permission => {
          console.log('Camera permission state:', permission.state);
        });
      }
      alert("Please check camera permissions in your browser settings");
    }
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
        touchAction: 'none'
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
          WebkitOverflowScrolling: 'touch'
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
            {isPWA && " 📱"}
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
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              touchAction: 'manipulation'
            }}
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
          {isInitializing ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '300px',
              color: 'white',
              gap: '1rem'
            }}>
              <div className="spinner" style={{
                width: '50px',
                height: '50px',
                border: '5px solid #374151',
                borderTopColor: '#10b981',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
              <p>Initializing camera...</p>
              {isPWA && <small>Running in installed app mode</small>}
            </div>
          ) : isCropping ? (
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
                touchAction: 'none'
              }}
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
                    cursor: 'crosshair',
                    touchAction: 'none'
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
              {/* Camera Error Message */}
              {cameraError && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
                  
                  {showPermissionHelp && (
                    <div style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      marginBottom: '1rem',
                      textAlign: 'left'
                    }}>
                      <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        <strong>To fix camera permissions:</strong>
                      </p>
                      <ul style={{ fontSize: '0.8rem', paddingLeft: '1rem', margin: 0 }}>
                        <li>Install the app for better permission handling</li>
                        <li>Check device settings for camera permissions</li>
                        <li>Ensure no other app is using the camera</li>
                      </ul>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
                      Retry Camera
                    </button>
                    
                    <button
                      onClick={openAppSettings}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      Check Permissions
                    </button>
                  </div>
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
                  transform: mode === "photo" ? "scaleX(-1)" : "none"
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
                    width: "48px",
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
              
              {mode === "photo" && !isCropping && !cameraError && (
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
                      width: "72px",
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
              
              {mode === "video" && !cameraError && (
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
                          padding: "0.75rem 1.5rem",
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

        {/* Editor Controls - Keep existing editor controls */}
        {/* [Keep all the existing editor controls from your original code] */}

        {/* Footer Buttons */}
        {!isCropping && !isInitializing && (
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
                  <span>Choose Photo</span>
                  <input
                    type="file"
                    accept="image/*"
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