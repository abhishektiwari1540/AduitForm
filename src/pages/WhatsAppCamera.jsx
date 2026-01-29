import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  MdCamera,
  MdFileUpload,
  MdFlipCameraAndroid,
  MdVideocam,
  MdStop,
  MdPlayArrow,
  MdCrop,
  MdRotateRight,
  MdRotateLeft,
  MdTextFields,
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
import { Link } from "react-router-dom";

export default function WhatsAppCamera() {
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [mode, setMode] = useState("photo");

  const handleImageCaptured = (imageUrl) => {
    setCapturedImages([
      ...capturedImages,
      {
        url: imageUrl,
        type: mode,
        timestamp: new Date().toLocaleString(),
      },
    ]);
    setCameraModalOpen(false);
  };

  const clearAllImages = () => {
    setCapturedImages([]);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f9fafb, #ffffff)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "3rem",
          maxWidth: "800px",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "#111827",
            marginBottom: "1rem",
            letterSpacing: "-0.025em",
          }}
        >
          WhatsApp Image Editor
        </h1>
        <p
          style={{
            color: "#4b5563",
            fontSize: "1.125rem",
            maxWidth: "48rem",
            margin: "0 auto",
            lineHeight: "1.6",
          }}
        >
          Capture, edit and annotate images with WhatsApp-like editing features
        </p>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
          width: "100%",
          maxWidth: "72rem",
        }}
      >
        {/* Camera Control Card */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            padding: "2rem",
            width: "100%",
            maxWidth: "600px",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            Capture & Edit Media
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <button
              onClick={() => {
                setMode("photo");
                setCameraModalOpen(true);
              }}
              style={{
                backgroundColor: "#10b981",
                color: "white",
                padding: "1.5rem",
                borderRadius: "0.75rem",
                border: "none",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#059669")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#10b981")}
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
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "1.5rem",
                borderRadius: "0.75rem",
                border: "none",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
            >
              <MdVideocam size={32} />
              <span>Record Video</span>
            </button>
          </div>

          {capturedImages.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <button
                onClick={clearAllImages}
                style={{
                  backgroundColor: "#ef4444",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#dc2626")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#ef4444")}
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Gallery Section */}
        {capturedImages.length > 0 && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "0.75rem",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              padding: "2rem",
              width: "100%",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "1.5rem",
                textAlign: "center",
              }}
            >
              Captured Media ({capturedImages.length})
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {capturedImages.map((item, index) => (
                <div
                  key={index}
                  style={{
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#f9fafb",
                  }}
                >
                  {item.type === "photo" ? (
                    <img
                      src={item.url}
                      alt={`Capture ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <video
                      src={item.url}
                      controls
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div
                    style={{
                      padding: "1rem",
                      borderTop: "1px solid #e5e7eb",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: item.type === "photo" ? "#10b981" : "#3b82f6",
                        }}
                      >
                        {item.type === "photo" ? "Photo" : "Video"}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#6b7280",
                        }}
                      >
                        {item.timestamp}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                      }}
                    >
                      <a
                        href={item.url}
                        download={`${item.type}_${index + 1}.${item.type === "photo" ? "png" : "webm"}`}
                        style={{
                          flex: 1,
                          backgroundColor: "#f3f4f6",
                          color: "#374151",
                          padding: "0.5rem",
                          borderRadius: "0.375rem",
                          fontSize: "0.875rem",
                          textAlign: "center",
                          textDecoration: "none",
                          transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#e5e7eb")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#f3f4f6")
                        }
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
                          padding: "0.5rem",
                          backgroundColor: "#fef2f2",
                          color: "#ef4444",
                          border: "none",
                          borderRadius: "0.375rem",
                          fontSize: "0.875rem",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#fee2e2")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#fef2f2")
                        }
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
      <div
        style={{
          marginTop: "3rem",
          textAlign: "center",
        }}
      >
        <Link
          to="/"
          style={{
            color: "#6b7280",
            textDecoration: "none",
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
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

// CameraModal Component - Android PWA Optimized
function CameraModal({ isOpen, onClose, onImageCaptured, mode = "photo" }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const containerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
  
  const [stream, setStream] = useState(null);
  const [devices, setDevices] = useState([]);
  const [imageToEdit, setImageToEdit] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);

  // Editor states
  const [isCropping, setIsCropping] = useState(false);
  const [cropRect, setCropRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [editorMode, setEditorMode] = useState("crop");
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);

  // Drawing states
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState("#ff0000");
  const [drawTool, setDrawTool] = useState("pen");
  const [drawHistory, setDrawHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [textInput, setTextInput] = useState("");
  const [textPosition, setTextPosition] = useState(null);
  const [tempElement, setTempElement] = useState(null);
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDraggingElement, setIsDraggingElement] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showDeleteZone, setShowDeleteZone] = useState(false);
  const [isOverDeleteZone, setIsOverDeleteZone] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [cameraType, setCameraType] = useState("environment");
  const [processingImage, setProcessingImage] = useState(false);
  const [cameraAccessMethod, setCameraAccessMethod] = useState("direct");
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [currentPointerId, setCurrentPointerId] = useState(null);
  const [drawingScale, setDrawingScale] = useState(1);
  const [drawingOffset, setDrawingOffset] = useState({ x: 0, y: 0 });

  // Check if mobile device
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const isAndroid = () => {
    return /Android/i.test(navigator.userAgent);
  };

  const isPWA = () => {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true ||
           document.referrer.includes('android-app://');
  };

  // Initialize low-latency canvas context
  const getDrawingContext = useCallback(() => {
    if (!drawingCanvasRef.current) return null;
    
    try {
      // Try to get desynchronized context for better performance
      const ctx = drawingCanvasRef.current.getContext('2d', { 
        desynchronized: true,
        alpha: true 
      });
      return ctx;
    } catch (e) {
      // Fallback to regular context
      return drawingCanvasRef.current.getContext('2d');
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Prevent all scrolling when modal is open
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.touchAction = "none";
      
      if (isMobile()) {
        setCameraAccessMethod("native");
      }
    } else {
      // Restore scrolling when modal closes
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "auto";
      document.documentElement.style.touchAction = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "auto";
      document.documentElement.style.touchAction = "auto";
      stopCamera();
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (mode === "photo" && cameraAccessMethod === "direct") {
        initializeCamera();
      } else if (mode === "video") {
        initializeVideoRecorder();
      }
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, mode, cameraAccessMethod]);

  useEffect(() => {
    if (isCropping && imageToEdit && imageDimensions.width) {
      setCropRect({
        x: 0,
        y: 0,
        width: imageDimensions.width,
        height: imageDimensions.height,
      });
    }
  }, [isCropping, imageToEdit, imageDimensions]);

  // Calculate drawing scale and offset when image loads
  useEffect(() => {
    if (!containerRef.current || !imageDimensions.width || !imageDimensions.height) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    
    // Calculate how the image is displayed within the container
    const containerAspect = containerRect.width / containerRect.height;
    const imageAspect = imageDimensions.width / imageDimensions.height;
    
    let displayWidth, displayHeight, offsetX, offsetY;
    
    if (containerAspect > imageAspect) {
      // Container is wider than image (letterboxing on sides)
      displayHeight = containerRect.height;
      displayWidth = imageAspect * displayHeight;
      offsetX = (containerRect.width - displayWidth) / 2;
      offsetY = 0;
    } else {
      // Container is taller than image (letterboxing top/bottom)
      displayWidth = containerRect.width;
      displayHeight = displayWidth / imageAspect;
      offsetX = 0;
      offsetY = (containerRect.height - displayHeight) / 2;
    }
    
    // Calculate scale from display size to actual image size
    const scale = imageDimensions.width / displayWidth;
    
    setDrawingScale(scale);
    setDrawingOffset({ x: offsetX, y: offsetY });
    
  }, [imageDimensions, containerRef.current]);

  const initializeCamera = async () => {
    try {
      setCameraError(null);
      
      const constraints = {
        video: {
          facingMode: {
            ideal: cameraType === "environment" ? "environment" : "user",
          },
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30 },
        },
        audio: false,
      };

      if (isMobile()) {
        constraints.video = {
          facingMode: {
            ideal: cameraType === "environment" ? "environment" : "user",
          },
          width: { min: 640, ideal: 1280 },
          height: { min: 480, ideal: 720 },
        };
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current
          .play()
          .catch((e) => console.warn("Video play error:", e));

        if (cameraType === "user") {
          videoRef.current.style.transform = "scaleX(-1)";
        } else {
          videoRef.current.style.transform = "none";
        }
      }

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
      
      if (isMobile()) {
        setCameraError("Direct camera access failed. Please use native camera.");
        setCameraAccessMethod("native");
      }
    }
  };

  const initializeVideoRecorder = async () => {
    try {
      setCameraError(null);

      const constraints = {
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: {
            ideal: cameraType === "environment" ? "environment" : "user",
          },
        },
        audio: true,
      };

      if (isMobile()) {
        constraints.video = {
          width: { min: 640, ideal: 1280 },
          height: { min: 480, ideal: 720 },
          facingMode: {
            ideal: cameraType === "environment" ? "environment" : "user",
          },
        };
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current
          .play()
          .catch((e) => console.warn("Video play error:", e));

        if (cameraType === "user") {
          videoRef.current.style.transform = "scaleX(-1)";
        } else {
          videoRef.current.style.transform = "none";
        }
      }

      const options = { mimeType: "video/webm;codecs=vp9,opus" };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = "video/webm;codecs=vp8,opus";
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = "video/webm";
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = "video/mp4";
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
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
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
    const videoDevices = allDevices.filter(
      (device) => device.kind === "videoinput",
    );

    const currentIndex = videoDevices.findIndex(
      (device) => device.deviceId === currentDeviceId,
    );
    const nextIndex = (currentIndex + 1) % videoDevices.length;

    try {
      const constraints = {
        video: { deviceId: { exact: videoDevices[nextIndex].deviceId } },
      };

      if (mode === "video") {
        constraints.audio = true;
      }

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current
          .play()
          .catch((e) => console.warn("Video play error:", e));

        const settings = newStream.getVideoTracks()[0].getSettings();
        if (settings.facingMode === "user") {
          videoRef.current.style.transform = "scaleX(-1)";
          setCameraType("user");
        } else {
          videoRef.current.style.transform = "none";
          setCameraType("environment");
        }
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
          const options = { mimeType: "video/webm" };
          mediaRecorderRef.current = new MediaRecorder(stream, options);
          const chunks = [];

          mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) chunks.push(event.data);
          };

          mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(chunks, { type: "video/webm" });
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

    const isFrontCamera = cameraType === "user";

    if (isFrontCamera) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      ctx.restore();
    } else {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    const dataUrl = canvas.toDataURL("image/png", 0.9);
    
    setImageToEdit(dataUrl);
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
      setIsCropping(true);
    };
    img.src = dataUrl;

    stopCamera();
  };

  const handleFileInput = (e, inputType) => {
    const file = e.target.files[0];
    if (!file) return;

    e.target.value = '';

    setProcessingImage(true);
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (inputType === "photo") {
        const img = new Image();
        img.onload = () => {
          const imageDataUrl = ev.target.result;
          setImageToEdit(imageDataUrl);
          setPreview(imageDataUrl);
          setImageDimensions({ width: img.width, height: img.height });
          setIsCropping(true);
          setProcessingImage(false);
          setCameraError(null);
          stopCamera();
        };
        img.onerror = () => {
          setCameraError("Failed to load image. Please try again.");
          setProcessingImage(false);
        };
        img.src = ev.target.result;
      } else if (inputType === "video") {
        const videoUrl = ev.target.result;
        setPreview(videoUrl);
        setProcessingImage(false);
        setCameraError(null);
      }
    };
    reader.onerror = () => {
      setCameraError("Failed to read file. Please try again.");
      setProcessingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const openNativeCamera = (inputType) => {
    setProcessingImage(true);
    if (inputType === "photo" && photoInputRef.current) {
      photoInputRef.current.value = "";
      setTimeout(() => {
        photoInputRef.current.click();
      }, 100);
    } else if (inputType === "video" && videoInputRef.current) {
      videoInputRef.current.value = "";
      setTimeout(() => {
        videoInputRef.current.click();
      }, 100);
    }
  };

  // FIXED: Unified pointer event handling for PWA
  const getCanvasCoordinates = useCallback((event) => {
    if (!containerRef.current || !imageDimensions.width || !imageDimensions.height) {
      return { x: 0, y: 0 };
    }

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Get coordinates from pointer event
    let clientX, clientY;
    if (event.type.includes('touch')) {
      // Touch event
      if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else if (event.changedTouches && event.changedTouches.length > 0) {
        clientX = event.changedTouches[0].clientX;
        clientY = event.changedTouches[0].clientY;
      }
    } else {
      // Mouse/Pointer event
      clientX = event.clientX;
      clientY = event.clientY;
    }

    // Calculate relative position within container
    const relativeX = clientX - rect.left;
    const relativeY = clientY - rect.top;

    // Apply drawing offset and scale to convert to image coordinates
    const imageX = (relativeX - drawingOffset.x) * drawingScale;
    const imageY = (relativeY - drawingOffset.y) * drawingScale;

    // Clamp to image bounds
    return {
      x: Math.max(0, Math.min(imageDimensions.width, imageX)),
      y: Math.max(0, Math.min(imageDimensions.height, imageY))
    };
  }, [imageDimensions, drawingOffset, drawingScale]);

  // Unified pointer down handler
  const handlePointerDown = useCallback((e) => {
    if (editorMode !== "draw") return;
    
    // Prevent default to stop scrolling/zooming in PWA
    e.preventDefault();
    e.stopPropagation();
    
    // Set pointer capture for consistent tracking
    if (containerRef.current && e.pointerId) {
      containerRef.current.setPointerCapture(e.pointerId);
      setCurrentPointerId(e.pointerId);
    }
    
    setIsPointerDown(true);
    
    const coords = getCanvasCoordinates(e);
    
    // Check if user clicked on existing element
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
    
    setSelectedElement(null);
    
    if (drawTool === "text") {
      setTextPosition(coords);
      return;
    }
    
    setIsDrawing(true);
    
    if (drawTool === "pen") {
      setTempElement({
        type: "pen",
        color: drawColor,
        points: [coords],
        width: 3,
      });
    } else {
      setTempElement({
        type: drawTool,
        color: drawColor,
        x: coords.x,
        y: coords.y,
        width: 0,
        height: 0,
      });
    }
  }, [editorMode, drawTool, drawColor, getCanvasCoordinates]);

  // Unified pointer move handler
  const handlePointerMove = useCallback((e) => {
    if (editorMode !== "draw" || !isPointerDown) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const coords = getCanvasCoordinates(e);
    
    if (isDraggingElement && selectedElement) {
      // Handle element dragging
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (containerRect) {
        const deleteZoneTop = 50;
        const isOverDelete = e.clientY - containerRect.top < deleteZoneTop;
        setIsOverDeleteZone(isOverDelete);
      }
      
      const newX = coords.x - dragOffset.x;
      const newY = coords.y - dragOffset.y;
      
      const updatedElements = elements.map((el) =>
        el.id === selectedElement.id ? { ...el, x: newX, y: newY } : el,
      );
      setElements(updatedElements);
      return;
    }
    
    if (!isDrawing || !tempElement) return;
    
    if (drawTool === "pen") {
      setTempElement((prev) => ({
        ...prev,
        points: [...prev.points, coords],
      }));
    } else {
      setTempElement((prev) => ({
        ...prev,
        width: coords.x - prev.x,
        height: coords.y - prev.y,
      }));
    }
    
    // Force immediate render for smooth drawing
    renderDrawing();
  }, [editorMode, isPointerDown, isDraggingElement, selectedElement, isDrawing, tempElement, drawTool, elements, dragOffset, getCanvasCoordinates]);

  // Unified pointer up handler
  const handlePointerUp = useCallback((e) => {
    if (editorMode !== "draw") return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Release pointer capture
    if (containerRef.current && currentPointerId) {
      containerRef.current.releasePointerCapture(currentPointerId);
      setCurrentPointerId(null);
    }
    
    if (isDraggingElement && selectedElement) {
      if (isOverDeleteZone) {
        deleteElement(selectedElement);
      }
      
      setIsDraggingElement(false);
      setIsOverDeleteZone(false);
      setShowDeleteZone(false);
      saveDrawingState();
      setIsPointerDown(false);
      return;
    }
    
    if (!isDrawing || !tempElement) {
      setIsPointerDown(false);
      return;
    }
    
    if (drawTool === "pen" && tempElement.points.length < 2) {
      setIsDrawing(false);
      setTempElement(null);
      setIsPointerDown(false);
      return;
    }
    
    const newElement = {
      ...tempElement,
      id: Date.now() + Math.random(),
    };
    
    setElements([...elements, newElement]);
    saveDrawingState();
    
    setIsDrawing(false);
    setTempElement(null);
    setIsPointerDown(false);
  }, [editorMode, isDraggingElement, selectedElement, isDrawing, tempElement, drawTool, elements, currentPointerId, isOverDeleteZone]);

  // Handle pointer leave/cancel
  const handlePointerCancel = useCallback((e) => {
    if (editorMode !== "draw") return;
    
    e.preventDefault();
    e.stopPropagation();
    
    if (currentPointerId && containerRef.current) {
      containerRef.current.releasePointerCapture(currentPointerId);
    }
    
    setIsPointerDown(false);
    setIsDraggingElement(false);
    setIsDrawing(false);
    setTempElement(null);
  }, [editorMode, currentPointerId]);

  // Touch-specific handlers as fallback
  const handleTouchStart = useCallback((e) => {
    handlePointerDown(e);
  }, [handlePointerDown]);

  const handleTouchMove = useCallback((e) => {
    handlePointerMove(e);
  }, [handlePointerMove]);

  const handleTouchEnd = useCallback((e) => {
    handlePointerUp(e);
  }, [handlePointerUp]);

  const findElementAtPosition = (x, y) => {
    for (const element of elements) {
      if (isPointInElement(x, y, element)) {
        return element;
      }
    }
    return null;
  };

  const isPointInElement = (x, y, element) => {
    if (element.type === "pen") {
      for (let i = 0; i < element.points.length - 1; i++) {
        const p1 = element.points[i];
        const p2 = element.points[i + 1];
        const distance = pointToLineDistance(x, y, p1.x, p1.y, p2.x, p2.y);
        if (distance < 20) return true;
      }
      return false;
    } else if (element.type === "text") {
      const bounds = getTextBounds(element);
      return (
        x >= bounds.x - 20 &&
        x <= bounds.x + bounds.width + 20 &&
        y >= bounds.y - bounds.height - 20 &&
        y <= bounds.y + 20
      );
    } else if (element.type === "circle") {
      const radius = Math.sqrt(
        Math.pow(element.width, 2) + Math.pow(element.height, 2),
      );
      const distance = Math.sqrt(
        Math.pow(x - element.x, 2) + Math.pow(y - element.y, 2),
      );
      return Math.abs(distance - radius) < 25;
    } else {
      const bounds = getElementBounds(element);
      return (
        x >= bounds.x - 20 &&
        x <= bounds.x + bounds.width + 20 &&
        y >= bounds.y - 20 &&
        y <= bounds.y + bounds.height + 20
      );
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
      type: "text",
      color: drawColor,
      text: textInput,
      x: textPosition.x,
      y: textPosition.y,
      fontSize: 32,
    };

    setElements([...elements, newElement]);
    saveDrawingState();

    setTextInput("");
    setTextPosition(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && textInput.trim()) {
      handleTextSubmit();
    }
  };

  const saveDrawingState = () => {
    const newHistory = drawHistory.slice(0, historyStep + 1);
    newHistory.push({
      elements: [...elements],
      timestamp: Date.now(),
    });
    setDrawHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      setElements(drawHistory[historyStep - 1].elements);
      renderDrawing();
    }
  };

  const handleRedo = () => {
    if (historyStep < drawHistory.length - 1) {
      setHistoryStep(historyStep + 1);
      setElements(drawHistory[historyStep + 1].elements);
      renderDrawing();
    }
  };

  const deleteElement = (element) => {
    const newElements = elements.filter((el) => el.id !== element.id);
    setElements(newElements);
    setSelectedElement(null);
    saveDrawingState();
    renderDrawing();
  };

  const getElementBounds = (element) => {
    if (element.type === "arrow") {
      return {
        x: Math.min(element.x, element.x + element.width),
        y: Math.min(element.y, element.y + element.height),
        width: Math.abs(element.width),
        height: Math.abs(element.height),
      };
    } else if (element.type === "pen") {
      const minX = Math.min(...element.points.map((p) => p.x));
      const minY = Math.min(...element.points.map((p) => p.y));
      const maxX = Math.max(...element.points.map((p) => p.x));
      const maxY = Math.max(...element.points.map((p) => p.y));
      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
      };
    } else if (element.type === "circle") {
      const radius = Math.sqrt(
        Math.pow(element.width, 2) + Math.pow(element.height, 2),
      );
      return {
        x: element.x - radius,
        y: element.y - radius,
        width: radius * 2,
        height: radius * 2,
      };
    } else if (element.type === "text") {
      return getTextBounds(element);
    }
    return element;
  };

  const getTextBounds = (element) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = `${element.fontSize}px Arial`;
    const width = ctx.measureText(element.text).width;
    return {
      x: element.x,
      y: element.y,
      width: width,
      height: element.fontSize,
    };
  };

  const drawElement = (ctx, element, isSelected = false) => {
    ctx.strokeStyle = element.color;
    ctx.fillStyle = element.color;
    ctx.lineWidth = element.type === "pen" ? element.width : 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (element.type === "pen") {
      ctx.beginPath();
      if (element.points.length === 1) {
        ctx.arc(element.points[0].x, element.points[0].y, element.width / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.moveTo(element.points[0].x, element.points[0].y);
        for (let i = 1; i < element.points.length; i++) {
          ctx.lineTo(element.points[i].x, element.points[i].y);
        }
        ctx.stroke();
      }
    } else if (element.type === "arrow") {
      const fromX = element.x;
      const fromY = element.y;
      const toX = element.x + element.width;
      const toY = element.y + element.height;

      const headLength = 25;
      const angle = Math.atan2(toY - fromY, toX - fromX);

      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(toX, toY);
      ctx.lineTo(
        toX - headLength * Math.cos(angle - Math.PI / 6),
        toY - headLength * Math.sin(angle - Math.PI / 6),
      );
      ctx.lineTo(
        toX - headLength * Math.cos(angle + Math.PI / 6),
        toY - headLength * Math.sin(angle + Math.PI / 6),
      );
      ctx.lineTo(toX, toY);
      ctx.fill();
    } else if (element.type === "circle") {
      const radius = Math.sqrt(
        Math.pow(element.width, 2) + Math.pow(element.height, 2),
      );
      ctx.beginPath();
      ctx.arc(element.x, element.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (element.type === "square") {
      ctx.strokeRect(element.x, element.y, element.width, element.height);
    } else if (element.type === "text") {
      ctx.font = `${element.fontSize}px Arial`;
      ctx.fillText(element.text, element.x, element.y);
    }

    if (isSelected) {
      const bounds = getElementBounds(element);

      ctx.strokeStyle = "#10b981";
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 3;
      ctx.strokeRect(
        bounds.x - 10,
        bounds.y - 10,
        bounds.width + 20,
        bounds.height + 20,
      );
      ctx.setLineDash([]);
    }
  };

  const renderDrawing = () => {
    if (!drawingCanvasRef.current || !imageDimensions.width) return;

    const ctx = getDrawingContext();
    if (!ctx) return;

    ctx.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);

    // Draw all elements
    elements.forEach((element) => {
      drawElement(ctx, element, selectedElement?.id === element.id);
    });

    // Draw temporary element (currently being drawn)
    if (tempElement) {
      drawElement(ctx, tempElement);
    }
  };

  useEffect(() => {
    renderDrawing();
  }, [elements, tempElement, selectedElement, imageDimensions, getDrawingContext]);

  useEffect(() => {
    if (imageToEdit && editorMode === "draw" && drawingCanvasRef.current) {
      const img = new Image();
      img.onload = () => {
        const canvas = drawingCanvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
        setElements([]);
        setDrawHistory([]);
        setHistoryStep(-1);
        renderDrawing();
      };
      img.src = imageToEdit;
    }
  }, [imageToEdit, editorMode, getDrawingContext]);

  const handleSaveImage = async () => {
    if (!imageToEdit && !preview) return;
    
    const imageSource = imageToEdit || preview;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.src = imageSource;
    
    await new Promise((resolve) => {
      img.onload = () => {
        canvas.width = isCropping ? cropRect.width : img.width;
        canvas.height = isCropping ? cropRect.height : img.height;
        
        if (rotation !== 0) {
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(rotation * Math.PI / 180);
          ctx.translate(-canvas.width / 2, -canvas.height / 2);
        }
        
        if (isCropping) {
          ctx.drawImage(
            img,
            cropRect.x, cropRect.y, cropRect.width, cropRect.height,
            0, 0, canvas.width, canvas.height
          );
        } else {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        
        if (rotation !== 0) {
          ctx.restore();
        }
        
        ctx.filter = `brightness(${brightness}%)`;
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(canvas, 0, 0);
        
        if (editorMode === 'draw' && drawingCanvasRef.current) {
          const drawCanvas = drawingCanvasRef.current;
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          tempCanvas.width = drawCanvas.width;
          tempCanvas.height = drawCanvas.height;
          
          tempCtx.drawImage(drawCanvas, 0, 0);
          
          ctx.drawImage(
            tempCanvas,
            isCropping ? cropRect.x : 0,
            isCropping ? cropRect.y : 0,
            isCropping ? cropRect.width : canvas.width,
            isCropping ? cropRect.height : canvas.height,
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

  const handleRotate = (degrees) => {
    setRotation((prev) => (prev + degrees) % 360);
  };

  const renderCropOverlay = () => {
    if (!containerRef.current || !imageDimensions.width) return null;

    const rect = containerRef.current.getBoundingClientRect();
    
    const containerAspect = rect.width / rect.height;
    const imageAspect = imageDimensions.width / imageDimensions.height;
    
    let displayWidth, displayHeight, offsetX, offsetY;
    
    if (containerAspect > imageAspect) {
      displayHeight = rect.height;
      displayWidth = imageAspect * displayHeight;
      offsetX = (rect.width - displayWidth) / 2;
      offsetY = 0;
    } else {
      displayWidth = rect.width;
      displayHeight = displayWidth / imageAspect;
      offsetX = 0;
      offsetY = (rect.height - displayHeight) / 2;
    }

    const scale = imageDimensions.width / displayWidth;

    const screenX = cropRect.x / scale + offsetX;
    const screenY = cropRect.y / scale + offsetY;
    const screenWidth = cropRect.width / scale;
    const screenHeight = cropRect.height / scale;

    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          cursor: "move",
          touchAction: "none",
        }}
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const startX = e.clientX;
          const startY = e.clientY;
          const startCrop = { ...cropRect };

          const handlePointerMove = (moveEvent) => {
            moveEvent.preventDefault();
            const moveX = moveEvent.clientX;
            const moveY = moveEvent.clientY;
            const deltaX = (moveX - startX) * scale;
            const deltaY = (moveY - startY) * scale;

            setCropRect({
              x: Math.max(
                0,
                Math.min(
                  imageDimensions.width - startCrop.width,
                  startCrop.x + deltaX,
                ),
              ),
              y: Math.max(
                0,
                Math.min(
                  imageDimensions.height - startCrop.height,
                  startCrop.y + deltaY,
                ),
              ),
              width: startCrop.width,
              height: startCrop.height,
            });
          };

          const handlePointerUp = () => {
            document.removeEventListener("pointermove", handlePointerMove);
            document.removeEventListener("pointerup", handlePointerUp);
          };

          document.addEventListener("pointermove", handlePointerMove);
          document.addEventListener("pointerup", handlePointerUp);
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: `${screenX}px`,
            top: `${screenY}px`,
            width: `${screenWidth}px`,
            height: `${screenHeight}px`,
            border: "2px solid white",
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
            boxSizing: "border-box",
          }}
        >
          {["nw", "ne", "sw", "se"].map((corner) => {
            const style = {
              position: "absolute",
              width: "30px",
              height: "30px",
              backgroundColor: "white",
              border: "2px solid #10b981",
              borderRadius: "4px",
              touchAction: "none",
            };

            if (corner === "nw") {
              style.top = "-15px";
              style.left = "-15px";
              style.cursor = "nw-resize";
            } else if (corner === "ne") {
              style.top = "-15px";
              style.right = "-15px";
              style.cursor = "ne-resize";
            } else if (corner === "sw") {
              style.bottom = "-15px";
              style.left = "-15px";
              style.cursor = "sw-resize";
            } else if (corner === "se") {
              style.bottom = "-15px";
              style.right = "-15px";
              style.cursor = "se-resize";
            }

            return (
              <div
                key={corner}
                style={style}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const startX = e.clientX;
                  const startY = e.clientY;
                  const startCrop = { ...cropRect };

                  const handlePointerMove = (moveEvent) => {
                    moveEvent.preventDefault();
                    const moveX = moveEvent.clientX;
                    const moveY = moveEvent.clientY;
                    const deltaX = (moveX - startX) * scale;
                    const deltaY = (moveY - startY) * scale;

                    let newWidth = startCrop.width;
                    let newHeight = startCrop.height;
                    let newX = startCrop.x;
                    let newY = startCrop.y;

                    if (corner === "nw") {
                      newWidth = Math.max(100, startCrop.width - deltaX);
                      newHeight = Math.max(100, startCrop.height - deltaY);
                      newX = startCrop.x + deltaX;
                      newY = startCrop.y + deltaY;
                    } else if (corner === "ne") {
                      newWidth = Math.max(100, startCrop.width + deltaX);
                      newHeight = Math.max(100, startCrop.height - deltaY);
                      newY = startCrop.y + deltaY;
                    } else if (corner === "sw") {
                      newWidth = Math.max(100, startCrop.width - deltaX);
                      newHeight = Math.max(100, startCrop.height + deltaY);
                      newX = startCrop.x + deltaX;
                    } else if (corner === "se") {
                      newWidth = Math.max(100, startCrop.width + deltaX);
                      newHeight = Math.max(100, startCrop.height + deltaY);
                    }

                    setCropRect({
                      x: Math.max(
                        0,
                        Math.min(imageDimensions.width - newWidth, newX),
                      ),
                      y: Math.max(
                        0,
                        Math.min(imageDimensions.height - newHeight, newY),
                      ),
                      width: newWidth,
                      height: newHeight,
                    });
                  };

                  const handlePointerUp = () => {
                    document.removeEventListener("pointermove", handlePointerMove);
                    document.removeEventListener("pointerup", handlePointerUp);
                  };

                  document.addEventListener("pointermove", handlePointerMove);
                  document.addEventListener("pointerup", handlePointerUp);
                }}
              />
            );
          })}
        </div>
      </div>
    );
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
    setEditorMode("crop");
    setDrawColor("#ff0000");
    setDrawTool("pen");
    setTextInput("");
    setTextPosition(null);
    setSelectedElement(null);
    setShowDeleteZone(false);
    setIsOverDeleteZone(false);
    setCameraError(null);
    setProcessingImage(false);
    setIsPointerDown(false);
    setCurrentPointerId(null);
    setDrawingScale(1);
    setDrawingOffset({ x: 0, y: 0 });
    
    stopCamera();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 20000,
        overflow: "hidden",
        touchAction: "none",
      }}
      onClick={(e) => {
        if (!isCropping && !textPosition && !processingImage && e.target === e.currentTarget) {
          resetStates();
          onClose();
        }
      }}
    >
      {/* Hidden file inputs */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        capture={cameraType === "environment" ? "environment" : "user"}
        onChange={(e) => handleFileInput(e, "photo")}
        style={{ display: "none" }}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        capture={cameraType === "environment" ? "environment" : "user"}
        onChange={(e) => handleFileInput(e, "video")}
        style={{ display: "none" }}
      />

      <div
        style={{
          backgroundColor: "#1f2937",
          borderRadius: "0.75rem",
          maxHeight: "95vh",
          overflow: "hidden",
          width: "95vw",
          maxWidth: "800px",
          zIndex: 20001,
          display: "flex",
          flexDirection: "column",
          touchAction: "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem",
            borderBottom: "1px solid #374151",
            flexShrink: 0,
          }}
        >
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: "700",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              margin: 0,
            }}
          >
            {processingImage ? (
              <>
                <MdCamera style={{ fontSize: "1.25rem" }} />
                <span>Loading Image...</span>
              </>
            ) : mode === "video" ? (
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
            }}
          >
            ×
          </button>
        </div>

        {/* Main Content Area */}
        <div
          style={{
            padding: "1rem",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minHeight: 0,
            touchAction: "none",
          }}
        >
          {processingImage ? (
            <div
              style={{
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#000",
                marginBottom: "1rem",
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  border: "4px solid #f3f4f6",
                  borderTop: "4px solid #10b981",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  marginBottom: "1rem",
                }}
              />
              <h3 style={{ color: "white", marginBottom: "0.5rem" }}>
                Processing Image...
              </h3>
              <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                Please wait while your image loads
              </p>
            </div>
          ) : isCropping || (mode === "photo" && preview) ? (
            <div
              ref={containerRef}
              style={{
                position: "relative",
                width: "100%",
                flex: 1,
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#000",
                marginBottom: "1rem",
                minHeight: 0,
                touchAction: editorMode === "draw" ? "none" : "auto",
              }}
              // Unified pointer events for PWA
              onPointerDown={editorMode === "draw" ? handlePointerDown : undefined}
              onPointerMove={editorMode === "draw" ? handlePointerMove : undefined}
              onPointerUp={editorMode === "draw" ? handlePointerUp : undefined}
              onPointerCancel={editorMode === "draw" ? handlePointerCancel : undefined}
              onPointerLeave={editorMode === "draw" ? handlePointerCancel : undefined}
              // Touch fallbacks for older browsers
              onTouchStart={editorMode === "draw" ? handleTouchStart : undefined}
              onTouchMove={editorMode === "draw" ? handleTouchMove : undefined}
              onTouchEnd={editorMode === "draw" ? handleTouchEnd : undefined}
              onTouchCancel={editorMode === "draw" ? handlePointerCancel : undefined}
              onClick={editorMode === "draw" && drawTool === "text" ? (e) => {
                const coords = getCanvasCoordinates(e);
                setTextPosition(coords);
                setSelectedElement(null);
              } : undefined}
            >
              <img
                src={imageToEdit || preview}
                alt="Edit preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transform: `rotate(${rotation}deg)`,
                  filter: `brightness(${brightness}%)`,
                }}
              />

              {showDeleteZone && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "60px",
                    backgroundColor: isOverDeleteZone
                      ? "rgba(239, 68, 68, 0.8)"
                      : "rgba(239, 68, 68, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 0.3s ease",
                    zIndex: 50,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "white",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                    }}
                  >
                    <MdDelete size={28} />
                    <span>Drag here to delete</span>
                  </div>
                </div>
              )}

              {editorMode === "crop" && renderCropOverlay()}

              {editorMode === "draw" && (
                <canvas
                  ref={drawingCanvasRef}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    cursor: drawTool === "text" ? "text" : "crosshair",
                    touchAction: "none",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    msUserSelect: "none",
                  }}
                />
              )}

              {textPosition && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.85)",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    minWidth: "300px",
                    width: "80%",
                    maxWidth: "400px",
                    zIndex: 100,
                  }}
                >
                  <span
                    style={{
                      color: "white",
                      fontWeight: "600",
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Add Text
                  </span>
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type text and press Enter..."
                    autoFocus
                    style={{
                      padding: "0.75rem",
                      borderRadius: "0.25rem",
                      border: "1px solid #4b5563",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      color: "white",
                      fontSize: "1rem",
                    }}
                    onKeyPress={handleKeyPress}
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      justifyContent: "flex-end",
                      marginTop: "0.5rem",
                    }}
                  >
                    <button
                      onClick={() => {
                        setTextPosition(null);
                        setTextInput("");
                      }}
                      style={{
                        padding: "0.75rem 1.5rem",
                        backgroundColor: "rgba(107, 114, 128, 0.5)",
                        color: "white",
                        border: "none",
                        borderRadius: "0.25rem",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleTextSubmit}
                      disabled={!textInput.trim()}
                      style={{
                        padding: "0.75rem 1.5rem",
                        backgroundColor: textInput.trim() ? "#10b981" : "#4b5563",
                        color: "white",
                        border: "none",
                        borderRadius: "0.25rem",
                        cursor: textInput.trim() ? "pointer" : "not-allowed",
                        fontSize: "0.9rem",
                        opacity: textInput.trim() ? 1 : 0.5,
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : mode === "video" && preview ? (
            <div
              style={{
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#000",
                marginBottom: "1rem",
                flex: 1,
              }}
            >
              <video
                src={preview}
                controls
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
          ) : mode === "photo" && cameraAccessMethod === "native" ? (
            <div
              style={{
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#000",
                marginBottom: "1rem",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
              }}
            >
              <div
                style={{
                  color: "white",
                  textAlign: "center",
                  marginBottom: "2rem",
                }}
              >
                <MdCamera size={48} style={{ marginBottom: "1rem" }} />
                <h3 style={{ marginBottom: "0.5rem" }}>
                  {isMobile() ? "Device Camera" : "Camera Access"}
                </h3>
                <p style={{ marginBottom: "1rem", fontSize: "0.9rem" }}>
                  {isMobile() && isPWA()
                    ? "Using device's native camera for best compatibility"
                    : "Take a photo using your device's camera"}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  marginBottom: "2rem",
                }}
              >
                <button
                  onClick={() => {
                    setCameraType("environment");
                    openNativeCamera("photo");
                  }}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#374151",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    minWidth: "140px",
                  }}
                >
                  <MdCamera size={20} />
                  Rear Camera
                </button>

                <button
                  onClick={() => {
                    setCameraType("user");
                    openNativeCamera("photo");
                  }}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#374151",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    minWidth: "140px",
                  }}
                >
                  <MdFlipCameraAndroid size={20} />
                  Front Camera
                </button>
              </div>

              {cameraError && (
                <div
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid #ef4444",
                    borderRadius: "0.5rem",
                    padding: "1rem",
                    marginBottom: "1rem",
                    width: "100%",
                  }}
                >
                  <p style={{ color: "#ef4444", fontSize: "0.9rem", margin: 0 }}>
                    {cameraError}
                  </p>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <button
                  onClick={() => {
                    setCameraAccessMethod("direct");
                    initializeCamera();
                  }}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#6b7280",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    flex: 1,
                    maxWidth: "200px",
                  }}
                >
                  Use Web Camera
                </button>

                <button
                  onClick={() => {
                    resetStates();
                    onClose();
                  }}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    flex: 1,
                    maxWidth: "200px",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#000",
                marginBottom: "1rem",
                flex: 1,
                minHeight: 0,
              }}
            >
              {cameraError && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2rem",
                    zIndex: 10,
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  <MdCamera size={48} style={{ marginBottom: "1rem" }} />
                  <h3 style={{ marginBottom: "0.5rem" }}>
                    Camera Access Issue
                  </h3>
                  <p style={{ marginBottom: "1rem", fontSize: "0.9rem" }}>
                    {cameraError}
                  </p>

                  {isMobile() && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                        width: "100%",
                        maxWidth: "300px",
                      }}
                    >
                      <button
                        onClick={() => {
                          setCameraError(null);
                          initializeCamera();
                        }}
                        style={{
                          padding: "0.75rem 1.5rem",
                          backgroundColor: "#10b981",
                          color: "white",
                          border: "none",
                          borderRadius: "0.5rem",
                          cursor: "pointer",
                        }}
                      >
                        Retry Web Camera
                      </button>

                      <button
                        onClick={() => {
                          setCameraAccessMethod("native");
                          setCameraError(null);
                        }}
                        style={{
                          padding: "0.75rem 1.5rem",
                          backgroundColor: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "0.5rem",
                          cursor: "pointer",
                        }}
                      >
                        Use Native Camera
                      </button>
                    </div>
                  )}
                </div>
              )}

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={mode === "video"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                  transform: cameraType === "user" ? "scaleX(-1)" : "none",
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
                  }}
                >
                  <MdFlipCameraAndroid size={24} />
                </button>
              )}

              {mode === "photo" && !isCropping && !cameraError && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
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
                    }}
                  >
                    <MdCamera size={32} />
                  </button>
                </div>
              )}

              {mode === "video" && !cameraError && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
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
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
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
        {(isCropping || (mode === "photo" && preview)) && (
          <div
            style={{
              padding: "1rem",
              borderTop: "1px solid #374151",
              backgroundColor: "#111827",
              flexShrink: 0,
              overflow: "auto",
              maxHeight: "40vh",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => setEditorMode("crop")}
                style={{
                  padding: "0.75rem 1rem",
                  backgroundColor:
                    editorMode === "crop" ? "#10b981" : "#374151",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "all 0.2s ease",
                  minWidth: "100px",
                }}
              >
                <MdCrop size={18} />
                Crop
              </button>

              <button
                onClick={() => setEditorMode("draw")}
                style={{
                  padding: "0.75rem 1rem",
                  backgroundColor:
                    editorMode === "draw" ? "#10b981" : "#374151",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "all 0.2s ease",
                  minWidth: "100px",
                }}
              >
                <MdBrush size={18} />
                Draw
              </button>

              <button
                onClick={() => setEditorMode("filter")}
                style={{
                  padding: "0.75rem 1rem",
                  backgroundColor:
                    editorMode === "filter" ? "#10b981" : "#374151",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "all 0.2s ease",
                  minWidth: "100px",
                }}
              >
                Filter
              </button>
            </div>

            {editorMode === "draw" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() => setDrawTool("pen")}
                    style={{
                      padding: "0.75rem",
                      backgroundColor:
                        drawTool === "pen" ? "#10b981" : "#374151",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      minWidth: "60px",
                    }}
                  >
                    <MdBrush size={22} />
                  </button>
                  <button
                    onClick={() => setDrawTool("arrow")}
                    style={{
                      padding: "0.75rem",
                      backgroundColor:
                        drawTool === "arrow" ? "#10b981" : "#374151",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      minWidth: "60px",
                    }}
                  >
                    <FaArrowRight size={20} />
                  </button>
                  <button
                    onClick={() => setDrawTool("circle")}
                    style={{
                      padding: "0.75rem",
                      backgroundColor:
                        drawTool === "circle" ? "#10b981" : "#374151",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      minWidth: "60px",
                    }}
                  >
                    <MdCircle size={22} />
                  </button>
                  <button
                    onClick={() => setDrawTool("square")}
                    style={{
                      padding: "0.75rem",
                      backgroundColor:
                        drawTool === "square" ? "#10b981" : "#374151",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      minWidth: "60px",
                    }}
                  >
                    <MdSquare size={22} />
                  </button>
                  <button
                    onClick={() => setDrawTool("text")}
                    style={{
                      padding: "0.75rem",
                      backgroundColor:
                        drawTool === "text" ? "#10b981" : "#374151",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      minWidth: "60px",
                    }}
                  >
                    <MdTextFields size={22} />
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                    Color:
                  </span>
                  {[
                    "#ff0000",
                    "#00ff00",
                    "#0000ff",
                    "#ffff00",
                    "#ff00ff",
                    "#ffffff",
                    "#000000",
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => setDrawColor(color)}
                      style={{
                        width: "32px",
                        height: "32px",
                        backgroundColor: color,
                        border:
                          drawColor === color
                            ? "3px solid #10b981"
                            : "2px solid #6b7280",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={handleUndo}
                    disabled={historyStep <= 0}
                    style={{
                      padding: "0.75rem 1.5rem",
                      backgroundColor: historyStep <= 0 ? "#4b5563" : "#374151",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      cursor: historyStep <= 0 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      opacity: historyStep <= 0 ? 0.5 : 1,
                      minWidth: "120px",
                    }}
                  >
                    <MdUndo size={22} />
                    Undo
                  </button>
                  <button
                    onClick={handleRedo}
                    disabled={historyStep >= drawHistory.length - 1}
                    style={{
                      padding: "0.75rem 1.5rem",
                      backgroundColor:
                        historyStep >= drawHistory.length - 1
                          ? "#4b5563"
                          : "#374151",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      cursor:
                        historyStep >= drawHistory.length - 1
                          ? "not-allowed"
                          : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      opacity: historyStep >= drawHistory.length - 1 ? 0.5 : 1,
                      minWidth: "120px",
                    }}
                  >
                    <MdRedo size={22} />
                    Redo
                  </button>
                </div>
              </div>
            )}

            {editorMode === "filter" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <span style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                      Brightness
                    </span>
                    <span style={{ color: "white", fontSize: "0.9rem" }}>
                      {brightness}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    style={{
                      width: "100%",
                      height: "30px",
                      WebkitAppearance: "none",
                      appearance: "none",
                      background: "transparent",
                    }}
                  />
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                marginBottom: "1rem",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => handleRotate(-90)}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#374151",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  minWidth: "140px",
                }}
              >
                <MdRotateLeft size={20} />
                Rotate Left
              </button>

              <button
                onClick={() => handleRotate(90)}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#374151",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  minWidth: "140px",
                }}
              >
                <MdRotateRight size={20} />
                Rotate Right
              </button>
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
              }}
            >
              <button
                onClick={handleSaveImage}
                style={{
                  flex: 1,
                  padding: "1rem",
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
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
                  padding: "1rem 1.5rem",
                  backgroundColor: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        {!isCropping && !processingImage && mode === "photo" && !preview && (
          <div
            style={{
              padding: "1rem",
              borderTop: "1px solid #374151",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <button
                onClick={() => openNativeCamera("photo")}
                style={{
                  background: "#374151",
                  color: "white",
                  padding: "1rem",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <MdFileUpload size={20} />
                <span>Use Native Camera</span>
              </button>
            </div>
          </div>
        )}

        {!isCropping && !processingImage && mode === "video" && !preview && (
          <div
            style={{
              padding: "1rem",
              borderTop: "1px solid #374151",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <button
                onClick={() => openNativeCamera("video")}
                style={{
                  background: "#374151",
                  color: "white",
                  padding: "1rem",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <MdFileUpload size={20} />
                <span>Use Native Camera</span>
              </button>
            </div>
          </div>
        )}

        {preview && mode === "video" && (
          <div
            style={{
              padding: "1rem",
              borderTop: "1px solid #374151",
              flexShrink: 0,
            }}
          >
            <button
              onClick={handleSaveVideo}
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                color: "white",
                padding: "1rem",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "1rem",
                border: "none",
                cursor: "pointer",
                textAlign: "center",
                width: "100%",
              }}
            >
              Use Video
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}