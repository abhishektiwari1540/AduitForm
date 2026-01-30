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
  MdFilterAlt,
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
  const [displayScale, setDisplayScale] = useState(1);
  const [displayOffset, setDisplayOffset] = useState({ x: 0, y: 0 });
const [fontSize, setFontSize] = useState(32);

  // Check if Android device
  const isAndroid = () => {
    return /Android/i.test(navigator.userAgent);
  };

  // Check if PWA installed
  const isPWA = () => {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true ||
      document.referrer.includes("android-app://")
    );
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // For Android PWA, default to native camera for better compatibility
      if (isAndroid() && isPWA()) {
        setCameraAccessMethod("native");
      }
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
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
      // Initialize crop rectangle to cover the whole image
      setCropRect({
        x: 0,
        y: 0,
        width: imageDimensions.width,
        height: imageDimensions.height,
      });
    }
  }, [isCropping, imageToEdit, imageDimensions]);

  // Calculate display scale and offset when image dimensions change
  useEffect(() => {
    if (
      !containerRef.current ||
      !imageDimensions.width ||
      !imageDimensions.height
    )
      return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    // Calculate the scale to fit image in container while maintaining aspect ratio
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

    const scale = displayWidth / imageDimensions.width;
    setDisplayScale(scale);
    setDisplayOffset({ x: offsetX, y: offsetY });

    // Initialize drawing canvas with correct dimensions
    if (
      drawingCanvasRef.current &&
      imageDimensions.width &&
      imageDimensions.height
    ) {
      drawingCanvasRef.current.width = imageDimensions.width;
      drawingCanvasRef.current.height = imageDimensions.height;
      // Redraw elements when canvas is resized
      renderDrawing();
    }
  }, [imageDimensions, containerRef.current]);

  // FIX: Initialize drawing canvas when image loads and preserve drawings when switching modes
  useEffect(() => {
    if (imageToEdit && drawingCanvasRef.current) {
      const img = new Image();
      img.onload = () => {
        const canvas = drawingCanvasRef.current;
        if (!canvas) return;

        // Only reset canvas dimensions if they don't match
        if (canvas.width !== img.width || canvas.height !== img.height) {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        // Always render drawings when image loads
        renderDrawing();
      };
      img.src = imageToEdit;
    }
  }, [imageToEdit]);
  useEffect(() => {
  const handleKeyDown = (e) => {
    if (editorMode === "draw" && selectedElement) {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteElement(selectedElement);
      }
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [editorMode, selectedElement]);

  // FIX: Preserve drawings when switching editor modes
  useEffect(() => {
    // When switching to draw mode, ensure canvas is properly initialized
    if (editorMode === "draw" && imageToEdit && drawingCanvasRef.current) {
      const img = new Image();
      img.onload = () => {
        const canvas = drawingCanvasRef.current;
        if (!canvas) return;

        // Set canvas dimensions to match image
        if (canvas.width !== img.width || canvas.height !== img.height) {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        // Clear and redraw
        renderDrawing();
      };
      img.src = imageToEdit;
    } else if (editorMode !== "draw") {
      // When switching away from draw mode, ensure drawings are preserved
      // Just render to keep them visible
      renderDrawing();
    }
  }, [editorMode, imageToEdit]);

  useEffect(() => {
  const handleClickOutside = (e) => {
    if (textPosition && containerRef.current) {
      const textPopup = containerRef.current.querySelector('.text-popup');
      if (textPopup && !textPopup.contains(e.target)) {
        setTextPosition(null);
        setTextInput("");
      }
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  document.addEventListener('touchstart', handleClickOutside);

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
    document.removeEventListener('touchstart', handleClickOutside);
  };
}, [textPosition]);

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

      // Android-specific constraints
      if (isAndroid()) {
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

      // For Android, suggest using native camera
      if (isAndroid()) {
        setCameraError(
          "Direct camera access failed. Please use native camera.",
        );
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

      if (isAndroid()) {
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

      // Initialize MediaRecorder
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

  // ANDROID-SPECIFIC FIX: Handle file input for native camera
  const handleFileInput = (e, inputType) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset input for Android compatibility
    e.target.value = "";

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
          console.error("Failed to load image on Android");
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
      console.error("File reading error on Android");
      setCameraError("Failed to read file. Please try again.");
      setProcessingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const openNativeCamera = (inputType) => {
    setProcessingImage(true);
    if (inputType === "photo" && photoInputRef.current) {
      // Clear and trigger photo input
      photoInputRef.current.value = "";
      setTimeout(() => {
        photoInputRef.current.click();
      }, 100);
    } else if (inputType === "video" && videoInputRef.current) {
      // Clear and trigger video input
      videoInputRef.current.value = "";
      setTimeout(() => {
        videoInputRef.current.click();
      }, 100);
    }
  };

  // FIXED: Correct coordinate calculation for drawing
  const getCanvasCoordinates = (event) => {
    if (!containerRef.current || !imageDimensions.width) return { x: 0, y: 0 };

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    const clientX =
      event.clientX || (event.touches && event.touches[0].clientX);
    const clientY =
      event.clientY || (event.touches && event.touches[0].clientY);

    if (!clientX || !clientY) return { x: 0, y: 0 };

    // Calculate relative position within the displayed image area
    const relativeX = clientX - rect.left - displayOffset.x;
    const relativeY = clientY - rect.top - displayOffset.y;

    // Convert display coordinates to canvas coordinates
    const canvasX = relativeX / displayScale;
    const canvasY = relativeY / displayScale;

    // Ensure coordinates are within image bounds
    return {
      x: Math.max(0, Math.min(imageDimensions.width, canvasX)),
      y: Math.max(0, Math.min(imageDimensions.height, canvasY)),
    };
  };

  const handleMouseDown = (e) => {
  if (editorMode !== "draw") return;

  const coords = getCanvasCoordinates(e);
  const clickedElement = findElementAtPosition(coords.x, coords.y);

  if (clickedElement) {
    setSelectedElement(clickedElement);
    const offsetX = coords.x - clickedElement.x;
    const offsetY = coords.y - clickedElement.y;
    setDragOffset({ x: offsetX, y: offsetY });
    setIsDraggingElement(true);
    setShowDeleteZone(true);
    
    // If clicking on a text element and we're in text mode, don't open text popup
    if (drawTool === "text" && clickedElement.type === "text") {
      return;
    }
  } else {
    // Clicked empty space - deselect any selected element
    setSelectedElement(null);
  }

  if (drawTool === "text") {
    // Only open text popup if not clicking on existing text
    if (!clickedElement || clickedElement.type !== "text") {
      setTextPosition(coords);
    }
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
};
  const handleMouseMove = (e) => {
    if (editorMode !== "draw") return;

    const coords = getCanvasCoordinates(e);

    if (isDraggingElement && selectedElement) {
    const containerRect = containerRef.current.getBoundingClientRect();
    const deleteZoneTop = 50;
    const isOverDelete = e.clientY - containerRect.top < deleteZoneTop;
    setIsOverDeleteZone(isOverDelete);

    // Change cursor when over delete zone
    if (isOverDelete) {
      containerRef.current.style.cursor = "no-drop";
    } else {
      containerRef.current.style.cursor = "grabbing";
    }

    const newX = coords.x - dragOffset.x;
    const newY = coords.y - dragOffset.y;

    // Keep within bounds
    const boundedX = Math.max(0, Math.min(imageDimensions.width, newX));
    const boundedY = Math.max(0, Math.min(imageDimensions.height, newY));

    const updatedElements = elements.map((el) =>
      el.id === selectedElement.id ? { ...el, x: boundedX, y: boundedY } : el,
    );
    setElements(updatedElements);
    renderDrawing();
    return;
  }

  // Change cursor when hovering over selectable elements
  if (!isDrawing) {
    const coords = getCanvasCoordinates(e);
    const hoveredElement = findElementAtPosition(coords.x, coords.y);
    if (hoveredElement) {
      containerRef.current.style.cursor = "grab";
    } else {
      containerRef.current.style.cursor = drawTool === "text" ? "text" : "crosshair";
    }
  }

    if (!isDrawing) return;

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

    renderDrawing();
  };

  const handleMouseUp = () => {
  if (isDraggingElement && selectedElement) {
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

  if (drawTool === "pen" && tempElement.points.length < 2) {
    setIsDrawing(false);
    setTempElement(null);
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
  renderDrawing();
};

  // Handle touch events for mobile
  const handleTouchStart = (e) => {
  if (editorMode !== "draw") return;
  
  e.preventDefault(); // Always prevent default for touch start
  
  const coords = getCanvasCoordinates(e);
  const clickedElement = findElementAtPosition(coords.x, coords.y);
  
  // For text tool, only open popup if not clicking on existing text
  if (drawTool === "text") {
    if (!clickedElement || clickedElement.type !== "text") {
      setTextPosition(coords);
      return;
    }
  }
  
  handleMouseDown(e);
};

 const handleTouchMove = (e) => {
  if (editorMode !== "draw") return;
  
  if (isDrawing || isDraggingElement) {
    e.preventDefault(); // Only prevent default when actually drawing/dragging
  }
  
  handleMouseMove(e);
};

  const handleTouchEnd = (e) => {
    if (editorMode !== "draw") return;
    handleMouseUp();
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
    // Make text selection area larger for easier clicking
    return (
      x >= bounds.x - 30 &&
      x <= bounds.x + bounds.width + 30 &&
      y >= bounds.y - bounds.height - 30 &&
      y <= bounds.y + 30
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
    fontSize: fontSize, // Add this line
    };

    setElements([...elements, newElement]);
    saveDrawingState();
    setTextInput("");
    setTextPosition(null);
    renderDrawing();
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
      if (!element.points || element.points.length === 0) {
        return { x: 0, y: 0, width: 0, height: 0 };
      }
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
    } else if (element.type === "square") {
      return {
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
      };
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
      y: element.y - element.fontSize,
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
      if (element.points && element.points.length > 0) {
        ctx.moveTo(element.points[0].x, element.points[0].y);
        element.points.forEach((point) => {
          ctx.lineTo(point.x, point.y);
        });
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
      ctx.lineWidth = 2;
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

  const canvas = drawingCanvasRef.current;
  const ctx = canvas.getContext("2d");

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw all elements
  elements.forEach((element) => {
    drawElement(ctx, element, selectedElement?.id === element.id);
  });

  // Draw temporary element (while drawing)
  if (tempElement) {
    drawElement(ctx, tempElement);
  }

  // Draw selection border for better visibility
  if (selectedElement) {
    const bounds = getElementBounds(selectedElement);
    ctx.strokeStyle = "#10b981";
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;
    
    // Add a larger, more visible border for selected elements
    ctx.strokeRect(
      bounds.x - 15,
      bounds.y - 15,
      bounds.width + 30,
      bounds.height + 30
    );
    
    // Add corner handles for better visual feedback
    ctx.fillStyle = "#10b981";
    const handleSize = 8;
    
    // Top-left corner
    ctx.fillRect(bounds.x - 15, bounds.y - 15, handleSize, handleSize);
    // Top-right corner
    ctx.fillRect(bounds.x + bounds.width + 15 - handleSize, bounds.y - 15, handleSize, handleSize);
    // Bottom-left corner
    ctx.fillRect(bounds.x - 15, bounds.y + bounds.height + 15 - handleSize, handleSize, handleSize);
    // Bottom-right corner
    ctx.fillRect(bounds.x + bounds.width + 15 - handleSize, bounds.y + bounds.height + 15 - handleSize, handleSize, handleSize);
    
    ctx.setLineDash([]);
  }
};

  // FIX: Render drawings whenever elements change or editor mode changes
  useEffect(() => {
    renderDrawing();
  }, [elements, tempElement, selectedElement, imageDimensions, editorMode]);

  const handleSaveImage = async () => {
    if (!imageToEdit && !preview) return;

    const imageSource = imageToEdit || preview;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = imageSource;

    await new Promise((resolve) => {
      img.onload = () => {
        canvas.width = isCropping ? cropRect.width : img.width;
        canvas.height = isCropping ? cropRect.height : img.height;

        if (rotation !== 0) {
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.translate(-canvas.width / 2, -canvas.height / 2);
        }

        if (isCropping) {
          ctx.drawImage(
            img,
            cropRect.x,
            cropRect.y,
            cropRect.width,
            cropRect.height,
            0,
            0,
            canvas.width,
            canvas.height,
          );
        } else {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }

        if (rotation !== 0) {
          ctx.restore();
        }

        ctx.filter = `brightness(${brightness}%)`;
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(canvas, 0, 0);

        if (editorMode === "draw" && drawingCanvasRef.current) {
          const drawCanvas = drawingCanvasRef.current;
          const tempCanvas = document.createElement("canvas");
          const tempCtx = tempCanvas.getContext("2d");
          tempCanvas.width = drawCanvas.width;
          tempCanvas.height = drawCanvas.height;

          tempCtx.drawImage(drawCanvas, 0, 0);

          ctx.drawImage(
            tempCanvas,
            isCropping ? cropRect.x : 0,
            isCropping ? cropRect.y : 0,
            isCropping ? cropRect.width : canvas.width,
            isCropping ? cropRect.height : canvas.height,
            0,
            0,
            canvas.width,
            canvas.height,
          );
        }

        canvas.toBlob(
          (blob) => {
            const url = URL.createObjectURL(blob);
            onImageCaptured(url);
            onClose();
          },
          "image/png",
          0.9,
        );
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

  // FIXED: Correct crop overlay rendering with proper coordinate conversion
  const renderCropOverlay = () => {
  if (!containerRef.current || !imageDimensions.width || !isCropping)
    return null;

  const rect = containerRef.current.getBoundingClientRect();

  // Calculate crop rectangle position on screen using display scale and offset
  const screenX = cropRect.x * displayScale + displayOffset.x;
  const screenY = cropRect.y * displayScale + displayOffset.y;
  const screenWidth = cropRect.width * displayScale;
  const screenHeight = cropRect.height * displayScale;

  const handleMoveStart = (startX, startY) => {
    const startCrop = { ...cropRect };

    const handleMove = (moveX, moveY) => {
      const deltaX = (moveX - startX) / displayScale;
      const deltaY = (moveY - startY) / displayScale;

      setCropRect({
        x: Math.max(
          0,
          Math.min(
            imageDimensions.width - startCrop.width,
            startCrop.x + deltaX
          )
        ),
        y: Math.max(
          0,
          Math.min(
            imageDimensions.height - startCrop.height,
            startCrop.y + deltaY
          )
        ),
        width: startCrop.width,
        height: startCrop.height,
      });
    };

    const handleMoveEnd = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    const handleMouseMove = (e) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    const handleMouseUp = () => {
      handleMoveEnd();
    };

    const handleTouchEnd = () => {
      handleMoveEnd();
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleTouchEnd);
  };

  const handleCornerStart = (corner, startX, startY) => {
    const startCrop = { ...cropRect };

    const handleMove = (moveX, moveY) => {
      const deltaX = (moveX - startX) / displayScale;
      const deltaY = (moveY - startY) / displayScale;

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
        x: Math.max(0, Math.min(imageDimensions.width - newWidth, newX)),
        y: Math.max(0, Math.min(imageDimensions.height - newHeight, newY)),
        width: newWidth,
        height: newHeight,
      });
    };

    const handleMoveEnd = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    const handleMouseMove = (e) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    const handleMouseUp = () => {
      handleMoveEnd();
    };

    const handleTouchEnd = () => {
      handleMoveEnd();
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleTouchEnd);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        cursor: "move",
        zIndex: 10,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        handleMoveStart(e.clientX, e.clientY);
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
        const touch = e.touches[0];
        handleMoveStart(touch.clientX, touch.clientY);
      }}
    >
      {/* Dark overlay outside crop area */}
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

      {/* Crop rectangle */}
      <div
        style={{
          position: "absolute",
          left: `${screenX}px`,
          top: `${screenY}px`,
          width: `${screenWidth}px`,
          height: `${screenHeight}px`,
          border: "2px solid white",
          boxSizing: "border-box",
          pointerEvents: "none",
        }}
      />

      {/* Crop corners */}
      {["nw", "ne", "sw", "se"].map((corner) => {
        const style = {
          position: "absolute",
          width: "40px", // Increased size for better touch target
          height: "40px", // Increased size for better touch target
          backgroundColor: "white",
          border: "2px solid #10b981",
          borderRadius: "4px",
          pointerEvents: "auto",
          touchAction: "none", // Important for mobile touch handling
        };

        if (corner === "nw") {
          style.top = `${screenY - 20}px`;
          style.left = `${screenX - 20}px`;
          style.cursor = "nw-resize";
        } else if (corner === "ne") {
          style.top = `${screenY - 20}px`;
          style.left = `${screenX + screenWidth - 20}px`;
          style.cursor = "ne-resize";
        } else if (corner === "sw") {
          style.top = `${screenY + screenHeight - 20}px`;
          style.left = `${screenX - 20}px`;
          style.cursor = "sw-resize";
        } else if (corner === "se") {
          style.top = `${screenY + screenHeight - 20}px`;
          style.left = `${screenX + screenWidth - 20}px`;
          style.cursor = "se-resize";
        }

        return (
          <div
            key={corner}
            style={style}
            onMouseDown={(e) => {
              e.stopPropagation();
              handleCornerStart(corner, e.clientX, e.clientY);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              const touch = e.touches[0];
              handleCornerStart(corner, touch.clientX, touch.clientY);
            }}
          />
        );
      })}
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
    setDisplayScale(1);
    setDisplayOffset({ x: 0, y: 0 });

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
          overflowY: "auto", // Enable scrolling
      WebkitOverflowScrolling: "touch", //
      }}
      onClick={() => {
    // Close text popup if open
    if (textPosition) {
      setTextPosition(null);
      setTextInput("");
    } else if (!isCropping && !textPosition && !processingImage) {
      resetStates();
      onClose();
    }
  }}
    >
      {/* Hidden file inputs for Android native camera */}
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
          overflow: "auto",
          width: "95vw",
          maxWidth: "800px",
          zIndex: 20001,
          flexDirection: "column",
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
            flex: 1,
            overflow: "auto", // Allow image area to scroll if needed
            padding: "1rem",
            minHeight: "300px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {processingImage ? (
            <div
              style={{
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                overflow: "auto",
                backgroundColor: "#000",
                marginBottom: "1rem",
                minHeight: "300px",
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
                height: "50vh",
                minHeight: "300px",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#000",
                marginBottom: "1rem",
                userSelect: "none",
                WebkitUserSelect: "none",
                touchAction: "none",
              }}
             onMouseDown={editorMode === "draw" ? handleMouseDown : undefined}
  onMouseMove={editorMode === "draw" ? handleMouseMove : undefined}
  onMouseUp={editorMode === "draw" ? handleMouseUp : undefined}
  onTouchStart={editorMode === "draw" ? handleTouchStart : undefined}
  onTouchMove={editorMode === "draw" ? handleTouchMove : undefined}
  onTouchEnd={editorMode === "draw" ? handleTouchEnd : undefined}
  onTouchCancel={editorMode === "draw" ? handleTouchEnd : undefined}
             onClick={
    editorMode === "draw" && drawTool === "text"
      ? (e) => {
          // Only open text popup if not already open and not clicking on existing element
          const coords = getCanvasCoordinates(e);
          const clickedElement = findElementAtPosition(coords.x, coords.y);
          
          // Don't open text popup if we're currently dragging or have a selected element
          if (!textPosition && !isDraggingElement && (!clickedElement || clickedElement.type !== "text")) {
            setTextPosition(coords);
            setSelectedElement(null);
          }
        }
      : undefined
  }
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
                  pointerEvents: "none",
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
                    pointerEvents: "none", // Let the container handle events
                  }}
                />
              )}

   {textPosition && (
  <div
    className="text-popup"
    style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "rgba(0, 0, 0, 0.95)",
      padding: window.innerWidth < 768 ? "0.75rem" : "1rem",
      borderRadius: "0.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      minWidth: window.innerWidth < 768 ? "90vw" : "300px",
      width: window.innerWidth < 768 ? "90%" : "80%",
      maxWidth: window.innerWidth < 768 ? "400px" : "400px",
      zIndex: 100,
      boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
      border: "1px solid rgba(255,255,255,0.1)"
    }}
    onClick={(e) => {
      e.stopPropagation();
      e.preventDefault();
    }}
  >
    <span
      style={{
        color: "white",
        fontWeight: "600",
        fontSize: window.innerWidth < 768 ? "0.95rem" : "1rem",
        marginBottom: "0.5rem",
        textAlign: "center"
      }}
    >
      Add Text
    </span>
    
    {/* Font Size Range Selector */}
    <div style={{ marginBottom: "0.5rem" }}>
      <label
        style={{
          color: "white",
          fontSize: window.innerWidth < 768 ? "0.85rem" : "0.9rem",
          display: "block",
          marginBottom: "0.25rem"
        }}
      >
        Font Size: {fontSize}px
      </label>
      <input
        type="range"
        min="12"
        max="72"
        value={fontSize}
        onChange={(e) => setFontSize(parseInt(e.target.value))}
        style={{
          width: "100%",
          height: "6px",
          borderRadius: "3px",
          background: "#374151",
          outline: "none",
          WebkitAppearance: "none",
          appearance: "none"
        }}
        onClick={(e) => e.stopPropagation()}
      />
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "0.25rem"
      }}>
        <span style={{ color: "#9CA3AF", fontSize: "0.7rem" }}>12px</span>
        <span style={{ color: "#9CA3AF", fontSize: "0.7rem" }}>72px</span>
      </div>
    </div>
    
    <input
      type="text"
      value={textInput}
      onChange={(e) => setTextInput(e.target.value)}
      placeholder="Type text and press Enter..."
      autoFocus
      style={{
        padding: window.innerWidth < 768 ? "0.625rem" : "0.75rem",
        borderRadius: "0.375rem",
        border: "1px solid #4b5563",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        color: "white",
        fontSize: window.innerWidth < 768 ? "0.95rem" : "1rem",
        width: "100%",
        boxSizing: "border-box"
      }}
      onKeyPress={handleKeyPress}
      onClick={(e) => e.stopPropagation()}
    />
    
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        justifyContent: "flex-end",
        marginTop: "0.75rem"
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setTextPosition(null);
          setTextInput("");
        }}
        style={{
          padding: window.innerWidth < 768 ? "0.5rem 1rem" : "0.75rem 1.5rem",
          backgroundColor: "rgba(107, 114, 128, 0.7)",
          color: "white",
          border: "none",
          borderRadius: "0.375rem",
          cursor: "pointer",
          fontSize: window.innerWidth < 768 ? "0.85rem" : "0.9rem",
          flex: window.innerWidth < 768 ? 1 : "none",
          minWidth: window.innerWidth < 768 ? "80px" : "auto"
        }}
      >
        Cancel
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleTextSubmit();
        }}
        disabled={!textInput.trim()}
        style={{
          padding: window.innerWidth < 768 ? "0.5rem 1rem" : "0.75rem 1.5rem",
          backgroundColor: textInput.trim() ? "#10b981" : "#4b5563",
          color: "white",
          border: "none",
          borderRadius: "0.375rem",
          cursor: textInput.trim() ? "pointer" : "not-allowed",
          fontSize: window.innerWidth < 768 ? "0.85rem" : "0.9rem",
          opacity: textInput.trim() ? 1 : 0.6,
          flex: window.innerWidth < 768 ? 1 : "none",
          minWidth: window.innerWidth < 768 ? "80px" : "auto"
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
                minHeight: "300px",
              }}
            >
              <video
                src={preview}
                controls
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "50vh",
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
                minHeight: "300px",
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
                  {isAndroid() ? "Android Camera" : "Camera Access"}
                </h3>
                <p style={{ marginBottom: "1rem", fontSize: "0.9rem" }}>
                  {isAndroid() && isPWA()
                    ? "Using Android's native camera for best compatibility"
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
                  <p
                    style={{ color: "#ef4444", fontSize: "0.9rem", margin: 0 }}
                  >
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
                minHeight: "300px",
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

                  {isAndroid() && (
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
                  height: "auto",
                  maxHeight: "50vh",
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
        {/* Editor Controls */}
        {(isCropping || (mode === "photo" && preview)) && (
          <div
            style={{
              backgroundColor: "#111827",
              borderTop: "1px solid #374151",
              padding: "0.75rem",
              flexShrink: 0, // Prevent shrinking
            }}
          >
            {/* Compact Mode Selection */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "0.375rem",
                marginBottom: "0.75rem",
              }}
            >
              <button
                onClick={() => setEditorMode("crop")}
                style={{
                  flex: 1,
                  padding: "0.625rem 0.25rem",
                  backgroundColor:
                    editorMode === "crop" ? "#10b981" : "#374151",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.25rem",
                  minHeight: "52px",
                }}
              >
                <MdCrop size={16} />
                Crop
              </button>

              <button
                onClick={() => setEditorMode("draw")}
                style={{
                  flex: 1,
                  padding: "0.625rem 0.25rem",
                  backgroundColor:
                    editorMode === "draw" ? "#10b981" : "#374151",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.25rem",
                  minHeight: "52px",
                }}
              >
                <MdBrush size={16} />
                Draw
              </button>

              <button
                onClick={() => setEditorMode("filter")}
                style={{
                  flex: 1,
                  padding: "0.625rem 0.25rem",
                  backgroundColor:
                    editorMode === "filter" ? "#10b981" : "#374151",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.25rem",
                  minHeight: "52px",
                }}
              >
                <MdFilterAlt size={16} />
                Filter
              </button>
            </div>

            {/* Drawing Tools */}
            {editorMode === "draw" && (
              <div
                style={{
                  backgroundColor: "#1f2937",
                  borderRadius: "8px",
                  padding: "0.75rem",
                  marginBottom: "0.75rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "0.375rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  {[
                    { id: "pen", icon: <MdBrush size={14} />, label: "Pen" },
                    {
                      id: "arrow",
                      icon: <FaArrowRight size={12} />,
                      label: "Arrow",
                    },
                    {
                      id: "circle",
                      icon: <MdCircle size={14} />,
                      label: "Circle",
                    },
                    {
                      id: "square",
                      icon: <MdSquare size={14} />,
                      label: "Square",
                    },
                    {
                      id: "text",
                      icon: <MdTextFields size={14} />,
                      label: "Text",
                    },
                  ].map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setDrawTool(tool.id)}
                      style={{
                        flex: 1,
                        padding: "0.5rem 0.25rem",
                        backgroundColor:
                          drawTool === tool.id ? "#10b981" : "#374151",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.125rem",
                        fontSize: "0.65rem",
                        minHeight: "44px",
                      }}
                    >
                      {tool.icon}
                      {tool.label}
                    </button>
                  ))}
                </div>

                <div
                  style={{
                    marginBottom: "0.75rem",
                    padding: "0.5rem",
                    backgroundColor: "#374151",
                    borderRadius: "6px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        color: "#d1d5db",
                        fontSize: "0.75rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Color:
                    </span>
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        gap: "0.375rem",
                        justifyContent: "space-between",
                        overflowX: "auto",
                        padding: "0.125rem 0",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                    >
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
                            width: "22px",
                            height: "22px",
                            backgroundColor: color,
                            border:
                              drawColor === color
                                ? "2px solid #10b981"
                                : "1px solid #4b5563",
                            borderRadius: "50%",
                            cursor: "pointer",
                            flexShrink: 0,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                  }}
                >
                  <button
                    onClick={handleUndo}
                    disabled={historyStep <= 0}
                    style={{
                      flex: 1,
                      padding: "0.5rem",
                      backgroundColor: historyStep <= 0 ? "#4b5563" : "#374151",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: historyStep <= 0 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.375rem",
                      fontSize: "0.75rem",
                      opacity: historyStep <= 0 ? 0.5 : 1,
                    }}
                  >
                    <MdUndo size={14} />
                    Undo
                  </button>

                  <button
                    onClick={handleRedo}
                    disabled={historyStep >= drawHistory.length - 1}
                    style={{
                      flex: 1,
                      padding: "0.5rem",
                      backgroundColor:
                        historyStep >= drawHistory.length - 1
                          ? "#4b5563"
                          : "#374151",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor:
                        historyStep >= drawHistory.length - 1
                          ? "not-allowed"
                          : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.375rem",
                      fontSize: "0.75rem",
                      opacity: historyStep >= drawHistory.length - 1 ? 0.5 : 1,
                    }}
                  >
                    <MdRedo size={14} />
                    Redo
                  </button>
                </div>
              </div>
            )}

            {/* Filter Section */}
            {editorMode === "filter" && (
              <div
                style={{
                  backgroundColor: "#1f2937",
                  borderRadius: "8px",
                  padding: "0.75rem",
                  marginBottom: "0.75rem",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.375rem",
                    }}
                  >
                    <span style={{ color: "#d1d5db", fontSize: "0.75rem" }}>
                      Brightness
                    </span>
                    <span
                      style={{
                        color: "white",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                      }}
                    >
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
                      height: "6px",
                      WebkitAppearance: "none",
                      appearance: "none",
                      background:
                        "linear-gradient(90deg, #10b981 0%, #374151 100%)",
                      borderRadius: "3px",
                      outline: "none",
                      marginBottom: "0.25rem",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Rotate Buttons */}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginBottom: "0.75rem",
              }}
            >
              <button
                onClick={() => handleRotate(-90)}
                style={{
                  flex: 1,
                  padding: "0.625rem",
                  backgroundColor: "#374151",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.375rem",
                  fontSize: "0.75rem",
                }}
              >
                <MdRotateLeft size={14} />
                Rotate Left
              </button>

              <button
                onClick={() => handleRotate(90)}
                style={{
                  flex: 1,
                  padding: "0.625rem",
                  backgroundColor: "#374151",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.375rem",
                  fontSize: "0.75rem",
                }}
              >
                <MdRotateRight size={14} />
                Rotate Right
              </button>
            </div>

            {/* Save & Cancel Buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <button
                onClick={handleSaveImage}
                style={{
                  padding: "0.75rem",
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "0.875rem",
                  cursor: "pointer",
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
                  padding: "0.75rem",
                  backgroundColor: "#4b5563",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "0.875rem",
                  cursor: "pointer",
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
           .text-popup * {
    user-select: none;
    -webkit-user-select: none;
  }
      `}</style>
    </div>
  );
}
