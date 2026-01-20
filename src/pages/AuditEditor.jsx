import React, { useState, useEffect, useRef } from "react";
import CameraUploadModal from "./CameraUploadModal";
export default function AuditEditorPage() {
  // State management
  const [checklistData, setChecklistData] = useState({
    id: "page-1",
    title: "Food Production & Safety Checklist With A Long Name",
    pageNumber: "Page 1 of 1",
    categories: [
      {
        id: "category-storage",
        title: "Food Storage Procedures",
        isApplicable: true,
        isExpanded: true,
        subcategories: [
          {
            id: "subcategory-fridge-temp",
            title: "Refrigeration Temperatures",
            isApplicable: true,
            isExpanded: true,
            info: "Ensure refrigerators are maintained at proper temperatures",
            infoAttachment: null,
            questions: [
              {
                id: "q5",
                text: "Are refrigerators kept at or below 40°F (4°C)?",
                maxMarks: 2,
                selectedAnswerMarks: null,
                riskLevel: "high",
                answers: [
                  { text: "Yes", marks: 2 },
                  { text: "No", marks: 0 },
                ],
                comments: [],
              },
            ],
          },
        ],
      },
    ],
  });

  // State for active headers
  const [activeHeaders, setActiveHeaders] = useState({
    page: true,
    categories: {},
    subcategories: {},
  });

  const [unitDetails, setUnitDetails] = useState({
    companyName: "",
    representativeName: "",
    completeAddress: "",
    contactNumber: "",
    email: "",
    scheduledManday: "",
    auditScope: "",
    auditDateFrom: "",
    auditDateTo: "",
  });

  const [auditStartTime, setAuditStartTime] = useState(null);
  const [activeTime, setActiveTime] = useState(0);
  const [pauseTime, setPauseTime] = useState(0);
  const [isAuditStarted, setIsAuditStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [geotagLocation, setGeotagLocation] = useState("");
  const [mobileStep, setMobileStep] = useState(1);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const timerIntervalRef = useRef(null);
  const pauseStartTimeRef = useRef(null);
  const totalPauseTimeRef = useRef(0);
  const [activeBtn, setActiveBtn] = useState(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [mediaUploadType, setMediaUploadType] = useState(null); // 'camera', 'video', or 'gallery'
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    const requiredFields = [
      "companyName",
      "representativeName",
      "completeAddress",
      "contactNumber",
    ];
    const filled = requiredFields.every(
      (field) => unitDetails[field].trim() !== "",
    );
    setAllFieldsFilled(filled);
  }, [unitDetails]);
  const handleNextStep = () => {
    if (allFieldsFilled && !isAuditStarted) {
      setMobileStep(2);
      handleStartAudit();
    }
  };
  const handlePrevStep = () => {
    setMobileStep(1);
    handleCompleteAudit();
  };
  // Timer functions
  const formatTime = (ms) => {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleGetGeotag = () => {
    setGeotagLocation("Fetching...");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setGeotagLocation(
            `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`,
          );
        },
        (error) => {
          setGeotagLocation("Error fetching location");
          console.error("Geolocation error:", error);
        },
      );
    } else {
      setGeotagLocation("Geolocation not supported");
    }
  };

  const handleStartAudit = () => {
    const now = new Date();
    setAuditStartTime(now);
    setIsAuditStarted(true);

    timerIntervalRef.current = setInterval(() => {
      if (!isPaused) {
        setActiveTime((prev) => prev + 1000);
      } else {
        setPauseTime((prev) => prev + 1000);
      }
    }, 1000);
  };

  const handlePauseAudit = () => {
    setIsPaused(true);
    pauseStartTimeRef.current = Date.now();
  };

  const handleResumeAudit = () => {
    setIsPaused(false);
    if (pauseStartTimeRef.current) {
      const pauseDuration = Date.now() - pauseStartTimeRef.current;
      totalPauseTimeRef.current += pauseDuration;
    }
  };

  const handleCompleteAudit = () => {
    clearInterval(timerIntervalRef.current);

    if (isPaused && pauseStartTimeRef.current) {
      const finalPauseDuration = Date.now() - pauseStartTimeRef.current;
      totalPauseTimeRef.current += finalPauseDuration;
      setPauseTime(totalPauseTimeRef.current);
    }

    setIsAuditStarted(false);
    setIsPaused(false);
  };

  const getTotalTime = () => activeTime + pauseTime;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUnitDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Calculate scores
  const calculateScores = () => {
    const results = {
      pageObtained: 0,
      pageMax: 0,
      pageUnanswered: 0,
    };

    checklistData.categories.forEach((category) => {
      if (category.isApplicable) {
        category.subcategories.forEach((subcategory) => {
          if (subcategory.isApplicable) {
            subcategory.questions.forEach((question) => {
              results.pageMax += question.maxMarks;
              if (question.selectedAnswerMarks !== null) {
                results.pageObtained += question.selectedAnswerMarks;
              } else {
                results.pageUnanswered++;
              }
            });
          }
        });
      }
    });

    return results;
  };

  const scores = calculateScores();
  const percentage =
    scores.pageMax > 0
      ? Math.round((scores.pageObtained / scores.pageMax) * 100)
      : 0;

  // Handle category expand/collapse
  const handleCategoryToggle = (categoryId) => {
    const category = checklistData.categories.find(
      (cat) => cat.id === categoryId,
    );
    if (!category.isApplicable) return; // Don't toggle if not applicable

    setChecklistData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId ? { ...cat, isExpanded: !cat.isExpanded } : cat,
      ),
    }));

    if (
      !checklistData.categories.find((cat) => cat.id === categoryId)?.isExpanded
    ) {
      setChecklistData((prev) => ({
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === categoryId ? cat : { ...cat, isExpanded: false },
        ),
      }));

      setChecklistData((prev) => ({
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === categoryId
            ? cat
            : {
                ...cat,
                subcategories: cat.subcategories.map((sub) => ({
                  ...sub,
                  isExpanded: false,
                })),
              },
        ),
      }));
    }
  };

  // Handle subcategory expand/collapse
  const handleSubcategoryToggle = (categoryId, subcategoryId) => {
    const category = checklistData.categories.find(
      (cat) => cat.id === categoryId,
    );
    const subcategory = category?.subcategories.find(
      (sub) => sub.id === subcategoryId,
    );

    if (!category?.isApplicable || !subcategory?.isApplicable) return; // Don't toggle if not applicable

    setChecklistData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              subcategories: cat.subcategories.map((sub) =>
                sub.id === subcategoryId
                  ? { ...sub, isExpanded: !sub.isExpanded }
                  : sub,
              ),
            }
          : cat,
      ),
    }));
  };

  // Update active headers based on expanded state
  useEffect(() => {
    let deepestExpandedHeader = null;

    checklistData.categories.forEach((category) => {
      if (category.isExpanded && category.isApplicable) {
        deepestExpandedHeader = { type: "category", id: category.id };

        category.subcategories.forEach((subcategory) => {
          if (subcategory.isExpanded && subcategory.isApplicable) {
            deepestExpandedHeader = { type: "subcategory", id: subcategory.id };
          }
        });
      }
    });

    const newActiveHeaders = {
      page: deepestExpandedHeader === null,
      categories: {},
      subcategories: {},
    };

    if (deepestExpandedHeader?.type === "category") {
      newActiveHeaders.categories[deepestExpandedHeader.id] = true;
    } else if (deepestExpandedHeader?.type === "subcategory") {
      newActiveHeaders.subcategories[deepestExpandedHeader.id] = true;

      checklistData.categories.forEach((category) => {
        const subcategory = category.subcategories.find(
          (sub) => sub.id === deepestExpandedHeader.id,
        );
        if (subcategory) {
          newActiveHeaders.categories[category.id] = true;
        }
      });
    }

    setActiveHeaders(newActiveHeaders);
  }, [checklistData]);

  // Answer selection handler
  const handleAnswerSelect = (categoryId, subcategoryId, questionId, marks) => {
    setChecklistData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.map((sub) => {
              if (sub.id === subcategoryId) {
                return {
                  ...sub,
                  questions: sub.questions.map((q) => {
                    if (q.id === questionId) {
                      return { ...q, selectedAnswerMarks: marks };
                    }
                    return q;
                  }),
                };
              }
              return sub;
            }),
          };
        }
        return cat;
      }),
    }));
  };

  // Handle category applicability change
  const handleCategoryApplicabilityChange = (categoryId, isApplicable) => {
    setChecklistData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) => {
        if (cat.id === categoryId) {
          const updatedCategory = {
            ...cat,
            isApplicable,
            isExpanded: isApplicable ? cat.isExpanded : false,
            subcategories: cat.subcategories.map((sub) => ({
              ...sub,
              isApplicable: isApplicable ? sub.isApplicable : false,
              isExpanded: isApplicable ? sub.isExpanded : false,
              questions: sub.questions.map((q) => ({
                ...q,
                selectedAnswerMarks: isApplicable
                  ? q.selectedAnswerMarks
                  : null,
              })),
            })),
          };
          return updatedCategory;
        }
        return cat;
      }),
    }));
  };

  // Handle subcategory applicability change
  const handleSubcategoryApplicabilityChange = (
    categoryId,
    subcategoryId,
    isApplicable,
  ) => {
    setChecklistData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.map((sub) => {
              if (sub.id === subcategoryId) {
                return {
                  ...sub,
                  isApplicable,
                  isExpanded: isApplicable ? sub.isExpanded : false,
                  questions: sub.questions.map((q) => ({
                    ...q,
                    selectedAnswerMarks: isApplicable
                      ? q.selectedAnswerMarks
                      : null,
                  })),
                };
              }
              return sub;
            }),
          };
        }
        return cat;
      }),
    }));
  };

  // Modal states
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalData, setInfoModalData] = useState({
    title: "",
    content: "",
    attachment: null,
  });
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [currentQuestionForComment, setCurrentQuestionForComment] =
    useState(null);
  const [showGlobalNoteModal, setShowGlobalNoteModal] = useState(false);

  // Calculate category score
  const calculateCategoryScore = (category) => {
    let obtained = 0;
    let max = 0;
    let unanswered = 0;

    if (category.isApplicable) {
      category.subcategories.forEach((subcategory) => {
        if (subcategory.isApplicable) {
          subcategory.questions.forEach((question) => {
            max += question.maxMarks;
            if (question.selectedAnswerMarks !== null) {
              obtained += question.selectedAnswerMarks;
            } else {
              unanswered++;
            }
          });
        }
      });
    }

    return { obtained, max, unanswered };
  };

  // Calculate subcategory score
  const calculateSubcategoryScore = (subcategory) => {
    let obtained = 0;
    let max = 0;
    let unanswered = 0;

    if (subcategory.isApplicable) {
      subcategory.questions.forEach((question) => {
        max += question.maxMarks;
        if (question.selectedAnswerMarks !== null) {
          obtained += question.selectedAnswerMarks;
        } else {
          unanswered++;
        }
      });
    }

    return { obtained, max, unanswered };
  };

  // Responsive breakpoints
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        :root {
          --primary-color: #664de5;
          --primary-light: #e9eafb;
          --primary-dark: #4c37a3;
          --border-color: #e0e4e7;
          --text-color: #202124;
          --secondary-text: #5f6368;
          --bg-color: #f0f2f5;
          --card-bg: #ffffff;
          --danger-color: #dc3545;
          --warning-color: #ffc107;
          --success-color: #198754;
          --disabled-opacity: 0.5;
        }

        body {
          font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
            Arial, sans-serif;
          background-color: var(--bg-color);
          color: var(--text-color);
          margin: 0;
          padding: 0;
          min-height: 100vh;
        }

        /* Desktop/Tablet Styles (768px and above) */
        .app-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 10px;
        }

        .unit-details-container {
          background-color: var(--card-bg);
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          margin-bottom: 20px;
          width: 100%;
          box-sizing: border-box;
        }

        .timer-display-container {
          background-color: var(--primary-light);
          color: var(--primary-dark);
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
          margin-top: 1rem;
        }

        .main-page-block {
          background-color: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
        }

        .header-bar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 10px 12px;
          margin-bottom: 8px;
          border-radius: 8px;
          cursor: pointer;
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          gap: 0.75rem;
          transition: all 0.2s ease;
          flex-wrap: wrap;
        }

        .header-bar.is-active {
          background-color: var(--primary-color);
          color: #ffffff;
          border-color: var(--primary-color);
        }

        .header-bar.is-active-path {
          background-color: var(--primary-light);
          color: var(--primary-color);
          border-color: var(--primary-light);
        }

        .header-bar.disabled {
          background-color: #f8f9fa;
          color: #6c757d;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .icon-chevron {
          margin-right: 10px;
          font-size: 14px;
          color: var(--secondary-text);
          width: 16px;
          text-align: center;
          transition: transform 0.2s ease-in-out;
          flex-shrink: 0;
        }

        .header-bar.disabled .icon-chevron {
          color: #6c757d;
        }

        .icon-chevron.collapsed {
          transform: rotate(-90deg);
        }

        .header-title {
          font-weight: 600;
          margin: 0;
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: normal;
          word-break: break-word;
          font-size: 1rem;
          flex: 1;
        }

        .header-bar.disabled .header-title {
          color: #6c757d;
        }

        .score-details-container {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-size: 0.7rem;
          color: var(--secondary-text);
          text-align: right;
          flex-shrink: 0;
          margin-top: 4px;
        }

        .header-bar.disabled .score-details-container {
          color: #6c757d;
        }

        .score-value {
          font-weight: 600;
          color: var(--text-color);
        }

        .header-bar.disabled .score-value {
          color: #6c757d;
        }

        .content-area {
          display: none;
          margin-bottom: 8px;
          width: 100%;
          box-sizing: border-box;
        }

        .content-area.is-expanded {
          display: block;
        }

        .content-area.disabled {
          opacity: 0.5;
          pointer-events: none;
        }

        .question-block {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          padding: 15px;
          margin-bottom: 12px;
          border-radius: 8px;
          transition: all 0.2s ease;
          width: 100%;
          box-sizing: border-box;
        }

        .question-block.risk-medium {
          border-left: 5px solid var(--warning-color) !important;
        }

        .question-block.risk-low {
          border-left: 5px solid var(--success-color) !important;
        }

        .question-block.disabled {
          opacity: 0.5;
          pointer-events: none;
        }

        .question-header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-bottom: 12px;
          gap: 5px;
          width: 100%;
        }

        .question-text {
          font-size: 0.95rem;
          color: var(--text-color);
          font-weight: 500;
          margin: 0;
          width: 100%;
          line-height: 1.4;
          word-break: break-word;
        }

        .question-header-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          flex-wrap: wrap;
          gap: 10px;
        }

        .question-marks-display {
          font-size: 0.8rem;
          color: var(--secondary-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .answer-options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 15px;
          width: 100%;
        }

        .answer-btn {
          flex: 1 0 auto;
          min-width: 100px;
          padding: 8px 12px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--primary-color);
          background-color: var(--card-bg);
          border: 1px solid #d1d5db;
          border-radius: 6px;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .answer-btn:hover {
          background-color: #f3f4f6;
        }

        .answer-btn.selected {
          background-color: var(--primary-color);
          color: #ffffff;
          border-color: var(--primary-color);
        }

        .answer-btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }

        .action-bar {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-items: center;
          padding-top: 10px;
          border-top: 1px solid var(--bg-color);
          margin-top: 15px;
          gap: 15px;
          width: 100%;
        }

        .action-link {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: var(--primary-color);
          font-size: 0.85rem;
          font-weight: 500;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .action-link:hover {
          text-decoration: underline;
        }

        .action-link.disabled {
          color: #6c757d;
          cursor: not-allowed;
          pointer-events: none;
        }

        .applicability-check-wrapper {
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 12px 15px;
          margin-bottom: 8px;
          border: 1px solid #e9ecef;
          width: 100%;
          box-sizing: border-box;
        }

        .category-applicability-check,
        .subcategory-applicability-check {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        .category-applicability-check p,
        .subcategory-applicability-check p {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-color);
          min-width: 150px;
          word-break: break-word;
        }

        .form-check {
          margin: 0;
        }

        .form-check-input {
          margin-right: 6px;
          cursor: pointer;
        }

        .form-check-label {
          cursor: pointer;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        .info-icon-btn {
          background: none;
          border: none;
          color: var(--primary-color);
          cursor: pointer;
          font-size: 1.1rem;
          padding: 0 8px;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .info-icon-btn.disabled {
          color: #6c757d;
          cursor: not-allowed;
          pointer-events: none;
        }

        .btn-icon-header {
          background: none;
          border: none;
          color: var(--secondary-text);
          cursor: pointer;
          padding: 4px 8px;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .btn-icon-header.disabled {
          color: #6c757d;
          cursor: not-allowed;
          pointer-events: none;
        }

        .sticky-header-group {
          position: relative;
          width: 100%;
        }

        .header-main-content {
          display: flex;
          align-items: flex-start;
          flex: 1;
          min-width: 0;
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          flex-wrap: wrap;
        }

        .risk-high {
          border-left-color: var(--danger-color);
        }

        .risk-medium {
          border-left-color: var(--warning-color);
        }

        .risk-low {
          border-left-color: var(--success-color);
        }

        .comments-area {
          margin-top: 15px;
          border-top: 1px dashed var(--border-color);
          padding-top: 15px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
        }
          .button_mobile {
  transition: all 0.3s ease;
}
   .button_mobile {
    width: 100%;
    transform: scale(1);
  }

  /* shrink + zoom out effect */
  .button_mobile.shrink {
    width: 75%;
    transform: scale(0.85);
    opacity: 0.7;
  }

  /* hover / tap feel */
  .button_mobile:hover,
  .button_mobile:active {
    transform: scale(0.95);
  }

        /* Mobile Styles (767px and below) */
        @media (max-width: 767px) {
        .media-preview-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.media-preview-item {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.media-preview-item.selected {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 77, 229, 0.2);
}

.media-preview-item img,
.media-preview-item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-media-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(220, 38, 38, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.2s ease;
}

.remove-media-btn:hover {
  background: rgba(185, 28, 28, 1);
  transform: scale(1.1);
}

.fullscreen-preview {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.3s ease;
}

.fullscreen-preview img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
}

.close-fullscreen-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-fullscreen-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
        .comment-mobail{
position: relative !important;
    top: 4px !important;
overflow-y: hidden !important;;
}

.textarea-mobail{
padding: 0px !important;
}
.button_mobail{
font-size: 10px !important;
}

.button_mobaill{
font-size: 11px !important;
}


        .box-shadow{
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px !important;
        }
          .mobile-padding {
    padding: 10px !important;
  }
        .modal-content{
        margin: 20px;
    position: relative;
    bottom: 150px;
        }
        .question-marks-display {
          position: relative !important;
          left: 12px !important;
        }
          .modal-overlay {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden !important;
  touch-action: none !important;
}
          /* Mobile-specific global styles */
          * {
            -webkit-tap-highlight-color: transparent;
          }

          body {
            -webkit-tap-highlight-color: transparent;
          }

          .app-container {
            max-width: 100%;
            padding: 0;
            background-color: var(--bg-color);
          }

          .unit-details-container {
            padding: 0.875rem;
            margin: 0.5rem;
            border-radius: 12px;
          }

              .main-page-block {
      margin: auto;
      border-radius: 16px;
      background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
      border: 1px solid rgba(229, 231, 235, 0.5);
      box-shadow: 
        0 4px 6px -1px rgba(0, 0, 0, 0.05),
        0 10px 15px -3px rgba(0, 0, 0, 0.03),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
    }

         .header-bar {
      border-radius: 14px;
      margin: 0.5rem;
      border: 1px solid #e5e7eb;
      background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    
    .header-bar::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary-color) 0%, #8b5cf6 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .header-bar.is-active {
      background: linear-gradient(135deg, var(--primary-color) 0%, #7c3aed 100%);
      border-color: var(--primary-color);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 77, 229, 0.25);
    }
    
    .header-bar.is-active::before {
      opacity: 1;
    }
    
    .header-bar.is-active-path {
      background: linear-gradient(135deg, var(--primary-light) 0%, #e0e7ff 100%);
      border-color: #c7d2fe;
      color: var(--primary-dark);
      box-shadow: 0 2px 8px rgba(102, 77, 229, 0.15);
    }
    
    .header-bar.disabled {
      background: linear-gradient(135deg, #f3f4f6 0%, #f9fafb 100%);
      border-color: #e5e7eb;
      color: #9ca3af;
      opacity: 0.8;
    }

     .icon-chevron {
      margin-right: 0.875rem;
      font-size: 0.875rem;
      color: var(--primary-color);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: rgba(102, 77, 229, 0.1);
    }
    
    .header-bar.is-active .icon-chevron {
      color: white;
      background: rgba(255, 255, 255, 0.2);
    }
    
    .header-bar.is-active-path .icon-chevron {
      color: var(--primary-dark);
      background: rgba(102, 77, 229, 0.15);
    }
    
    .header-bar.disabled .icon-chevron {
      color: #9ca3af;
      background: rgba(156, 163, 175, 0.1);
    }
    
    .icon-chevron.collapsed {
      transform: rotate(-90deg);
    }
    
    /* Header title improvements */
    .header-title {
      font-size: 1rem;
      font-weight: 600;
      line-height: 1.4;
      margin: 0;
      color: #1f2937;
      position: relative;
      padding-right: 4px;
    }
    
    .header-bar.is-active .header-title {
      color: white;
    }
    
    .header-bar.is-active-path .header-title {
      color: var(--primary-dark);
    }
    
    .header-bar.disabled .header-title {
      color: #9ca3af;
    }
    
    /* Score details container improvements */
    .score-details-container {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      font-size: 0.75rem;
      gap: 4px;
      margin-left: 0.5rem;
    }
    
    .header-bar.is-active .score-details-container {
      color: rgba(255, 255, 255, 0.9);
    }
    
    .header-bar.is-active-path .score-details-container {
      color: var(--primary-dark);
    }
    
    .header-bar.disabled .score-details-container {
      color: #9ca3af;
    }
    
    .score-line, .unanswered-line {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .score-value {
      font-weight: 700;
      font-size: 0.8rem;
      color: var(--primary-color);
    }
    
    .header-bar.is-active .score-value {
      color: white;
    }
    
    .header-bar.is-active-path .score-value {
      color: var(--primary-dark);
    }
    
    .percentage-score, .total-max-score {
      font-weight: 600;
      color: #6b7280;
    }
    
    .header-bar.is-active .percentage-score,
    .header-bar.is-active .total-max-score {
      color: rgba(255, 255, 255, 0.9);
    }
    
    .header-bar.is-active-path .percentage-score,
    .header-bar.is-active-path .total-max-score {
      color: var(--primary-dark);
    }
    
    /* Applicability wrapper improvements */
    .applicability-check-wrapper {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 12px;
      margin: 0.5rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }
    
    .category-applicability-check p,
    .subcategory-applicability-check p {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.75rem;
    }
    
    /* Form check improvements */
    .form-check {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0;
    }
    
    .form-check-input {
      width: 20px;
      height: 20px;
      border: 2px solid #d1d5db;
      border-radius: 50%;
      appearance: none;
      margin: 0;
      cursor: pointer;
      position: relative;
      transition: all 0.2s ease;
    }
    
    .form-check-input:checked {
      border-color: var(--primary-color);
      background-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(102, 77, 229, 0.1);
    }
    
    .form-check-input:checked::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 8px;
      height: 8px;
      background: white;
      border-radius: 50%;
    }
    
    .form-check-input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .form-check-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #4b5563;
      cursor: pointer;
    }
    
    /* Content area improvements */
    .content-area {
      padding: 0;
    }
    
    /* Question block improvements */
    .question-block {
      background: white;
      border-radius: 14px;
      padding: 1.25rem;
      margin-bottom: 1rem;
      border: 1px solid #e5e7eb;
      box-shadow: 
        0 2px 4px rgba(0, 0, 0, 0.03),
        inset 0 0 0 1px rgba(255, 255, 255, 0.8);
      position: relative;
      overflow: hidden;
      transition: all 0.2s ease;
    }
    
    .question-block::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 5px;
      border-radius: 5px 0 0 5px;
    }
    
    
    
    .question-block.risk-medium::before {
      background: linear-gradient(180deg, var(--warning-color), #d69e2e);
    }
    
    .question-block.risk-low::before {
      background: linear-gradient(180deg, var(--success-color), #38a169);
    }
    
    .question-block:hover {
      box-shadow: 
        0 4px 12px rgba(0, 0, 0, 0.06),
        inset 0 0 0 1px rgba(255, 255, 255, 0.8);
      transform: translateY(-1px);
    }
    
    /* Question header improvements */
    .question-header {
      margin-bottom: 1.25rem;
    }
    
    .question-text {
      font-size: 0.95rem;
      color: #1f2937;
      font-weight: 500;
      line-height: 1.5;
      margin: 0 0 1rem 0;
      padding-right: 0.5rem;
    }
    
    .question-header-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      padding: 0.75rem 5px;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
    }
    
    /* Answer options improvements */
    .answer-options {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
    }
    
    .answer-btn {
      padding: 1rem 1.25rem;
      font-size: 0.9rem;
      font-weight: 500;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      background: white;
      color: #4b5563;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      text-align: left;
      position: relative;
      overflow: hidden;
    }
    
    .answer-btn::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: var(--primary-color);
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    
    .answer-btn:hover {
      border-color: var(--primary-color);
      background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(102, 77, 229, 0.1);
    }
    
    .answer-btn.selected {
      border-color: var(--primary-color);
      background: linear-gradient(135deg, var(--primary-color) 0%, #7c3aed 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 77, 229, 0.2);
      font-weight: 600;
    }
    
    .answer-btn.selected::before {
      opacity: 1;
    }
    
    .answer-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }
    
    /* Action bar improvements */
    .action-bar {
      display: flex;
      gap: 0.75rem;
      padding-top: 1.25rem;
      border-top: 1px solid #f3f4f6;
      margin-top: 1.25rem;
    }
    
    .action-link {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.875rem 1rem;
      font-size: 0.875rem;
      font-weight: 600;
      border-radius: 12px;
      border: 2px solid #e5e7eb;
      background: white;
      color: var(--primary-color);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .action-link:hover {
      border-color: var(--primary-color);
      background: var(--primary-light);
      transform: translateY(-1px);
    }
    
    .action-link:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
    }
    
    /* Comments section improvements */
    .comments-section {
      margin-top: 1.25rem;
      padding: 1rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }
    
    .comments-header {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--primary-dark);
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .comment-item {
      padding: 0.875rem;
      background: white;
      border-radius: 10px;
      border: 1px solid #e5e7eb;
      margin-bottom: 0.75rem;
      font-size: 0.875rem;
      line-height: 1.5;
      color: #4b5563;
    }
    
    /* Modal improvements */
   .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
  animation: fadeIn 0.3s ease;
}
.modal-content {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  max-width: 500px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(229, 231, 235, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  background: #f3f4f6;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: all 0.2s ease;
  background: #fafafa;
}

textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 77, 229, 0.1);
  background: white;
}

/* Mobile Modal Improvements */
@media (max-width: 767px) {
.applicability-check-wrapper {
            width: calc(100% - 1rem) !important;
}
  .modal-overlay {
    padding: 0;
    align-items: flex-end;
  }
  
  .modal-content {
    max-width: 100%;
    border-radius: 20px 20px 0 0;
    max-height: 90vh;
    margin-top: auto;
    animation: slideUpMobile 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  @keyframes slideUpMobile {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
}
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .modal-content {
      background: white;
      border-radius: 20px;
      padding: 1.5rem;
      max-width: 500px;
      width: 100%;
      max-height: 85vh;
      overflow-y: auto;
      animation: slideUp 0.3s ease;
      box-shadow: 
        0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(229, 231, 235, 0.5);
    }
    
    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(20px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #f3f4f6;
    }
    
    .modal-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #6b7280;
      cursor: pointer;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    
    .close-btn:hover {
      background: #f3f4f6;
      color: #374151;
    }
    
    .form-group {
      margin-bottom: 1.25rem;
    }
    
    .form-group label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }
    
    textarea {
      width: 100%;
      padding: 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 0.95rem;
      font-family: inherit;
      resize: vertical;
      min-height: 120px;
      transition: all 0.2s ease;
      background: #fafafa;
    }
    
    textarea:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(102, 77, 229, 0.1);
      background: white;
    }
    
    .btn {
      padding: 0.875rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.9rem;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, var(--primary-color) 0%, #7c3aed 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(102, 77, 229, 0.2);
    }
    
    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 77, 229, 0.3);
    }
    
    .btn-secondary {
      background: #f3f4f6;
      color: #4b5563;
    }
    
    .btn-secondary:hover {
      background: #e5e7eb;
      transform: translateY(-1px);
    }
    
    /* Media upload buttons improvements */
    .media-upload-buttons {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
      padding: 1.25rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      flex-wrap: wrap;
    }
    
    /* Mobile-specific scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
    
    /* Safe area for notched devices */
    .modal-content {
      padding-bottom: calc(1.5rem + env(safe-area-inset-bottom));
    }
  }

          .score-details-container {
            font-size: 0.65rem;
            margin-left: 0.25rem;
            margin-top: 0;
          }


          .question-block {
            background-color: var(--card-bg);
            padding: 0.875rem;
            margin-bottom: 0.875rem;
            border-radius: 10px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
            border: none;
          }

         

          .question-block.risk-medium {
            border-left: 4px solid var(--warning-color) !important;
          }

          .question-block.risk-low {
            border-left: 4px solid var(--success-color) !important;
          }

          .answer-options {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .answer-btn {
            min-height: 48px;
            font-size: 0.875rem;
            padding: 0.875rem 0.5rem;
            min-width: 0;
            flex: 1 0 auto;
          }

          .answer-btn.selected {
            background-color: var(--primary-color);
            color: #ffffff;
            border-color: var(--primary-color);
            font-weight: 600;
          }

          .action-bar {
            flex-direction: column;
            gap: 0.5rem;
            align-items: stretch;
          }

          .action-link {
            justify-content: center;
            padding: 0.75rem;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            background-color: #f8f9fa;
            min-height: 44px;
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }

          .applicability-check-wrapper {
            background-color: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e9ecef;
            width: calc(100% - 2rem);
          }

          .category-applicability-check,
          .subcategory-applicability-check {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            width: 100%;
          }

          .category-applicability-check p,
          .subcategory-applicability-check p {
            margin: 0;
            font-size: 0.9rem;
            font-weight: 500;
            color: var(--text-color);
            min-width: 0;
          }

          .form-check {
            margin: 0;
            display: flex;
            align-items: center;
          }

          .form-check-input {
            margin-right: 0.5rem;
            width: 1.2rem;
            height: 1.2rem;
            cursor: pointer;
          }

          .form-check-label {
            cursor: pointer;
            font-size: 0.9rem;
            padding: 0.5rem 0;
            white-space: normal;
          }

          .info-icon-btn {
            background: none;
            border: none;
            color: var(--primary-color);
            cursor: pointer;
            font-size: 1.1rem;
            padding: 0.5rem;
            min-width: 44px;
            min-height: 44px;
          }

          /* Form inputs for mobile */
          input,
          textarea {
            font-size: 16px !important; /* Prevents zoom on iOS */
            min-height: 44px; /* Better touch target */
          }

          /* Better scroll experience */
          * {
            -webkit-overflow-scrolling: touch;
          }

          /* Remove blue highlight on tap */
          *:active {
            -webkit-tap-highlight-color: transparent;
          }
        }

        /* Small mobile devices */
        @media (max-width: 480px) {
          .unit-details-container {
            padding: 0.75rem;
            margin: 0.375rem;
          }

          .main-page-block {
            margin: 0.375rem;
          }

          .header-title {
            font-size: 0.95rem;
          }

          .question-text {
            font-size: 0.9rem;
          }

          .answer-btn {
            padding: 0.75rem 0.375rem;
          }

          /* Safe area insets for notch phones */
          .app-container {
            padding-left: env(safe-area-inset-left);
            padding-right: env(safe-area-inset-right);
            padding-bottom: env(safe-area-inset-bottom);
          }
        }

        /* Tablet adjustments (768px - 1024px) */
        @media (min-width: 768px) and (max-width: 1024px) {
          .app-container {
            padding: 15px;
          }

          .answer-btn {
            min-width: calc(33.333% - 6px);
            flex: 0 0 calc(33.333% - 6px);
          }

          .category-applicability-check,
          .subcategory-applicability-check {
            flex-direction: row;
            align-items: center;
            gap: 15px;
          }

          .comments-area {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }
        }

        .form-input {
          width: 100%;
          padding: 12px 14px;
          font-size: 14px;
          border: 1.5px solid #d1d9e6;
          border-radius: 8px;
          box-sizing: border-box;
          background-color: #ffffff;
          color: #2d3748;
          transition: all 0.2s ease-in-out;
          outline: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          font-family: inherit;
          font-weight: 500;
          letter-spacing: 0.01em;
        }

        .form-input:hover:not(:focus):not(:disabled) {
          border-color: #a0aec0;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
        }

        .form-input:focus:not(:disabled) {
          border-color: #4d90fe;
          box-shadow:
            0 0 0 3px rgba(66, 153, 225, 0.15),
            0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .form-input:disabled {
          background-color: #f8f9fa;
          color: #6c757d;
          border-color: #e9ecef;
          cursor: not-allowed;
          opacity: 0.7;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        /* Mobile Responsive Camera Modal */
@media (max-width: 480px) {
  .camera-modal-overlay {
    padding: 8px !important;
  }
  
  .camera-modal-content {
    max-height: 85vh !important;
    margin: 0 auto !important;
    padding: 0 !important;
    border-radius: 16px !important;
  }
}

@media (max-width: 375px) {
  .camera-modal-overlay {
    padding: 6px !important;
  }
  
  .camera-modal-content {
    max-height: 83vh !important;
    border-radius: 14px !important;
  }
}

@media (max-width: 320px) {
  .camera-modal-overlay {
    padding: 4px !important;
    background: rgba(0, 0, 0, 0.95) !important;
  }
  
  .camera-modal-content {
    max-height: 80vh !important;
    border-radius: 12px !important;
    margin: 0 2px !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
  }
  
  .modal-header {
    padding: 0.5rem 0.75rem !important;
  }
  
  .modal-title {
    font-size: 0.9rem !important;
  }
  
  .close-btn {
    width: 28px !important;
    height: 28px !important;
    font-size: 1.25rem !important;
  }
  
  .form-group {
    padding: 0 0.75rem !important;
  }
  
  .btn {
    padding: 0.625rem 0.75rem !important;
    font-size: 0.85rem !important;
  }
}

/* Very Small Mobile Devices */
@media (max-width: 280px) {
  .camera-modal-overlay {
    padding: 2px !important;
  }
  
  .camera-modal-content {
    max-height: 78vh !important;
    border-radius: 10px !important;
    margin: 0 1px !important;
  }
  
  .modal-header {
    padding: 0.375rem 0.5rem !important;
  }
  
  .modal-title {
    font-size: 0.8rem !important;
  }
  
  .close-btn {
    width: 24px !important;
    height: 24px !important;
    font-size: 1.1rem !important;
  }
  
  .form-group {
    padding: 0 0.5rem !important;
  }
  
  .btn {
    padding: 0.5rem 0.625rem !important;
    font-size: 0.8rem !important;
  }
}

/* Portrait Orientation */
@media (orientation: portrait) and (max-height: 700px) {
  .camera-modal-content {
    max-height: 75vh !important;
  }
  
  .camera-video-container {
    max-height: 35vh !important;
  }
  
  .camera-preview-container img,
  .camera-video-container video {
    max-height: 35vh !important;
  }
}

/* Landscape Orientation */
@media (orientation: landscape) and (max-height: 500px) {
  .camera-modal-content {
    max-height: 70vh !important;
  }
  
  .camera-video-container {
    max-height: 25vh !important;
  }
  
  .camera-preview-container img,
  .camera-video-container video {
    max-height: 25vh !important;
  }
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
  .btn,
  .close-btn,
  .camera-capture-btn,
  .camera-flip-btn {
    min-height: 44px !important;
    min-width: 44px !important;
  }
  
  input[type="range"] {
    min-height: 44px !important;
  }
  
  /* Increase touch targets for mobile */
  .aspect-ratio-option {
    padding: 8px !important;
    min-height: 44px !important;
  }
}

/* Reduce Motion */
@media (prefers-reduced-motion: reduce) {
  .camera-modal-content {
    animation: none !important;
  }
  
  .btn,
  .close-btn {
    transition: none !important;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .camera-modal-content {
    border: 2px solid currentColor !important;
  }
  
  .btn {
    border: 2px solid currentColor !important;
  }
}

/* Dark Mode Optimizations */
@media (prefers-color-scheme: dark) {
  .camera-modal-content {
    background: #1f2937 !important;
    color: #f9fafb !important;
    border-color: #374151 !important;
  }
  
  .modal-header {
    border-bottom-color: #374151 !important;
  }
  
  .modal-footer {
    border-top-color: #374151 !important;
  }
  
  .aspect-ratio-option {
    color: #d1d5db !important;
  }
  
  .adjustment-label label {
    color: #e5e7eb !important;
  }
  
  .adjustment-label span {
    color: #9ca3af !important;
  }
  
  input[type="range"] {
    background: #4b5563 !important;
  }
}
/* Mobile Responsive Camera Modal */
@media (max-width: 767px) {
.camera-modal-content{
position: relative;
    max-height: 400px !important;
    top: 0px !important;
    overflow: hidden !important;
    overflow-y: hidden !important;
}
 
/* Fullscreen Preview */
.fullscreen-preview {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 30000 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.3s ease;
}

.fullscreen-preview img,
.fullscreen-preview video {
  max-width: 95vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
}

.close-fullscreen-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 30001;
}

.close-fullscreen-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}
        /* Mobile specific */
        @media (max-width: 767px) {
          .form-input {
            padding: 14px 16px;
            font-size: 16px;
            border-radius: 10px;
            min-height: 52px;
          }

          .form-input:focus:not(:disabled) {
            box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
          }
        }

        /* Placeholder styling */
        .form-input::placeholder {
          color: #8e9aaf;
          opacity: 0.8;
          font-weight: 400;
        }
      `}</style>

      <div className="app-container">
        {/* Conditional rendering based on screen size */}
        {isMobile ? (
          /* Mobile Layout with Two-Step Process */
          <>
            {/* Step Indicator */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "1rem",
                backgroundColor: "var(--card-bg)",
                borderRadius: "12px",
                margin: "0.5rem",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor:
                      mobileStep === 1 ? "var(--primary-color)" : "#e9ecef",
                    color: mobileStep === 1 ? "white" : "#6c757d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                  }}
                >
                  1
                </div>
                <span
                  style={{
                    fontSize: "0.875rem",
                    color:
                      mobileStep === 1 ? "var(--primary-color)" : "#6c757d",
                  }}
                >
                  Unit Details
                </span>
                <div
                  style={{
                    width: "40px",
                    height: "1px",
                    backgroundColor: "#dee2e6",
                    margin: "0 0.5rem",
                  }}
                />
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor:
                      mobileStep === 2 ? "var(--primary-color)" : "#e9ecef",
                    color: mobileStep === 2 ? "white" : "#6c757d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                  }}
                >
                  2
                </div>
                <span
                  style={{
                    fontSize: "0.875rem",
                    color:
                      mobileStep === 2 ? "var(--primary-color)" : "#6c757d",
                  }}
                >
                  Audit
                </span>
              </div>
            </div>

            {/* Floating Timer Bar - iPhone Style */}
            {isAuditStarted && mobileStep === 2 && (
              <div
                style={{
                  position: "fixed",
                  top: "0",
                  left: "0",
                  right: "0",
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                  padding: "0.75rem 1rem",
                  zIndex: "9999",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 2px 12px rgba(102, 77, 229, 0.3)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <button
                    onClick={handlePrevStep}
                    style={{
                      background: "none",
                      border: "none",
                      color: "white",
                      fontSize: "1.25rem",
                      cursor: "pointer",
                      padding: "0.25rem",
                    }}
                  >
                    ←
                  </button>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "0.75rem", opacity: 0.9 }}>
                      Audit in Progress
                    </span>
                    <span
                      style={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        fontFamily: "monospace",
                      }}
                    >
                      {formatTime(getTotalTime())}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {!isPaused ? (
                    <button
                      onClick={handlePauseAudit}
                      style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        border: "none",
                        color: "white",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      ⏸ Pause
                    </button>
                  ) : (
                    <button
                      onClick={handleResumeAudit}
                      style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        border: "none",
                        color: "white",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      ▶ Resume
                    </button>
                  )}
                  <button
                    onClick={handleCompleteAudit}
                    style={{
                      background: "var(--success-color)",
                      border: "none",
                      color: "white",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    ✓ Done
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Unit Details */}
            {mobileStep === 1 && (
              <div className="unit-details-container">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.5rem",
                    paddingBottom: "1rem",
                    borderBottom: "2px solid var(--primary-light)",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      backgroundColor: "var(--primary-light)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "1rem",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        color: "var(--primary-color)",
                        fontSize: "1.5rem",
                      }}
                    >
                      📋
                    </span>
                  </div>
                  <div>
                    <h5
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        margin: "0 0 0.25rem 0",
                        color: "var(--text-color)",
                      }}
                    >
                      Unit Details
                    </h5>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--secondary-text)",
                        margin: 0,
                      }}
                    >
                      Fill in audit information to begin
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {[
                    {
                      key: "companyName",
                      label: "Company Name",
                      placeholder: "Enter company name",
                      required: true,
                    },
                    {
                      key: "representativeName",
                      label: "Representative Name",
                      placeholder: "Enter representative's name",
                      required: true,
                    },
                    {
                      key: "completeAddress",
                      label: "Complete Address",
                      placeholder: "Enter full address",
                      required: true,
                    },
                    {
                      key: "contactNumber",
                      label: "Contact Number",
                      placeholder: "Enter contact number",
                      type: "tel",
                      required: true,
                    },
                    {
                      key: "email",
                      label: "Email ID",
                      placeholder: "Enter email address",
                      type: "email",
                    },
                    {
                      key: "scheduledManday",
                      label: "Scheduled Manday",
                      placeholder: "e.g., 1.5",
                    },
                    {
                      key: "auditScope",
                      label: "Audit Scope",
                      placeholder: "Define scope of audit",
                    },
                    {
                      key: "auditDateFrom",
                      label: "Audit Date (From)",
                      type: "date",
                    },
                    {
                      key: "auditDateTo",
                      label: "Audit Date (To)",
                      type: "date",
                    },
                  ].map((field) => (
                    <div key={field.key}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "var(--text-color)",
                        }}
                      >
                        {field.label}
                        {field.required && (
                          <span
                            style={{
                              color: "var(--danger-color)",
                              marginLeft: "0.25rem",
                            }}
                          >
                            *
                          </span>
                        )}
                      </label>
                      <input
                        type={field.type || "text"}
                        name={field.key}
                        value={unitDetails[field.key]}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        className="form-input"
                        style={{
                          width: "100%",
                          padding: "1rem",
                          fontSize: "1rem",
                          border: `1.5px solid ${unitDetails[field.key]?.trim() === "" && field.required ? "#ff6b6b" : "var(--border-color)"}`,
                          borderRadius: "10px",
                          boxSizing: "border-box",
                          backgroundColor: "white",
                          color: "var(--text-color)",
                          WebkitAppearance: "none",
                          transition: "all 0.2s ease",
                        }}
                      />
                    </div>
                  ))}

                  {/* Geotag Location */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "var(--text-color)",
                      }}
                    >
                      Geotag Location
                    </label>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        value={geotagLocation}
                        readOnly
                        className="form-input"
                        placeholder="Tap to fetch location"
                        style={{
                          flex: 1,
                          padding: "1rem",
                          fontSize: "1rem",
                          border: "1.5px solid var(--border-color)",
                          borderRadius: "10px",
                          boxSizing: "border-box",
                          backgroundColor: "#f8f9fa",
                          color: "#6c757d",
                        }}
                      />
                      <button
                        onClick={handleGetGeotag}
                        style={{
                          padding: "1rem 1.25rem",
                          fontSize: "1rem",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          backgroundColor: "var(--primary-color)",
                          color: "white",
                          fontWeight: "600",
                          flexShrink: 0,
                          minWidth: "48px",
                          minHeight: "48px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 2px 8px rgba(102, 77, 229, 0.2)",
                        }}
                      >
                        📍
                      </button>
                    </div>
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={handleNextStep}
                    disabled={!allFieldsFilled}
                    style={{
                      padding: "1.25rem",
                      fontSize: "1.125rem",
                      border: "none",
                      borderRadius: "12px",
                      cursor: allFieldsFilled ? "pointer" : "not-allowed",
                      backgroundColor: allFieldsFilled
                        ? "var(--primary-color)"
                        : "#e9ecef",
                      color: allFieldsFilled ? "white" : "#6c757d",
                      fontWeight: "700",
                      width: "100%",
                      boxShadow: allFieldsFilled
                        ? "0 4px 12px rgba(102, 77, 229, 0.3)"
                        : "none",
                      transition: "all 0.2s ease",
                      marginTop: "1rem",
                      letterSpacing: "0.5px",
                    }}
                    onTouchStart={(e) =>
                      allFieldsFilled && (e.currentTarget.style.opacity = "0.9")
                    }
                    onTouchEnd={(e) =>
                      allFieldsFilled && (e.currentTarget.style.opacity = "1")
                    }
                  >
                    {allFieldsFilled ? "▶ Start Audit" : "Fill Required Fields"}
                  </button>
                </div>
              </div>
            )}

            {mobileStep === 2 && (
              <div
                className="main-page-block"
                style={{ marginTop: isAuditStarted ? "1.5rem" : "0.5rem" }}
              >
                <div
                  className={`header-bar ${activeHeaders.page ? "is-active" : ""}`}
                  style={{
                    background: activeHeaders.page
                      ? "linear-gradient(135deg, var(--primary-color) 0%, #7c3aed 100%)"
                      : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
                    color: activeHeaders.page ? "white" : "var(--text-color)",
                    border: activeHeaders.page ? "none" : "1px solid #e5e7eb",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2
                      className="header-title"
                      style={{ fontSize: "1.125rem", color: "inherit" }}
                    >
                      {checklistData.title}
                    </h2>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: activeHeaders.page
                          ? "rgba(255,255,255,0.9)"
                          : "var(--secondary-text)",
                        margin: "0.25rem 0 0 0",
                        opacity: 0.9,
                      }}
                    >
                      {checklistData.pageNumber}
                    </p>
                  </div>
                  <div
                    className="score-details-container"
                    style={{
                      color: activeHeaders.page
                        ? "rgba(255,255,255,0.9)"
                        : "inherit",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: activeHeaders.page
                          ? "rgba(255,255,255,0.2)"
                          : "var(--primary-light)",
                        padding: "0.375rem 0.75rem",
                        borderRadius: "8px",
                        marginBottom: "0.25rem",
                      }}
                    >
                      <span
                        className="score-value"
                        style={{
                          color: activeHeaders.page
                            ? "white"
                            : "var(--primary-color)",
                          fontWeight: "700",
                        }}
                      >
                        {scores.pageObtained}
                      </span>
                      <span style={{ opacity: 0.7 }}>/{scores.pageMax}</span>
                    </div>
                    <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>
                      {scores.pageUnanswered} unanswered
                    </span>
                  </div>
                </div>
                <div>
                  {checklistData.categories.map((category) => {
                    const categoryScore = calculateCategoryScore(category);
                    const categoryPercentage =
                      categoryScore.max > 0
                        ? Math.round(
                            (categoryScore.obtained / categoryScore.max) * 100,
                          )
                        : 0;

                    return (
                      <div key={category.id} style={{ marginBottom: "1rem" }}>
                        {/* Category Header with Improved Active States */}
                        <div
                          className={`header-bar ${
                            category.isApplicable
                              ? activeHeaders.categories[category.id]
                                ? "is-active-path"
                                : ""
                              : "disabled"
                          }`}
                          onClick={() => handleCategoryToggle(category.id)}
                          style={{
                            background:
                              activeHeaders.categories[category.id] &&
                              category.isApplicable
                                ? "linear-gradient(135deg, var(--primary-light) 0%, #e0e7ff 100%)"
                                : category.isApplicable
                                  ? "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)"
                                  : "linear-gradient(135deg, #f3f4f6 0%, #f9fafb 100%)",
                            border:
                              activeHeaders.categories[category.id] &&
                              category.isApplicable
                                ? "1px solid var(--primary-color)"
                                : "1px solid #e5e7eb",
                            color:
                              activeHeaders.categories[category.id] &&
                              category.isApplicable
                                ? "var(--primary-dark)"
                                : category.isApplicable
                                  ? "var(--text-color)"
                                  : "#6c757d",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              flex: 1,
                            }}
                          >
                            <span
                              className={`icon-chevron ${category.isExpanded ? "" : "collapsed"}`}
                              style={{
                                color:
                                  activeHeaders.categories[category.id] &&
                                  category.isApplicable
                                    ? "var(--primary-color)"
                                    : "inherit",
                              }}
                            >
                              ►
                            </span>
                            <h3
                              className="header-title"
                              style={{ fontSize: "1rem", color: "inherit" }}
                            >
                              {category.title}
                            </h3>
                          </div>
                          <div className="score-details-container">
                            <div
                              style={{
                                backgroundColor:
                                  activeHeaders.categories[category.id] &&
                                  category.isApplicable
                                    ? "rgba(102, 77, 229, 0.1)"
                                    : "rgba(0,0,0,0.05)",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "6px",
                                fontSize: "0.75rem",
                                color:
                                  activeHeaders.categories[category.id] &&
                                  category.isApplicable
                                    ? "var(--primary-dark)"
                                    : "inherit",
                                fontWeight: "600",
                              }}
                            >
                              {categoryPercentage}%
                            </div>
                          </div>
                        </div>

                        {/* Category Applicability */}
                        <div className="applicability-check-wrapper">
                          <div className="category-applicability-check">
                            <p
                              style={{
                                fontSize: "0.875rem",
                                fontWeight: "600",
                                color: "#1f2937",
                              }}
                            >
                              Is this category applicable?
                            </p>
                            <div style={{ display: "flex", gap: "1.5rem" }}>
                              <label
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                  cursor: "pointer",
                                }}
                              >
                                <input
                                  type="radio"
                                  name={`applicable-cat-${category.id}`}
                                  checked={category.isApplicable}
                                  onChange={() =>
                                    handleCategoryApplicabilityChange(
                                      category.id,
                                      true,
                                    )
                                  }
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    accentColor: "var(--primary-color)",
                                  }}
                                />
                                <span
                                  style={{
                                    fontSize: "0.875rem",
                                    fontWeight: "500",
                                  }}
                                >
                                  Yes
                                </span>
                              </label>
                              <label
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                  cursor: "pointer",
                                }}
                              >
                                <input
                                  type="radio"
                                  name={`applicable-cat-${category.id}`}
                                  checked={!category.isApplicable}
                                  onChange={() =>
                                    handleCategoryApplicabilityChange(
                                      category.id,
                                      false,
                                    )
                                  }
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    accentColor: "var(--primary-color)",
                                  }}
                                />
                                <span
                                  style={{
                                    fontSize: "0.875rem",
                                    fontWeight: "500",
                                  }}
                                >
                                  No
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Category Content */}
                        <div
                          className={`content-area ${category.isExpanded ? "is-expanded" : ""} ${!category.isApplicable ? "disabled" : ""}`}
                        >
                          {category.subcategories.map((subcategory) => {
                            const subcategoryScore =
                              calculateSubcategoryScore(subcategory);
                            const subcategoryPercentage =
                              subcategoryScore.max > 0
                                ? Math.round(
                                    (subcategoryScore.obtained /
                                      subcategoryScore.max) *
                                      100,
                                  )
                                : 0;

                            return (
                              <div
                                key={subcategory.id}
                                style={{ marginBottom: "1rem" }}
                              >
                                {/* Subcategory Header with Enhanced Active State */}
                                <div
                                  className={`header-bar ${!subcategory.isApplicable ? "disabled" : ""} ${
                                    activeHeaders.subcategories[subcategory.id]
                                      ? "is-active"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleSubcategoryToggle(
                                      category.id,
                                      subcategory.id,
                                    )
                                  }
                                  style={{
                                    background:
                                      activeHeaders.subcategories[
                                        subcategory.id
                                      ] && subcategory.isApplicable
                                        ? "linear-gradient(135deg, var(--primary-color) 0%, #7c3aed 100%)"
                                        : subcategory.isApplicable
                                          ? "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)"
                                          : "linear-gradient(135deg, #f3f4f6 0%, #f9fafb 100%)",
                                    border:
                                      activeHeaders.subcategories[
                                        subcategory.id
                                      ] && subcategory.isApplicable
                                        ? "none"
                                        : "1px solid #e5e7eb",
                                    color:
                                      activeHeaders.subcategories[
                                        subcategory.id
                                      ] && subcategory.isApplicable
                                        ? "white"
                                        : subcategory.isApplicable
                                          ? "var(--text-color)"
                                          : "#6c757d",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      flex: 1,
                                    }}
                                  >
                                    <span
                                      className={`icon-chevron ${subcategory.isExpanded ? "" : "collapsed"}`}
                                      style={{
                                        color:
                                          activeHeaders.subcategories[
                                            subcategory.id
                                          ] && subcategory.isApplicable
                                            ? "white"
                                            : "inherit",
                                      }}
                                    >
                                      ►
                                    </span>
                                    <h4
                                      className="header-title"
                                      style={{
                                        fontSize: "0.95rem",
                                        color: "inherit",
                                      }}
                                    >
                                      {subcategory.title}
                                    </h4>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.75rem",
                                    }}
                                  >
                                    <button
                                      className="info-icon-btn"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (subcategory.isApplicable) {
                                          setInfoModalData({
                                            title: subcategory.title,
                                            content:
                                              subcategory.info ||
                                              "No additional information",
                                            attachment:
                                              subcategory.infoAttachment,
                                          });
                                          setShowInfoModal(true);
                                        }
                                      }}
                                      disabled={!subcategory.isApplicable}
                                      style={{
                                        color:
                                          activeHeaders.subcategories[
                                            subcategory.id
                                          ] && subcategory.isApplicable
                                            ? "white"
                                            : subcategory.isApplicable
                                              ? "var(--primary-color)"
                                              : "#6c757d",
                                      }}
                                    >
                                      ℹ️
                                    </button>
                                    <div className="score-details-container">
                                      <div
                                        style={{
                                          fontSize: "0.75rem",
                                          backgroundColor:
                                            activeHeaders.subcategories[
                                              subcategory.id
                                            ] && subcategory.isApplicable
                                              ? "rgba(255,255,255,0.2)"
                                              : "rgba(0,0,0,0.05)",
                                          padding: "0.25rem 0.5rem",
                                          borderRadius: "4px",
                                          color:
                                            activeHeaders.subcategories[
                                              subcategory.id
                                            ] && subcategory.isApplicable
                                              ? "white"
                                              : "inherit",
                                          fontWeight: "600",
                                        }}
                                      >
                                        {subcategoryPercentage}%
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Subcategory Applicability */}
                                <div className="applicability-check-wrapper">
                                  <div className="subcategory-applicability-check">
                                    <p
                                      style={{
                                        fontSize: "0.875rem",
                                        marginBottom: "0.75rem",
                                        fontWeight: "600",
                                        color: "#1f2937",
                                      }}
                                    >
                                      Is this parameter applicable?
                                    </p>
                                    <div
                                      style={{ display: "flex", gap: "1.5rem" }}
                                    >
                                      <label
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "0.5rem",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <input
                                          type="radio"
                                          name={`applicable-subcat-${subcategory.id}`}
                                          checked={subcategory.isApplicable}
                                          onChange={() =>
                                            handleSubcategoryApplicabilityChange(
                                              category.id,
                                              subcategory.id,
                                              true,
                                            )
                                          }
                                          disabled={!category.isApplicable}
                                          style={{
                                            width: "20px",
                                            height: "20px",
                                            accentColor: "var(--primary-color)",
                                          }}
                                        />
                                        <span
                                          style={{
                                            fontSize: "0.875rem",
                                            fontWeight: "500",
                                          }}
                                        >
                                          Yes
                                        </span>
                                      </label>
                                      <label
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "0.5rem",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <input
                                          type="radio"
                                          name={`applicable-subcat-${subcategory.id}`}
                                          checked={!subcategory.isApplicable}
                                          onChange={() =>
                                            handleSubcategoryApplicabilityChange(
                                              category.id,
                                              subcategory.id,
                                              false,
                                            )
                                          }
                                          disabled={!category.isApplicable}
                                          style={{
                                            width: "20px",
                                            height: "20px",
                                            accentColor: "var(--primary-color)",
                                          }}
                                        />
                                        <span
                                          style={{
                                            fontSize: "0.875rem",
                                            fontWeight: "500",
                                          }}
                                        >
                                          No
                                        </span>
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                {/* Subcategory Content */}
                                <div
                                  className={`content-area mobile-padding ${subcategory.isExpanded ? "is-expanded" : ""} ${!subcategory.isApplicable ? "disabled" : ""}`}
                                >
                                  {subcategory.questions.map((question) => (
                                    <div
                                      key={question.id}
                                      className={`box-shadow question-block risk-${question.riskLevel}`}
                                    >
                                      <div className="question-header">
                                        <p className="question-text">
                                          {question.text}
                                        </p>
                                        <div className="question-header-meta">
                                          <div className="question-marks-display">
                                            <span
                                              style={{
                                                fontWeight: "700",
                                                color: "var(--primary-color)",
                                                fontSize: "1rem",
                                              }}
                                            >
                                              {question.selectedAnswerMarks ??
                                                "--"}
                                            </span>
                                            <span style={{ opacity: 0.7 }}>
                                              /{question.maxMarks}
                                            </span>
                                            {question.selectedAnswerMarks !==
                                              null &&
                                              question.maxMarks > 0 && (
                                                <span
                                                  style={{
                                                    fontSize: "0.75rem",
                                                    opacity: 0.7,
                                                    marginLeft: "0.25rem",
                                                  }}
                                                >
                                                  (
                                                  {Math.round(
                                                    (question.selectedAnswerMarks /
                                                      question.maxMarks) *
                                                      100,
                                                  )}
                                                  %)
                                                </span>
                                              )}
                                          </div>
                                          <button
                                            className="info-icon-btn"
                                            onClick={() => {
                                              if (subcategory.isApplicable) {
                                                setInfoModalData({
                                                  title: "Question Information",
                                                  content:
                                                    "Additional information about this question",
                                                  attachment: null,
                                                });
                                                setShowInfoModal(true);
                                              }
                                            }}
                                            disabled={!subcategory.isApplicable}
                                            style={{
                                              color: subcategory.isApplicable
                                                ? "var(--primary-color)"
                                                : "#6c757d",
                                            }}
                                          >
                                            ℹ️
                                          </button>
                                        </div>
                                      </div>

                                      <div className="answer-options">
                                        {question.answers.map((answer, idx) => (
                                          <button
                                            key={idx}
                                            className={`answer-btn ${question.selectedAnswerMarks === answer.marks ? "selected" : ""}`}
                                            onClick={() => {
                                              if (subcategory.isApplicable) {
                                                handleAnswerSelect(
                                                  category.id,
                                                  subcategory.id,
                                                  question.id,
                                                  answer.marks,
                                                );
                                              }
                                            }}
                                            disabled={!subcategory.isApplicable}
                                            style={{
                                              opacity: subcategory.isApplicable
                                                ? 1
                                                : 0.5,
                                            }}
                                          >
                                            {answer.text}
                                          </button>
                                        ))}
                                      </div>

                                      {question.comments.length > 0 && (
                                        <div
                                          style={{
                                            marginTop: "1rem",
                                            padding: "1rem",
                                            backgroundColor: "#f8f9fa",
                                            borderRadius: "10px",
                                            borderLeft:
                                              "4px solid var(--primary-color)",
                                          }}
                                        >
                                          <div
                                            style={{
                                              fontSize: "0.875rem",
                                              fontWeight: "700",
                                              color: "var(--secondary-text)",
                                              marginBottom: "0.75rem",
                                            }}
                                          >
                                            Comments ({question.comments.length}
                                            )
                                          </div>
                                          {question.comments.map(
                                            (comment, idx) => (
                                              <div
                                                key={idx}
                                                style={{
                                                  fontSize: "0.875rem",
                                                  color: "var(--text-color)",
                                                  marginBottom: "0.75rem",
                                                  lineHeight: 1.5,
                                                  padding: "0.75rem",
                                                  backgroundColor: "white",
                                                  borderRadius: "8px",
                                                  border: "1px solid #e5e7eb",
                                                }}
                                              >
                                                {comment.text}
                                              </div>
                                            ),
                                          )}
                                        </div>
                                      )}

                                      <div className="action-bar">
                                        <button
                                          className="action-link"
                                          onClick={() => {
                                            if (subcategory.isApplicable) {
                                              setCurrentQuestionForComment(
                                                question,
                                              );
                                              setShowCommentsModal(true);
                                            }
                                          }}
                                          disabled={!subcategory.isApplicable}
                                          style={{
                                            opacity: subcategory.isApplicable
                                              ? 1
                                              : 0.5,
                                          }}
                                        >
                                          <span>💬</span>
                                          <span>Add Comment</span>
                                        </button>
                                        <button
                                          className="action-link"
                                          disabled={!subcategory.isApplicable}
                                          style={{
                                            opacity: subcategory.isApplicable
                                              ? 1
                                              : 0.5,
                                          }}
                                        >
                                          <span>📎</span>
                                          <span>Create Action</span>
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Desktop/Tablet Layout */
          <>
            {/* Unit Details Form */}
            <div className="unit-details-container">
              <h5
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#333",
                  borderBottom: "1px solid #e9ecef",
                  paddingBottom: "8px",
                }}
              >
                Unit Details
              </h5>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "16px",
                }}
              >
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#495057",
                    }}
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={unitDetails.companyName}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "14px",
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                      boxSizing: "border-box",
                      backgroundColor: isAuditStarted ? "#e9ecef" : "white",
                      cursor: isAuditStarted ? "not-allowed" : "text",
                      color: isAuditStarted ? "#6c757d" : "inherit",
                    }}
                    disabled={isAuditStarted}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#495057",
                    }}
                  >
                    Representative Name
                  </label>
                  <input
                    type="text"
                    name="representativeName"
                    value={unitDetails.representativeName}
                    onChange={handleInputChange}
                    placeholder="Enter representative's name"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "14px",
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                      boxSizing: "border-box",
                      backgroundColor: isAuditStarted ? "#e9ecef" : "white",
                      cursor: isAuditStarted ? "not-allowed" : "text",
                      color: isAuditStarted ? "#6c757d" : "inherit",
                    }}
                    disabled={isAuditStarted}
                  />
                </div>

                <div
                  style={{
                    marginBottom: "16px",
                    gridColumn: "1 / -1",
                  }}
                >
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#495057",
                    }}
                  >
                    Complete Address
                  </label>
                  <input
                    type="text"
                    name="completeAddress"
                    value={unitDetails.completeAddress}
                    onChange={handleInputChange}
                    placeholder="Enter full address"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "14px",
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                      boxSizing: "border-box",
                      backgroundColor: isAuditStarted ? "#e9ecef" : "white",
                      cursor: isAuditStarted ? "not-allowed" : "text",
                      color: isAuditStarted ? "#6c757d" : "inherit",
                    }}
                    disabled={isAuditStarted}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#495057",
                    }}
                  >
                    Contact Number
                  </label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={unitDetails.contactNumber}
                    onChange={handleInputChange}
                    placeholder="Enter contact number"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "14px",
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                      boxSizing: "border-box",
                      backgroundColor: isAuditStarted ? "#e9ecef" : "white",
                      cursor: isAuditStarted ? "not-allowed" : "text",
                      color: isAuditStarted ? "#6c757d" : "inherit",
                    }}
                    disabled={isAuditStarted}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#495057",
                    }}
                  >
                    Email ID
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={unitDetails.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "14px",
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                      boxSizing: "border-box",
                      backgroundColor: isAuditStarted ? "#e9ecef" : "white",
                      cursor: isAuditStarted ? "not-allowed" : "text",
                      color: isAuditStarted ? "#6c757d" : "inherit",
                    }}
                    disabled={isAuditStarted}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#495057",
                    }}
                  >
                    Scheduled Manday
                  </label>
                  <input
                    type="text"
                    name="scheduledManday"
                    value={unitDetails.scheduledManday}
                    onChange={handleInputChange}
                    placeholder="e.g., 1.5"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "14px",
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                      boxSizing: "border-box",
                      backgroundColor: isAuditStarted ? "#e9ecef" : "white",
                      cursor: isAuditStarted ? "not-allowed" : "text",
                      color: isAuditStarted ? "#6c757d" : "inherit",
                    }}
                    disabled={isAuditStarted}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#495057",
                    }}
                  >
                    Audit Scope
                  </label>
                  <input
                    type="text"
                    name="auditScope"
                    value={unitDetails.auditScope}
                    onChange={handleInputChange}
                    placeholder="Define the scope of the audit"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "14px",
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                      boxSizing: "border-box",
                      backgroundColor: isAuditStarted ? "#e9ecef" : "white",
                      cursor: isAuditStarted ? "not-allowed" : "text",
                      color: isAuditStarted ? "#6c757d" : "inherit",
                    }}
                    disabled={isAuditStarted}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#495057",
                    }}
                  >
                    Audit Date (From)
                  </label>
                  <input
                    type="text"
                    name="auditDateFrom"
                    value={unitDetails.auditDateFrom}
                    onChange={handleInputChange}
                    placeholder="dd-mm-yyyy"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "14px",
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                      boxSizing: "border-box",
                      backgroundColor: isAuditStarted ? "#e9ecef" : "white",
                      cursor: isAuditStarted ? "not-allowed" : "text",
                      color: isAuditStarted ? "#6c757d" : "inherit",
                    }}
                    disabled={isAuditStarted}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#495057",
                    }}
                  >
                    Audit Date (To)
                  </label>
                  <input
                    type="text"
                    name="auditDateTo"
                    value={unitDetails.auditDateTo}
                    onChange={handleInputChange}
                    placeholder="dd-mm-yyyy"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "14px",
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                      boxSizing: "border-box",
                      backgroundColor: isAuditStarted ? "#e9ecef" : "white",
                      cursor: isAuditStarted ? "not-allowed" : "text",
                      color: isAuditStarted ? "#6c757d" : "inherit",
                    }}
                    disabled={isAuditStarted}
                  />
                </div>

                <div
                  style={{
                    marginBottom: "16px",
                    gridColumn: "1 / -1",
                  }}
                >
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#495057",
                    }}
                  >
                    Geotag Location
                  </label>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexDirection: "row",
                    }}
                  >
                    <input
                      type="text"
                      value={geotagLocation}
                      readOnly
                      placeholder="Click to fetch location"
                      style={{
                        flex: "1",
                        padding: "10px 12px",
                        fontSize: "14px",
                        border: "1px solid #ced4da",
                        borderRadius: "4px",
                        boxSizing: "border-box",
                        backgroundColor: isAuditStarted ? "#e9ecef" : "white",
                        cursor: "not-allowed",
                        color: "#6c757d",
                      }}
                    />
                    <button
                      onClick={handleGetGeotag}
                      style={{
                        padding: "10px 16px",
                        fontSize: "14px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: isAuditStarted ? "not-allowed" : "pointer",
                        backgroundColor: isAuditStarted ? "#e9ecef" : "#6c757d",
                        color: "white",
                        whiteSpace: "nowrap",
                      }}
                      disabled={isAuditStarted}
                    >
                      📍 Get Location
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#495057",
                    }}
                  >
                    Audit Start Time
                  </label>
                  <input
                    type="text"
                    value={
                      auditStartTime ? auditStartTime.toLocaleString() : ""
                    }
                    readOnly
                    placeholder="Not started"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "14px",
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                      boxSizing: "border-box",
                      backgroundColor: "#e9ecef",
                      cursor: "not-allowed",
                      color: "#6c757d",
                    }}
                  />
                </div>
              </div>

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #e9ecef",
                  margin: "20px 0",
                }}
              />

              {/* Audit Controls and Timers */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "20px",
                  width: "100%",
                }}
              >
                {/* Buttons Section */}
                <div
                  style={{
                    flex: "1",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "10px",
                      flexWrap: "wrap",
                      width: "100%",
                    }}
                  >
                    {!isAuditStarted ? (
                      <button
                        onClick={handleStartAudit}
                        style={{
                          padding: "12px 16px",
                          fontSize: "14px",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          transition: "all 0.2s ease",
                          backgroundColor: "#28a745",
                          color: "white",
                          justifyContent: "center",
                          width: "auto",
                          flex: "none",
                          minWidth: "140px",
                        }}
                      >
                        ▶ Start Audit
                      </button>
                    ) : (
                      <>
                        {!isPaused ? (
                          <button
                            onClick={handlePauseAudit}
                            style={{
                              padding: "12px 16px",
                              fontSize: "14px",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              transition: "all 0.2s ease",
                              backgroundColor: "#ffc107",
                              color: "#212529",
                              justifyContent: "center",
                              width: "auto",
                              flex: "none",
                              minWidth: "140px",
                            }}
                          >
                            ⏸ Pause Audit
                          </button>
                        ) : (
                          <button
                            onClick={handleResumeAudit}
                            style={{
                              padding: "12px 16px",
                              fontSize: "14px",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              transition: "all 0.2s ease",
                              backgroundColor: "#17a2b8",
                              color: "white",
                              justifyContent: "center",
                              width: "auto",
                              flex: "none",
                              minWidth: "140px",
                            }}
                          >
                            ▶ Resume Audit
                          </button>
                        )}

                        <button
                          onClick={handleCompleteAudit}
                          style={{
                            padding: "12px 16px",
                            fontSize: "14px",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            transition: "all 0.2s ease",
                            backgroundColor: "#28a745",
                            color: "white",
                            justifyContent: "center",
                            width: "auto",
                            flex: "none",
                            minWidth: "140px",
                          }}
                        >
                          ✓ Complete Audit
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Timer Section */}
                <div
                  style={{
                    flex: "1",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderRadius: "6px",
                      padding: "16px",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: "0",
                        width: "100%",
                      }}
                    >
                      {/* Active Time */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          flex: "1",
                          padding: "0 10px",
                          borderRight: "1px solid #dee2e6",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6c757d",
                            marginBottom: "4px",
                            fontWeight: "500",
                          }}
                        >
                          Active Time
                        </div>
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#212529",
                            fontFamily: "monospace",
                          }}
                        >
                          {formatTime(activeTime)}
                        </div>
                      </div>

                      {/* Pause Time */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          flex: "1",
                          padding: "0 10px",
                          borderRight: "1px solid #dee2e6",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6c757d",
                            marginBottom: "4px",
                            fontWeight: "500",
                          }}
                        >
                          Pause Time
                        </div>
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#212529",
                            fontFamily: "monospace",
                          }}
                        >
                          {formatTime(pauseTime)}
                        </div>
                      </div>

                      {/* Total Time */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          flex: "1",
                          padding: "0 10px",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6c757d",
                            marginBottom: "4px",
                            fontWeight: "500",
                          }}
                        >
                          Total Time
                        </div>
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#212529",
                            fontFamily: "monospace",
                          }}
                        >
                          {formatTime(getTotalTime())}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Checklist */}
            <div className="main-page-block">
              <div
                className={`header-bar ${activeHeaders.page ? "is-active" : ""}`}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 className="header-title">{checklistData.title}</h2>
                  <p
                    style={{ fontSize: "0.7rem", color: "inherit", margin: 0 }}
                  >
                    {checklistData.pageNumber}
                  </p>
                </div>
                <div
                  className="score-details-container"
                  style={{ color: "inherit" }}
                >
                  <span>
                    Score:{" "}
                    <span className="score-value">{scores.pageObtained}</span>/
                    {scores.pageMax} ({percentage}%)
                  </span>
                  <span>
                    Unanswered:{" "}
                    <span className="score-value">{scores.pageUnanswered}</span>
                  </span>
                </div>
              </div>

              <div
                style={{
                  padding: "0 16px 16px 16px",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                {checklistData.categories.map((category) => {
                  const categoryScore = calculateCategoryScore(category);
                  const categoryPercentage =
                    categoryScore.max > 0
                      ? Math.round(
                          (categoryScore.obtained / categoryScore.max) * 100,
                        )
                      : 0;

                  return (
                    <div
                      key={category.id}
                      className="sticky-header-group"
                      style={{ marginBottom: "16px", width: "100%" }}
                    >
                      {/* Category Header */}
                      <div
                        className={`header-bar header-risk-high ${
                          category.isApplicable
                            ? activeHeaders.categories[category.id]
                              ? activeHeaders.subcategories[
                                  category.subcategories?.find(
                                    (sub) =>
                                      activeHeaders.subcategories[sub.id],
                                  )?.id
                                ]
                                ? "is-active-path"
                                : "is-active"
                              : ""
                            : "disabled"
                        }`}
                        onClick={() => handleCategoryToggle(category.id)}
                      >
                        <div className="header-main-content">
                          <span
                            className={`icon-chevron ${
                              category.isExpanded ? "" : "collapsed"
                            }`}
                          >
                            ►
                          </span>
                          <h3
                            className="header-title category-title-editable"
                            style={{ flex: 1 }}
                          >
                            {category.title}
                          </h3>
                        </div>
                        <div className="header-controls">
                          <div className="dropdown category-actions-dropdown me-2">
                            <button
                              className={`btn btn-sm btn-icon-header ${
                                !category.isApplicable ? "disabled" : ""
                              }`}
                              type="button"
                              title="Category Actions"
                              disabled={!category.isApplicable}
                            >
                              ⋮
                            </button>
                          </div>
                          <div className="score-details-container">
                            <span className="score-line">
                              Score:{" "}
                              <span className="obtained-score score-value">
                                {categoryScore.obtained}
                              </span>
                              /
                              <span className="total-max-score">
                                {categoryScore.max}
                              </span>
                              (
                              <span className="percentage-score">
                                {categoryPercentage}
                              </span>
                              %)
                            </span>
                            <span className="unanswered-line">
                              Unanswered:{" "}
                              <span className="unanswered-value">
                                {categoryScore.unanswered}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Category Applicability Check */}
                      <div
                        className="applicability-check-wrapper"
                        id={`cat-app-${category.id}`}
                      >
                        <div className="category-applicability-check">
                          <p>Is this category applicable?</p>
                          <div
                            style={{
                              display: "flex",
                              gap: "15px",
                              flexWrap: "wrap",
                            }}
                          >
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input category-applicable-radio"
                                type="radio"
                                name={`applicable-cat-${category.id}`}
                                id={`applicable-cat-yes-${category.id}`}
                                value="yes"
                                checked={category.isApplicable}
                                onChange={() =>
                                  handleCategoryApplicabilityChange(
                                    category.id,
                                    true,
                                  )
                                }
                                data-category-id={category.id}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`applicable-cat-yes-${category.id}`}
                              >
                                Yes
                              </label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input category-applicable-radio"
                                type="radio"
                                name={`applicable-cat-${category.id}`}
                                id={`applicable-cat-no-${category.id}`}
                                value="no"
                                checked={!category.isApplicable}
                                onChange={() =>
                                  handleCategoryApplicabilityChange(
                                    category.id,
                                    false,
                                  )
                                }
                                data-category-id={category.id}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`applicable-cat-no-${category.id}`}
                              >
                                No
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Category Content */}
                      <div
                        className={`content-area ${
                          category.isExpanded ? "is-expanded" : ""
                        } ${!category.isApplicable ? "disabled" : ""}`}
                        id={`${category.id}-content`}
                      >
                        {category.subcategories.map((subcategory) => {
                          const subcategoryScore =
                            calculateSubcategoryScore(subcategory);
                          const subcategoryPercentage =
                            subcategoryScore.max > 0
                              ? Math.round(
                                  (subcategoryScore.obtained /
                                    subcategoryScore.max) *
                                    100,
                                )
                              : 0;

                          return (
                            <div
                              key={subcategory.id}
                              className="subcategory-section"
                              style={{ marginBottom: "16px", width: "100%" }}
                            >
                              {/* Subcategory Header */}
                              <div
                                className={`header-bar header-risk-high ${
                                  !subcategory.isApplicable
                                    ? "disabled"
                                    : activeHeaders.subcategories[
                                          subcategory.id
                                        ]
                                      ? "is-active"
                                      : ""
                                }`}
                                onClick={() =>
                                  handleSubcategoryToggle(
                                    category.id,
                                    subcategory.id,
                                  )
                                }
                              >
                                <div className="header-main-content">
                                  <span
                                    className={`icon-chevron ${
                                      subcategory.isExpanded ? "" : "collapsed"
                                    }`}
                                  >
                                    ►
                                  </span>
                                  <h4
                                    className="header-title"
                                    style={{ flex: 1, fontSize: "0.9rem" }}
                                  >
                                    {subcategory.title}
                                  </h4>
                                </div>
                                <div className="header-controls">
                                  <button
                                    className={`info-icon-btn ${
                                      !subcategory.isApplicable
                                        ? "disabled"
                                        : ""
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (subcategory.isApplicable) {
                                        setInfoModalData({
                                          title: subcategory.title,
                                          content:
                                            subcategory.info ||
                                            "No additional information",
                                          attachment:
                                            subcategory.infoAttachment,
                                        });
                                        setShowInfoModal(true);
                                      }
                                    }}
                                    title="View Subcategory Information"
                                    disabled={!subcategory.isApplicable}
                                  >
                                    ℹ️
                                  </button>
                                  <div className="score-details-container">
                                    <span className="score-line">
                                      Score:{" "}
                                      <span className="obtained-score score-value">
                                        {subcategoryScore.obtained}
                                      </span>
                                      /
                                      <span className="total-max-score">
                                        {subcategoryScore.max}
                                      </span>
                                      (
                                      <span className="percentage-score">
                                        {subcategoryPercentage}
                                      </span>
                                      %)
                                    </span>
                                    <span className="unanswered-line">
                                      Unanswered:{" "}
                                      <span className="unanswered-value">
                                        {subcategoryScore.unanswered}
                                      </span>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Subcategory Applicability Check */}
                              <div
                                className="applicability-check-wrapper"
                                id={`subcat-app-${subcategory.id}`}
                              >
                                <div className="subcategory-applicability-check">
                                  <p>Is this parameter applicable?</p>
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "15px",
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    <div className="form-check form-check-inline">
                                      <input
                                        className="form-check-input subcategory-applicable-radio"
                                        type="radio"
                                        name={`applicable-subcat-${subcategory.id}`}
                                        id={`applicable-subcat-yes-${subcategory.id}`}
                                        value="yes"
                                        checked={subcategory.isApplicable}
                                        onChange={() =>
                                          handleSubcategoryApplicabilityChange(
                                            category.id,
                                            subcategory.id,
                                            true,
                                          )
                                        }
                                        data-subcategory-id={subcategory.id}
                                        data-parent-category-id={category.id}
                                        disabled={!category.isApplicable}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor={`applicable-subcat-yes-${subcategory.id}`}
                                      >
                                        Yes
                                      </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                      <input
                                        className="form-check-input subcategory-applicable-radio"
                                        type="radio"
                                        name={`applicable-subcat-${subcategory.id}`}
                                        id={`applicable-subcat-no-${subcategory.id}`}
                                        value="no"
                                        checked={!subcategory.isApplicable}
                                        onChange={() =>
                                          handleSubcategoryApplicabilityChange(
                                            category.id,
                                            subcategory.id,
                                            false,
                                          )
                                        }
                                        data-subcategory-id={subcategory.id}
                                        data-parent-category-id={category.id}
                                        disabled={!category.isApplicable}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor={`applicable-subcat-no-${subcategory.id}`}
                                      >
                                        No
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Subcategory Content */}
                              <div
                                className={`content-area ${
                                  subcategory.isExpanded ? "is-expanded" : ""
                                } ${!subcategory.isApplicable ? "disabled" : ""}`}
                                id={`${subcategory.id}-content`}
                              >
                                {subcategory.questions.map((question) => (
                                  <div
                                    key={question.id}
                                    className={`question-block risk-${
                                      question.riskLevel
                                    } ${
                                      !subcategory.isApplicable
                                        ? "disabled"
                                        : ""
                                    }`}
                                  >
                                    <div className="question-header">
                                      <p className="question-text">
                                        {question.text}
                                      </p>
                                      <div className="question-header-meta">
                                        <div className="question-marks-display">
                                          Marks:{" "}
                                          <span className="obtained-marks">
                                            {question.selectedAnswerMarks ??
                                              "--"}
                                          </span>
                                          /
                                          <span className="max-question-marks">
                                            {question.maxMarks}
                                          </span>
                                          (
                                          <span className="question-percentage">
                                            {question.selectedAnswerMarks !==
                                              null && question.maxMarks > 0
                                              ? Math.round(
                                                  (question.selectedAnswerMarks /
                                                    question.maxMarks) *
                                                    100,
                                                )
                                              : "--"}
                                          </span>
                                          %)
                                        </div>
                                        <button
                                          className={`info-icon-btn ${
                                            !subcategory.isApplicable
                                              ? "disabled"
                                              : ""
                                          }`}
                                          onClick={() => {
                                            if (subcategory.isApplicable) {
                                              setInfoModalData({
                                                title: "Question Information",
                                                content:
                                                  "Additional information about this question",
                                                attachment: null,
                                              });
                                              setShowInfoModal(true);
                                            }
                                          }}
                                          title="View Information"
                                          disabled={!subcategory.isApplicable}
                                        >
                                          ℹ️
                                        </button>
                                      </div>
                                    </div>

                                    <div className="answer-options">
                                      {question.answers.map((answer, idx) => (
                                        <button
                                          key={idx}
                                          className={`answer-btn ${
                                            question.selectedAnswerMarks ===
                                            answer.marks
                                              ? "selected"
                                              : ""
                                          } ${
                                            !subcategory.isApplicable
                                              ? "disabled"
                                              : ""
                                          }`}
                                          onClick={() => {
                                            if (subcategory.isApplicable) {
                                              handleAnswerSelect(
                                                category.id,
                                                subcategory.id,
                                                question.id,
                                                answer.marks,
                                              );
                                            }
                                          }}
                                          disabled={!subcategory.isApplicable}
                                        >
                                          {answer.text}
                                        </button>
                                      ))}
                                    </div>

                                    {question.comments.length > 0 && (
                                      <div
                                        className="comments-area"
                                        id={`comments-for-${question.id}`}
                                      >
                                        {question.comments.map(
                                          (comment, idx) => (
                                            <div
                                              key={idx}
                                              className="comment-block"
                                            >
                                              <div className="comment-header">
                                                <h6>Comment {idx + 1}</h6>
                                              </div>
                                              <div className="comment-text">
                                                {comment.text}
                                              </div>
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    )}

                                    <div className="action-bar">
                                      <button
                                        className={`action-link add-comment-btn ${
                                          !subcategory.isApplicable
                                            ? "disabled"
                                            : ""
                                        }`}
                                        onClick={() => {
                                          if (subcategory.isApplicable) {
                                            setCurrentQuestionForComment(
                                              question,
                                            );
                                            setShowCommentsModal(true);
                                          }
                                        }}
                                        disabled={!subcategory.isApplicable}
                                      >
                                        💬 Add Comment
                                      </button>
                                      <button
                                        className={`action-link create-action-link ${
                                          !subcategory.isApplicable
                                            ? "disabled"
                                            : ""
                                        }`}
                                        disabled={!subcategory.isApplicable}
                                      >
                                        📎 Create Action
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showGlobalNoteModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowGlobalNoteModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Global Notes</h3>
              <button
                className="close-btn"
                onClick={() => setShowGlobalNoteModal(false)}
              >
                ×
              </button>
            </div>
            <div className="form-group">
              <label>Best Practice/Improvement</label>
              <textarea
                rows={4}
                placeholder="Enter best practices or improvements..."
              ></textarea>
            </div>
            <div className="form-group">
              <label>Opportunity for Improvement</label>
              <textarea
                rows={4}
                placeholder="Enter opportunities for improvement..."
              ></textarea>
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <button
                className="btn btn-secondary"
                onClick={() => setShowGlobalNoteModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowGlobalNoteModal(false)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showCommentsModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCommentsModal(false)}
        >
          <div
            className="modal-content comment-mobail"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: "90vh", overflowY: "auto" }}
          >
            <div className="modal-header">
              <h3 className="modal-title">Add Comment</h3>
              <button
                className="close-btn"
                onClick={() => {
                  setShowCommentsModal(false);
                  setUploadedMedia([]);
                  setSelectedMedia(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="form-group">
              <label>
                Comment Text <span style={{ color: "red" }}>*</span>
              </label>
              <textarea
                rows={4}
                className="textarea-mobail"
                placeholder="Enter your comment..."
              ></textarea>
            </div>

            <div className="form-group">
              {/* <label>Upload Media (Optional)</label> */}

              {/* Media Preview Section */}
              {uploadedMedia.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                      display: "block",
                    }}
                  >
                    {/* Uploaded Media ({uploadedMedia.length}) */}
                  </label>
                  {uploadedMedia.length > 0 && (
                    <div style={{ marginBottom: "1rem" }}>
                      <label
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          marginBottom: "0.5rem",
                          display: "block",
                        }}
                      >
                        Uploaded Media ({uploadedMedia.length})
                      </label>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                        }}
                      >
                        {uploadedMedia.map((media, index) => {
                          // For video, create a video element for thumbnail
                          if (media.type === "video") {
                            return (
                              <div
                                key={index}
                                style={{
                                  position: "relative",
                                  width: "60px",
                                  height: "60px",
                                  borderRadius: "8px",
                                  overflow: "hidden",
                                  border:
                                    selectedMedia === media
                                      ? "2px solid var(--primary-color)"
                                      : "1px solid #e5e7eb",
                                  backgroundColor: "#000",
                                }}
                              >
                                <video
                                  src={media.url}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    setSelectedMedia(media);
                                  }}
                                  onLoadedData={(e) => {
                                    // Seek to 1 second to get a thumbnail
                                    e.target.currentTime = 1;
                                  }}
                                />
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    background: "rgba(0, 0, 0, 0.7)",
                                    color: "white",
                                    borderRadius: "50%",
                                    width: "24px",
                                    height: "24px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  ▶
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newMedia = uploadedMedia.filter(
                                      (_, i) => i !== index,
                                    );
                                    setUploadedMedia(newMedia);
                                    if (selectedMedia === media) {
                                      setSelectedMedia(null);
                                    }
                                  }}
                                  style={{
                                    position: "absolute",
                                    top: "2px",
                                    right: "2px",
                                    background: "rgba(220, 38, 38, 0.9)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: "20px",
                                    height: "20px",
                                    fontSize: "12px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: 0,
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            );
                          }

                          // For images
                          return (
                            <div
                              key={index}
                              style={{
                                position: "relative",
                                width: "60px",
                                height: "60px",
                                borderRadius: "8px",
                                overflow: "hidden",
                                border:
                                  selectedMedia === media
                                    ? "2px solid var(--primary-color)"
                                    : "1px solid #e5e7eb",
                              }}
                            >
                              <img
                                src={media.url}
                                alt={`Upload ${index + 1}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setSelectedMedia(media);
                                }}
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newMedia = uploadedMedia.filter(
                                    (_, i) => i !== index,
                                  );
                                  setUploadedMedia(newMedia);
                                  if (selectedMedia === media) {
                                    setSelectedMedia(null);
                                  }
                                }}
                                style={{
                                  position: "absolute",
                                  top: "2px",
                                  right: "2px",
                                  background: "rgba(220, 38, 38, 0.9)",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "50%",
                                  width: "20px",
                                  height: "20px",
                                  fontSize: "12px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: 0,
                                }}
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Selected Media Preview Modal */}
              {selectedMedia && (
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.9)",
                    zIndex: 10001,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                  }}
                  onClick={() => setSelectedMedia(null)}
                >
                  <div
                    style={{
                      position: "relative",
                      maxWidth: "100%",
                      maxHeight: "100%",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {selectedMedia.type === "image" ? (
                      <img
                        src={selectedMedia.url}
                        alt="Preview"
                        style={{
                          width: "100%",
                          height: "auto",
                          maxHeight: "90vh",
                          objectFit: "contain",
                          borderRadius: "8px",
                        }}
                      />
                    ) : (
                      <video
                        src={selectedMedia.url}
                        controls
                        style={{
                          width: "100%",
                          height: "auto",
                          maxHeight: "90vh",
                          objectFit: "contain",
                          borderRadius: "8px",
                        }}
                      />
                    )}
                    <button
                      onClick={() => setSelectedMedia(null)}
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        fontSize: "24px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* Upload Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                  padding: "16px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  className={`btn btn-primary button_mobile button_mobaill ${
                    activeBtn && activeBtn !== "camera" ? "shrink" : ""
                  }`}
                  onClick={() => {
                    setActiveBtn("camera");
                    setMediaUploadType("camera");
                    setShowCameraModal(true);
                  }}
                  style={{ fontSize: "0.85rem" }}
                >
                  📷 Camera
                </button>
                <button
                  className={`btn btn-primary button_mobile button_mobail ${
                    activeBtn && activeBtn !== "video" ? "shrink" : ""
                  }`}
                  onClick={() => {
                    setActiveBtn("video");
                    setMediaUploadType("video");
                    setShowCameraModal(true);
                  }}
                  style={{ fontSize: "0.85rem" }}
                >
                  🎥 Video
                </button>
                <button
                  className={`btn btn-primary button_mobile button_mobail ${
                    activeBtn && activeBtn !== "gallery" ? "shrink" : ""
                  }`}
                  onClick={() => {
                    setActiveBtn("gallery");
                    setMediaUploadType("gallery");
                    // Trigger file input for gallery
                    document.getElementById("gallery-upload").click();
                  }}
                  style={{ fontSize: "0.85rem" }}
                >
                  🖼️ Gallery
                </button>

                {/* Hidden file input for gallery */}
                <input
                  id="gallery-upload"
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    files.forEach((file) => {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const type = file.type.startsWith("image/")
                          ? "image"
                          : "video";
                        setUploadedMedia((prev) => [
                          ...prev,
                          {
                            type,
                            url: event.target.result,
                            file: file,
                            name: file.name,
                          },
                        ]);
                      };
                      reader.readAsDataURL(file);
                    });
                    e.target.value = ""; // Reset input
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "flex-end",
                flexWrap: "wrap",
                marginTop: "1rem",
              }}
            >
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowCommentsModal(false);
                  setUploadedMedia([]);
                  setSelectedMedia(null);
                }}
                style={{ padding: "0.75rem 1.25rem" }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  // Handle comment submission with media
                  console.log("Submitted with media:", uploadedMedia);
                  setShowCommentsModal(false);
                  setUploadedMedia([]);
                  setSelectedMedia(null);
                }}
                style={{ padding: "0.75rem 1.25rem" }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Camera/Video Upload Modal */}
      <CameraUploadModal
        isOpen={showCameraModal}
        onClose={() => {
          setShowCameraModal(false);
          setMediaUploadType(null);
        }}
        onImageCaptured={(imageUrl) => {
          // This will be called when Save Image is clicked
          if (mediaUploadType === "camera") {
            setUploadedMedia((prev) => [
              ...prev,
              {
                type: "image",
                url: imageUrl,
                name: `camera_${Date.now()}.jpg`,
              },
            ]);
          } else if (mediaUploadType === "video") {
            setUploadedMedia((prev) => [
              ...prev,
              {
                type: "video",
                url: imageUrl,
                name: `video_${Date.now()}.mp4`,
              },
            ]);
          }
          setShowCameraModal(false);
          setMediaUploadType(null);
        }}
        mode={mediaUploadType === "video" ? "video" : "photo"}
      />

      {showInfoModal && (
        <div className="modal-overlay" onClick={() => setShowInfoModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{infoModalData.title}</h3>
              <button
                className="close-btn"
                onClick={() => setShowInfoModal(false)}
              >
                ×
              </button>
            </div>
            <div style={{ marginBottom: "16px", wordBreak: "break-word" }}>
              <p>{infoModalData.content}</p>
            </div>
            {infoModalData.attachment && (
              <div style={{ marginBottom: "16px" }}>
                <strong>Attachment:</strong>
                <a
                  href={infoModalData.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginLeft: "8px", color: "var(--primary-color)" }}
                >
                  View Attachment
                </a>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                className="btn btn-primary"
                onClick={() => setShowInfoModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
