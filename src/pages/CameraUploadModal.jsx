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
} from "react-icons/md";
import Cropper from "react-easy-crop";

export default function CameraUploadModal({
  isOpen,
  onClose,
  onImageCaptured,
  mode = "photo", // 'photo' or 'video'
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
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const [brightness, setBrightness] = useState(100);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [isAdjusting, setIsAdjusting] = useState(false); // Track if we're in brightness adjustment mode

  // Prevent body scroll when modal is open
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

      // Initialize MediaRecorder
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
    setIsAdjusting(false); // Reset adjustment state
    setBrightness(100);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setIsRecording(false);
    setRecordedVideo(null);
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
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (file.type.startsWith("image/")) {
          setImageToCrop(ev.target.result);
          setIsCropping(true);
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
    const image = new Image();
    image.src = imageToCrop;
    await new Promise((resolve) => (image.onload = resolve));
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    
    // Apply brightness filter only
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
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const fileUrl = URL.createObjectURL(blob);
        resolve({ url: fileUrl, blob: blob });
      }, "image/png");
    });
  }, [imageToCrop, croppedAreaPixels, brightness]);

  const handleCropAndSave = async () => {
    const result = await getCroppedImg();
    setPreview(result.url);
    setIsCropping(false);
    setImageToCrop(null);
    setIsAdjusting(true); // Go to adjustment mode
    stopCamera();
  };

  const handleSaveAdjustments = async () => {
    const result = await getCroppedImg(brightness);
    // Call the parent callback to save the image
    onImageCaptured(result.url);
    stopCamera();
    resetStates();
    onClose();
  };

  const handleSave = () => {
    if (preview) {
      onImageCaptured(preview);
      stopCamera();
      resetStates();
      onClose();
    }
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
      style={{ zIndex: 20000 }}
    >
      <div 
        className="modal-content camera-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxHeight: "90vh", 
          overflow: "auto",
          maxWidth: "95vw",
          width: "100%",
          zIndex: 20001 
        }}
      >
        {/* Header */}
        <div className="modal-header" style={{ padding: "0.75rem 1rem" }}>
          <h3 className="modal-title" style={{ 
            fontSize: "1rem", 
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
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
            ) : (
              <>
                <MdCamera style={{ fontSize: "1.25rem" }} />
                <span>Capture Photo</span>
              </>
            )}
          </h3>
          <button
            className="close-btn"
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
          >
            ×
          </button>
        </div>

        {/* Content Area */}
        <div className="form-group" style={{ 
          marginBottom: "1rem",
          padding: "0 0.75rem" 
        }}>
          {mode === "photo" && !isAdjusting && (
            <div className="aspect-ratio-options" style={{ 
              marginBottom: "0.75rem",
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap"
            }}>
              <label className="aspect-ratio-option" style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                cursor: "pointer",
                fontSize: "0.8rem",
                color: "#4b5563"
              }}>
                <input
                  type="radio"
                  name="aspectRatio"
                  checked={aspectRatio === 1}
                  onChange={() => setAspectRatio(1)}
                  style={{
                    width: "16px",
                    height: "16px",
                    accentColor: "#10b981"
                  }}
                />
                <span>Square (1:1)</span>
              </label>
              <label className="aspect-ratio-option" style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                cursor: "pointer",
                fontSize: "0.8rem",
                color: "#4b5563"
              }}>
                <input
                  type="radio"
                  name="aspectRatio"
                  checked={aspectRatio === 5 / 6}
                  onChange={() => setAspectRatio(5 / 6)}
                  style={{
                    width: "16px",
                    height: "16px",
                    accentColor: "#10b981"
                  }}
                />
                <span>Portrait (5:6)</span>
              </label>
            </div>
          )}

          {mode === "photo" && isCropping ? (
            <div className="cropper-container" style={{ 
              position: "relative",
              width: "100%",
              height: "40vh",
              minHeight: "200px",
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "#000",
              marginBottom: "1rem"
            }}>
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
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
              />
              <div className="crop-actions" style={{
                position: "absolute",
                bottom: "12px",
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
                >
                  Crop & Continue
                </button>
              </div>
            </div>
          ) : preview && isAdjusting ? (
            <div>
              <div className="preview-container" style={{
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

              {/* Brightness Controls with Save Button */}
              <div className="adjustment-controls" style={{ marginBottom: "1rem" }}>
                <div className="adjustment-item" style={{ marginBottom: "0.75rem" }}>
                  <div className="adjustment-label" style={{
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
                
                {/* Save Button for Adjustments */}
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
                >
                  Save Image
                </button>
              </div>
            </div>
          ) : preview && !isAdjusting ? (
            <>
              {mode === "photo" ? (
                <div className="preview-container" style={{
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
                <div className="video-preview-container" style={{
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
            <div className="camera-preview" style={{
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
              
              {/* Camera Controls */}
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
                >
                  <MdFlipCameraAndroid size={18} />
                </button>
              )}
              
              {/* Capture Button */}
              {mode === "photo" && !preview && !isCropping && !isAdjusting && (
                <div className="capture-button-container" style={{
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
                  >
                    <MdCamera size={24} />
                  </button>
                </div>
              )}
              
              {/* Video Recording Controls */}
              {mode === "video" && (
                <div className="recording-controls" style={{
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
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                          animation: "pulse 1.5s infinite"
                        }}
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
        <div className="modal-footer" style={{ 
          marginTop: "0.5rem",
          padding: "0.75rem 1rem",
          borderTop: "1px solid #e5e7eb"
        }}>
          <div className="footer-buttons" style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem"
          }}>
            {/* Choose File Button */}
            {mode === "photo" && !isCropping && !isAdjusting && (
              <label className="file-button" style={{
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
              <label className="file-button" style={{
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
            
            {/* Save/Use Button - Only show for video or when not adjusting */}
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
              >
                {mode === "video" ? "Use Video" : "Use Photo"}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Range Input Styling */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        /* Mobile Responsive Styles */
        @media (max-width: 480px) {
          .modal-content.camera-modal-content {
            max-height: 85vh !important;
            margin: 8px !important;
            padding: 0 !important;
            border-radius: 12px !important;
          }
          
          .modal-header {
            padding: 0.625rem 0.75rem !important;
          }
          
          .modal-title {
            font-size: 0.95rem !important;
          }
          
          .close-btn {
            width: 28px !important;
            height: 28px !important;
            font-size: 1.1rem !important;
          }
          
          .aspect-ratio-option span {
            font-size: 0.75rem !important;
          }
          
          .cropper-container,
          .preview-container,
          .video-preview-container,
          .camera-preview {
            min-height: 180px !important;
          }
        }
        
        @media (max-width: 375px) {
          .modal-content.camera-modal-content {
            margin: 4px !important;
          }
          
          .modal-header {
            padding: 0.5rem 0.625rem !important;
          }
          
          .modal-title {
            font-size: 0.9rem !important;
          }
          
          .aspect-ratio-option span {
            font-size: 0.7rem !important;
          }
          
          .capture-button-container button {
            width: 54px !important;
            height: 54px !important;
          }
          
          .recording-controls button {
            padding: 0.5rem 0.875rem !important;
            font-size: 0.75rem !important;
          }
          
          .footer-buttons button,
          .footer-buttons label {
            padding: 0.625rem !important;
            font-size: 0.8rem !important;
          }
        }
        
        @media (max-width: 320px) {
          .modal-content.camera-modal-content {
            margin: 2px !important;
            border-radius: 8px !important;
          }
          
          .modal-header {
            padding: 0.375rem 0.5rem !important;
          }
          
          .modal-title {
            font-size: 0.85rem !important;
            gap: 0.375rem !important;
          }
          
          .modal-title svg {
            font-size: 1rem !important;
          }
          
          .close-btn {
            width: 24px !important;
            height: 24px !important;
            font-size: 1rem !important;
            margin-left: 0.375rem !important;
          }
          
          .aspect-ratio-options {
            gap: 0.375rem !important;
          }
          
          .aspect-ratio-option {
            gap: 0.25rem !important;
          }
          
          .aspect-ratio-option span {
            font-size: 0.65rem !important;
          }
          
          .aspect-ratio-option input {
            width: 14px !important;
            height: 14px !important;
          }
          
          .cropper-container,
          .preview-container,
          .video-preview-container,
          .camera-preview {
            min-height: 160px !important;
            margin-bottom: 0.75rem !important;
          }
          
          .adjustment-controls {
            margin-bottom: 0.75rem !important;
          }
          
          .adjustment-item {
            marginBottom: 0.625rem !important;
          }
          
          .adjustment-label label,
          .adjustment-label span {
            font-size: 0.75rem !important;
          }
          
          .capture-button-container button {
            width: 48px !important;
            height: 48px !important;
            border-width: 3px !important;
          }
          
          .capture-button-container button svg {
            font-size: 20px !important;
          }
          
          .recording-controls button {
            padding: 0.375rem 0.75rem !important;
            font-size: 0.7rem !important;
            gap: 0.25rem !important;
          }
          
          .recording-controls button svg {
            font-size: 14px !important;
          }
          
          .camera-preview button {
            width: 32px !important;
            height: 32px !important;
          }
          
          .camera-preview button svg {
            font-size: 16px !important;
          }
          
          .modal-footer {
            padding: 0.625rem 0.75rem !important;
          }
          
          .footer-buttons {
            gap: 0.375rem !important;
          }
          
          .footer-buttons button,
          .footer-buttons label {
            padding: 0.5rem !important;
            font-size: 0.75rem !important;
            gap: 0.375rem !important;
          }
          
          .footer-buttons svg {
            font-size: 16px !important;
          }
          
          input[type="range"]::-webkit-slider-thumb {
            width: 16px;
            height: 16px;
          }
          
          input[type="range"]::-moz-range-thumb {
            width: 16px;
            height: 16px;
          }
        }
        
        /* Safe Area Support */
        @supports (padding: max(0px)) {
          @media (max-width: 320px) {
            .modal-content.camera-modal-content {
              padding-bottom: max(0.5rem, env(safe-area-inset-bottom)) !important;
            }
          }
        }
      `}</style>
    </div>
  );
}