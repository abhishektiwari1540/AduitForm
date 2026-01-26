import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  MdCamera,
  MdClose,
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
} from "react-icons/md";
import Cropper from "react-easy-crop";
import { Link } from 'react-router-dom';
import getCroppedImg from "./cropUtils"; 

export default function WhatsAppCamera() {
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [mode, setMode] = useState("photo"); // 'photo' or 'video'

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
          WhatsApp Camera
        </h1>
        <p style={{
          color: '#4b5563',
          fontSize: '1.125rem',
          maxWidth: '48rem',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Capture and manage photos/videos with WhatsApp-like camera interface
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
            Capture Media
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
              <span>Take Photo</span>
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

// CameraModal Component with enhanced WhatsApp-like cropping
function CameraModal({
  isOpen,
  onClose,
  onImageCaptured,
  mode = "photo",
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [devices, setDevices] = useState([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const [brightness, setBrightness] = useState(100);
  const [aspectRatio, setAspectRatio] = useState(4/3);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [cropMode, setCropMode] = useState("free"); // 'free', 'square', 'original'
  const [showCropControls, setShowCropControls] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
    } else {
      document.body.style.overflow = 'auto';
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.style.overflow = 'auto';
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && mode === "photo") {
      const initializeCamera = async () => {
        try {
          let constraints = {
            video: { facingMode: { exact: "environment" } },
          };

          try {
            const stream =
              await navigator.mediaDevices.getUserMedia(constraints);
            setStream(stream);
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (err) {
            const fallbackStream = await navigator.mediaDevices.getUserMedia({
              video: true,
            });
            setStream(fallbackStream);
            if (videoRef.current) {
              videoRef.current.srcObject = fallbackStream;
            }
          }

          const allDevices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = allDevices.filter(
            (device) => device.kind === "videoinput",
          );
          setDevices(videoDevices);

          const environmentIndex = videoDevices.findIndex((device) =>
            /back|environment/i.test(device.label),
          );
          setCurrentCameraIndex(environmentIndex >= 0 ? environmentIndex : 0);
        } catch (err) {
          console.error("Camera initialization error:", err);
        }
      };

      initializeCamera();
    } else if (isOpen && mode === "video") {
      initializeVideoRecorder();
    }
    return () => stopCamera();
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
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "inactive"
    ) {
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const startCamera = async (deviceId) => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
      setStream(s);
    } catch (err) {
      console.error("Camera start error:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleFlipCamera = async () => {
    if (devices.length <= 1) return;
    stopCamera();
    const nextIndex = (currentCameraIndex + 1) % devices.length;
    await startCamera(devices[nextIndex].deviceId);
    setCurrentCameraIndex(nextIndex);
  };

  const resetStates = () => {
    setPreview(null);
    setImageToCrop(null);
    setIsCropping(false);
    setIsAdjusting(false);
    setBrightness(100);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
    setIsRecording(false);
    setRecordedVideo(null);
    setCropMode("free");
    setShowCropControls(false);
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/png");
    setImageToCrop(dataUrl);
    setIsCropping(true);
    setShowCropControls(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (file.type.startsWith("image/")) {
          setImageToCrop(ev.target.result);
          setIsCropping(true);
          setShowCropControls(true);
        } else if (file.type.startsWith("video/")) {
          setPreview(ev.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = useCallback(async (brightnessValue = brightness) => {
    if (!imageToCrop || !croppedAreaPixels) return null;
    
    const image = new Image();
    image.src = imageToCrop;
    
    return new Promise((resolve) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        // Set canvas size to cropped area
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        
        // Apply rotation if needed
        if (rotation !== 0) {
          // Create a temporary canvas for rotation
          const tempCanvas = document.createElement("canvas");
          const tempCtx = tempCanvas.getContext("2d");
          
          // Calculate rotated dimensions
          const angle = rotation * Math.PI / 180;
          const sin = Math.abs(Math.sin(angle));
          const cos = Math.abs(Math.cos(angle));
          const width = Math.abs(croppedAreaPixels.width * cos + croppedAreaPixels.height * sin);
          const height = Math.abs(croppedAreaPixels.width * sin + croppedAreaPixels.height * cos);
          
          tempCanvas.width = width;
          tempCanvas.height = height;
          
          // Translate to center and rotate
          tempCtx.translate(width / 2, height / 2);
          tempCtx.rotate(angle);
          tempCtx.translate(-width / 2, -height / 2);
          
          // Draw rotated image
          tempCtx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            width,
            height
          );
          
          // Draw rotated image to final canvas
          ctx.filter = `brightness(${brightnessValue}%)`;
          ctx.drawImage(tempCanvas, 0, 0);
        } else {
          // Draw without rotation
          ctx.filter = `brightness(${brightnessValue}%)`;
          ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
          );
        }
        
        canvas.toBlob((blob) => {
          const fileUrl = URL.createObjectURL(blob);
          resolve({ url: fileUrl, blob: blob });
        }, "image/png");
      };
    });
  }, [imageToCrop, croppedAreaPixels, brightness, rotation]);

  const handleCropAndSave = async () => {
    const result = await getCroppedImg();
    if (result) {
      setPreview(result.url);
      setIsCropping(false);
      setImageToCrop(null);
      setIsAdjusting(true);
      setShowCropControls(false);
      stopCamera();
    }
  };

  const handleSaveAdjustments = async () => {
    const result = await getCroppedImg(brightness);
    if (result) {
      onImageCaptured(result.url);
      stopCamera();
      resetStates();
      onClose();
    }
  };

  const handleSave = () => {
    if (preview) {
      onImageCaptured(preview);
      stopCamera();
      resetStates();
      onClose();
    }
  };

  const handleCropModeChange = (mode) => {
    setCropMode(mode);
    switch(mode) {
      case 'square':
        setAspectRatio(1);
        break;
      case 'original':
        setAspectRatio(4/3);
        break;
      case 'free':
        setAspectRatio(undefined);
        break;
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay camera-modal-overlay"
      onClick={() => {
        stopCamera();
        resetStates();
        onClose();
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20000
      }}
    >
      <div 
        className="modal-content camera-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          maxHeight: '90vh',
          overflow: 'auto',
          maxWidth: '95vw',
          width: '100%',
          zIndex: 20001
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem 1rem',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '700',
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
            ) : isAdjusting ? (
              <>
                <MdCheck style={{ fontSize: "1.25rem" }} />
                <span>Adjust Brightness</span>
              </>
            ) : isCropping ? (
              <>
                <MdCrop style={{ fontSize: "1.25rem" }} />
                <span>Crop Image</span>
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
              background: "#f3f4f6",
              border: "none",
              fontSize: "1.25rem",
              color: "#6b7280",
              cursor: "pointer",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              flexShrink: 0,
              marginLeft: "0.5rem"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#e5e7eb"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#f3f4f6"}
          >
            ×
          </button>
        </div>

        {/* Content Area */}
        <div style={{ 
          marginBottom: "1rem",
          padding: "0 0.75rem" 
        }}>
          {mode === "photo" && !isAdjusting && isCropping && (
            <div style={{ 
              marginBottom: "0.75rem",
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              justifyContent: "center"
            }}>
              <button
                onClick={() => handleCropModeChange("free")}
                style={{
                  padding: "0.375rem 0.75rem",
                  backgroundColor: cropMode === "free" ? "#10b981" : "#f3f4f6",
                  color: cropMode === "free" ? "white" : "#374151",
                  border: "none",
                  borderRadius: "0.375rem",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                Free
              </button>
              <button
                onClick={() => handleCropModeChange("square")}
                style={{
                  padding: "0.375rem 0.75rem",
                  backgroundColor: cropMode === "square" ? "#10b981" : "#f3f4f6",
                  color: cropMode === "square" ? "white" : "#374151",
                  border: "none",
                  borderRadius: "0.375rem",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                1:1 Square
              </button>
              <button
                onClick={() => handleCropModeChange("original")}
                style={{
                  padding: "0.375rem 0.75rem",
                  backgroundColor: cropMode === "original" ? "#10b981" : "#f3f4f6",
                  color: cropMode === "original" ? "white" : "#374151",
                  border: "none",
                  borderRadius: "0.375rem",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                4:3 Original
              </button>
            </div>
          )}

          {mode === "photo" && isCropping ? (
            <div style={{ 
              position: "relative",
              width: "100%",
              height: "50vh",
              minHeight: "300px",
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "#000",
              marginBottom: "1rem"
            }}>
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={cropMode === "free" ? undefined : aspectRatio}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                style={{
                  containerStyle: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    height: '100%'
                  }
                }}
                restrictPosition={true}
                showGrid={cropMode !== "free"}
              />
              
              {/* WhatsApp-like crop controls */}
              {showCropControls && (
                <div style={{
                  position: "absolute",
                  bottom: "20px",
                  left: 0,
                  right: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "0 1rem"
                }}>
                  <button
                    onClick={() => setZoom(Math.max(1, zoom - 0.1))}
                    style={{
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
                    onMouseOver={(e) => e.target.style.backgroundColor = "rgba(0, 0, 0, 0.8)"}
                    onMouseOut={(e) => e.target.style.backgroundColor = "rgba(0, 0, 0, 0.6)"}
                  >
                    <MdZoomOut size={20} />
                  </button>
                  
                  <button
                    onClick={handleRotate}
                    style={{
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
                    onMouseOver={(e) => e.target.style.backgroundColor = "rgba(0, 0, 0, 0.8)"}
                    onMouseOut={(e) => e.target.style.backgroundColor = "rgba(0, 0, 0, 0.6)"}
                  >
                    <MdRotateRight size={20} />
                  </button>
                  
                  <button
                    onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                    style={{
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
                    onMouseOver={(e) => e.target.style.backgroundColor = "rgba(0, 0, 0, 0.8)"}
                    onMouseOut={(e) => e.target.style.backgroundColor = "rgba(0, 0, 0, 0.6)"}
                  >
                    <MdZoomIn size={20} />
                  </button>
                </div>
              )}
              
              <div style={{
                position: "absolute",
                top: "12px",
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center"
              }}>
                <button
                  onClick={handleCropAndSave}
                  style={{
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "white",
                    padding: "0.625rem 1.25rem",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
                  }}
                  onMouseOver={(e) => e.target.style.opacity = "0.9"}
                  onMouseOut={(e) => e.target.style.opacity = "1"}
                >
                  ✓ Done
                </button>
              </div>
            </div>
          ) : preview && isAdjusting ? (
            <div>
              <div style={{
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#000",
                marginBottom: "1rem",
                minHeight: "200px"
              }}>
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "40vh",
                    objectFit: "contain",
                    display: "block",
                    filter: `brightness(${brightness}%)`,
                  }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <div style={{ marginBottom: "0.75rem" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.375rem"
                  }}>
                    <label style={{
                      fontSize: "0.85rem",
                      fontWeight: "500",
                      color: "#374151"
                    }}>
                      Brightness
                    </label>
                    <span style={{
                      fontSize: "0.8rem",
                      color: "#6b7280"
                    }}>
                      {brightness}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={brightness}
                    onChange={(e) => setBrightness(e.target.value)}
                    style={{
                      width: "100%",
                      height: "6px",
                      borderRadius: "3px",
                      background: "linear-gradient(to right, #e5e7eb 0%, #e5e7eb 100%)",
                      outline: "none",
                      WebkitAppearance: "none",
                      appearance: "none"
                    }}
                  />
                </div>
                
                <button
                  onClick={handleSaveAdjustments}
                  style={{
                    background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                    color: "white",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "center",
                    width: "100%",
                    marginTop: "0.5rem"
                  }}
                  onMouseOver={(e) => e.target.style.opacity = "0.9"}
                  onMouseOut={(e) => e.target.style.opacity = "1"}
                >
                  Save Image
                </button>
              </div>
            </div>
          ) : preview && !isAdjusting ? (
            <>
              {mode === "photo" ? (
                <div style={{
                  position: "relative",
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "#000",
                  marginBottom: "1rem",
                  minHeight: "200px"
                }}>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "40vh",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </div>
              ) : (
                <div style={{
                  position: "relative",
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "#000",
                  marginBottom: "1rem",
                  minHeight: "200px"
                }}>
                  <video
                    src={preview}
                    controls
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "40vh",
                      objectFit: "contain",
                      display: "block"
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <div style={{
              position: "relative",
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "#000",
              marginBottom: "1rem",
              minHeight: "200px"
            }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={mode === "video"}
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "40vh",
                  objectFit: "contain",
                  display: "block"
                }}
              />
              
              {mode === "photo" && devices.length > 1 && (
                <button
                  onClick={handleFlipCamera}
                  style={{
                    position: "absolute",
                    top: "8px",
                    left: "8px",
                    background: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    border: "none",
                    width: "36px",
                    height: "36px",
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
                  <MdFlipCameraAndroid size={18} />
                </button>
              )}
              
              {mode === "photo" && !preview && !isCropping && !isAdjusting && (
                <div style={{
                  position: "absolute",
                  bottom: "16px",
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
                      width: "60px",
                      height: "60px",
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
                    <MdCamera size={24} />
                  </button>
                </div>
              )}
              
              {mode === "video" && (
                <div style={{
                  position: "absolute",
                  bottom: "16px",
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
                          padding: "0.625rem 1rem",
                          borderRadius: "9999px",
                          fontWeight: "600",
                          fontSize: "0.8rem",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.375rem",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
                        }}
                        onMouseOver={(e) => e.target.style.opacity = "0.9"}
                        onMouseOut={(e) => e.target.style.opacity = "1"}
                      >
                        <MdPlayArrow size={16} />
                        <span>Start</span>
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        style={{
                          background: "#dc2626",
                          color: "white",
                          padding: "0.625rem 1rem",
                          borderRadius: "9999px",
                          fontWeight: "600",
                          fontSize: "0.8rem",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.375rem",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
                        }}
                        onMouseOver={(e) => e.target.style.opacity = "0.9"}
                        onMouseOut={(e) => e.target.style.opacity = "1"}
                      >
                        <MdStop size={16} />
                        <span>Stop</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        </div>

        {/* Footer Buttons */}
        <div style={{ 
          marginTop: "0.5rem",
          padding: "0.75rem 1rem",
          borderTop: "1px solid #e5e7eb"
        }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem"
          }}>
            {mode === "photo" && !isCropping && !isAdjusting && (
              <label style={{
                background: "#16a34a",
                color: "white",
                padding: "0.75rem",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "0.85rem",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                textAlign: "center",
                width: "100%"
              }}>
                <MdFileUpload size={18} />
                <span>Choose File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>
            )}
            
            {mode === "video" && !isRecording && !preview && (
              <label style={{
                background: "#16a34a",
                color: "white",
                padding: "0.75rem",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "0.85rem",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                textAlign: "center",
                width: "100%"
              }}>
                <MdFileUpload size={18} />
                <span>Choose Video</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>
            )}
            
            {(preview && mode === "video") || (preview && !isAdjusting) ? (
              <button
                onClick={handleSave}
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                  color: "white",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "0.85rem",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "center",
                  width: "100%"
                }}
                onMouseOver={(e) => e.target.style.opacity = "0.9"}
                onMouseOut={(e) => e.target.style.opacity = "1"}
              >
                {mode === "video" ? "Use Video" : "Use Photo"}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}