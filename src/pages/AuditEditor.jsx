import React, { useState, useEffect, useRef } from "react";

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

  const timerIntervalRef = useRef(null);
  const pauseStartTimeRef = useRef(null);
  const totalPauseTimeRef = useRef(0);

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
            `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`
          );
        },
        (error) => {
          setGeotagLocation("Error fetching location");
          console.error("Geolocation error:", error);
        }
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
      (cat) => cat.id === categoryId
    );
    if (!category.isApplicable) return; // Don't toggle if not applicable

    setChecklistData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId ? { ...cat, isExpanded: !cat.isExpanded } : cat
      ),
    }));

    if (
      !checklistData.categories.find((cat) => cat.id === categoryId)?.isExpanded
    ) {
      setChecklistData((prev) => ({
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === categoryId ? cat : { ...cat, isExpanded: false }
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
              }
        ),
      }));
    }
  };

  // Handle subcategory expand/collapse
  const handleSubcategoryToggle = (categoryId, subcategoryId) => {
    const category = checklistData.categories.find(
      (cat) => cat.id === categoryId
    );
    const subcategory = category?.subcategories.find(
      (sub) => sub.id === subcategoryId
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
                  : sub
              ),
            }
          : cat
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
          (sub) => sub.id === deepestExpandedHeader.id
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
    isApplicable
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
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
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
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif;
          background-color: var(--bg-color);
          color: var(--text-color);
          margin: 0;
          padding: 0;
          min-height: 100vh;
        }
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
        .question-block.risk-high {
          border-left: 5px solid var(--danger-color) !important;
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
        @media (max-width: 480px) {
          .answer-btn {
            min-width: calc(50% - 4px);
            flex: 0 0 calc(50% - 4px);
          }
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
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1060;
          padding: 10px;
        }
        .modal-content {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          max-width: 500px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          box-sizing: border-box;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .modal-title {
          font-size: 1.25rem;
          font-weight: 600;
          word-break: break-word;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
          flex-shrink: 0;
          padding: 0 0 0 10px;
        }
        .form-group {
          margin-bottom: 16px;
          width: 100%;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: var(--text-color);
          word-break: break-word;
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-size: 0.95rem;
          font-family: inherit;
          box-sizing: border-box;
        }
        .btn {
          padding: 10px 16px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          font-size: 0.9rem;
          white-space: nowrap;
          box-sizing: border-box;
        }
        .btn-primary {
          background-color: var(--primary-color);
          color: white;
        }
        .btn-primary:hover {
          background-color: var(--primary-dark);
        }
        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }
        .comments-area {
          margin-top: 15px;
          border-top: 1px dashed var(--border-color);
          padding-top: 15px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
        }
        @media (min-width: 768px) {
          .comments-area {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }
        }
        .comment-block {
          background-color: #fdfdff;
          border-left: 4px solid var(--primary-light);
          padding: 12px 15px;
          border-radius: 6px;
          word-break: break-word;
        }
        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .comment-header h6 {
          font-size: 0.9rem;
          font-weight: 600;
          margin: 0;
          color: var(--primary-dark);
        }
        .comment-text {
          font-size: 0.9rem;
          white-space: pre-wrap;
          word-break: break-word;
          color: var(--text-color);
          line-height: 1.4;
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
        @media (min-width: 768px) {
          .category-applicability-check,
          .subcategory-applicability-check {
            flex-direction: row;
            align-items: center;
            gap: 15px;
          }
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
        .dropdown {
          position: relative;
          display: inline-block;
        }
        .dropdown-menu {
          position: absolute;
          background-color: white;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          padding: 5px 0;
          min-width: 150px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          z-index: 1000;
        }
        .dropdown-menu-end {
          right: 0;
          left: auto;
        }
        .dropdown-item {
          padding: 8px 12px;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-size: 0.85rem;
          color: var(--text-color);
          word-break: break-word;
        }
        .dropdown-item:hover {
          background-color: #f8f9fa;
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
        
        /* Responsive adjustments */
        @media (max-width: 767px) {
          .app-container {
            padding: 8px;
          }
          .unit-details-container {
            padding: 1rem;
          }
          .header-bar {
            flex-direction: column;
            align-items: flex-start;
          }
          .score-details-container {
            align-items: flex-start;
            text-align: left;
            margin-top: 8px;
            width: 100%;
          }
          .header-controls {
            width: 100%;
            justify-content: space-between;
            margin-top: 8px;
          }
          .category-applicability-check,
          .subcategory-applicability-check {
            align-items: flex-start;
          }
          .question-header-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .action-bar {
            justify-content: space-between;
          }
        }
        
        @media (max-width: 480px) {
          .app-container {
            padding: 5px;
          }
          .unit-details-container {
            padding: 0.75rem;
          }
          .question-block {
            padding: 12px;
          }
          .answer-btn {
            font-size: 0.8rem;
            padding: 6px 8px;
          }
          .action-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .modal-content {
            padding: 15px;
          }
        }
      `}</style>

      <div className="app-container">
        {/* Unit Details Form */}
        <div className="unit-details-container">
          <h5 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#333", borderBottom: "1px solid #e9ecef", paddingBottom: "8px" }}>
            Unit Details
          </h5>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))", 
            gap: "16px" 
          }}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#495057" }}>Company Name</label>
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
                  color: isAuditStarted ? "#6c757d" : "inherit"
                }}
                disabled={isAuditStarted}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#495057" }}>Representative Name</label>
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
                  color: isAuditStarted ? "#6c757d" : "inherit"
                }}
                disabled={isAuditStarted}
              />
            </div>

            <div style={{ marginBottom: "16px", gridColumn: isMobile ? "1" : "1 / -1" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#495057" }}>Complete Address</label>
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
                  color: isAuditStarted ? "#6c757d" : "inherit"
                }}
                disabled={isAuditStarted}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#495057" }}>Contact Number</label>
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
                  color: isAuditStarted ? "#6c757d" : "inherit"
                }}
                disabled={isAuditStarted}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#495057" }}>Email ID</label>
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
                  color: isAuditStarted ? "#6c757d" : "inherit"
                }}
                disabled={isAuditStarted}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#495057" }}>Scheduled Manday</label>
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
                  color: isAuditStarted ? "#6c757d" : "inherit"
                }}
                disabled={isAuditStarted}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#495057" }}>Audit Scope</label>
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
                  color: isAuditStarted ? "#6c757d" : "inherit"
                }}
                disabled={isAuditStarted}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#495057" }}>Audit Date (From)</label>
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
                  color: isAuditStarted ? "#6c757d" : "inherit"
                }}
                disabled={isAuditStarted}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#495057" }}>Audit Date (To)</label>
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
                  color: isAuditStarted ? "#6c757d" : "inherit"
                }}
                disabled={isAuditStarted}
              />
            </div>

            <div style={{ marginBottom: "16px", gridColumn: isMobile ? "1" : "1 / -1" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#495057" }}>Geotag Location</label>
              <div style={{ display: "flex", gap: "8px", flexDirection: isMobile ? "column" : "row" }}>
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
                    color: "#6c757d"
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
                    whiteSpace: "nowrap"
                  }}
                  disabled={isAuditStarted}
                >
                  📍 Get Location
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#495057" }}>Audit Start Time</label>
              <input
                type="text"
                value={auditStartTime ? auditStartTime.toLocaleString() : ""}
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
                  color: "#6c757d"
                }}
              />
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #e9ecef", margin: "20px 0" }} />

          {/* Audit Controls and Timers */}
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "stretch" : "center",
              gap: "20px",
              width: "100%"
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
                  flexDirection: isMobile ? "column" : "row",
                  gap: "10px",
                  flexWrap: "wrap",
                  width: "100%"
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
                      width: isMobile ? "100%" : "auto",
                      flex: isMobile ? "1" : "none",
                      minWidth: "140px"
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
                          width: isMobile ? "100%" : "auto",
                          flex: isMobile ? "1" : "none",
                          minWidth: "140px"
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
                          width: isMobile ? "100%" : "auto",
                          flex: isMobile ? "1" : "none",
                          minWidth: "140px"
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
                        width: isMobile ? "100%" : "auto",
                        flex: isMobile ? "1" : "none",
                        minWidth: "140px"
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
                  padding: isMobile ? "20px 16px" : "16px",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between",
                    gap: isMobile ? "15px" : "0",
                    width: "100%"
                  }}
                >
                  {/* Active Time */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: isMobile ? "row" : "column",
                      alignItems: isMobile ? "center" : "center",
                      justifyContent: isMobile ? "space-between" : "center",
                      textAlign: isMobile ? "left" : "center",
                      flex: "1",
                      padding: isMobile ? "0" : "0 10px",
                      borderRight: !isMobile ? "1px solid #dee2e6" : "none",
                      borderBottom: isMobile ? "none" : "none",
                      width: "100%"
                    }}
                  >
                    <div
                      style={{
                        fontSize: isMobile ? "14px" : "12px",
                        color: "#6c757d",
                        marginBottom: isMobile ? "0" : "4px",
                        fontWeight: "500",
                      }}
                    >
                      Active Time
                    </div>
                    <div
                      style={{
                        fontSize: isMobile ? "16px" : "18px",
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
                      flexDirection: isMobile ? "row" : "column",
                      alignItems: isMobile ? "center" : "center",
                      justifyContent: isMobile ? "space-between" : "center",
                      textAlign: isMobile ? "left" : "center",
                      flex: "1",
                      padding: isMobile ? "0" : "0 10px",
                      borderRight: !isMobile ? "1px solid #dee2e6" : "none",
                      borderTop: isMobile ? "1px solid #e9ecef" : "none",
                      paddingTop: isMobile ? "15px" : "0",
                      width: "100%"
                    }}
                  >
                    <div
                      style={{
                        fontSize: isMobile ? "14px" : "12px",
                        color: "#6c757d",
                        marginBottom: isMobile ? "0" : "4px",
                        fontWeight: "500",
                      }}
                    >
                      Pause Time
                    </div>
                    <div
                      style={{
                        fontSize: isMobile ? "16px" : "18px",
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
                      flexDirection: isMobile ? "row" : "column",
                      alignItems: isMobile ? "center" : "center",
                      justifyContent: isMobile ? "space-between" : "center",
                      textAlign: isMobile ? "left" : "center",
                      flex: "1",
                      padding: isMobile ? "0" : "0 10px",
                      borderTop: isMobile ? "1px solid #e9ecef" : "none",
                      paddingTop: isMobile ? "15px" : "0",
                      width: "100%"
                    }}
                  >
                    <div
                      style={{
                        fontSize: isMobile ? "14px" : "12px",
                        color: "#6c757d",
                        marginBottom: isMobile ? "0" : "4px",
                        fontWeight: "500",
                      }}
                    >
                      Total Time
                    </div>
                    <div
                      style={{
                        fontSize: isMobile ? "16px" : "18px",
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
              <p style={{ fontSize: "0.7rem", color: "inherit", margin: 0 }}>
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

          <div style={{ padding: isMobile ? "0 8px 16px 8px" : "0 16px 16px 16px", width: "100%", boxSizing: "border-box" }}>
            {checklistData.categories.map((category) => {
              const categoryScore = calculateCategoryScore(category);
              const categoryPercentage =
                categoryScore.max > 0
                  ? Math.round(
                      (categoryScore.obtained / categoryScore.max) * 100
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
                                (sub) => activeHeaders.subcategories[sub.id]
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
                      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input category-applicable-radio"
                            type="radio"
                            name={`applicable-cat-${category.id}`}
                            id={`applicable-cat-yes-${category.id}`}
                            value="yes"
                            checked={category.isApplicable}
                            onChange={() =>
                              handleCategoryApplicabilityChange(category.id, true)
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
                                false
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
                                100
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
                                : activeHeaders.subcategories[subcategory.id]
                                ? "is-active"
                                : ""
                            }`}
                            onClick={() =>
                              handleSubcategoryToggle(
                                category.id,
                                subcategory.id
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
                                  !subcategory.isApplicable ? "disabled" : ""
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (subcategory.isApplicable) {
                                    setInfoModalData({
                                      title: subcategory.title,
                                      content:
                                        subcategory.info ||
                                        "No additional information",
                                      attachment: subcategory.infoAttachment,
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
                              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
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
                                        true
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
                                        false
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
                                  !subcategory.isApplicable ? "disabled" : ""
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
                                        {question.selectedAnswerMarks ?? "--"}
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
                                                100
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
                                            answer.marks
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
                                    {question.comments.map((comment, idx) => (
                                      <div key={idx} className="comment-block">
                                        <div className="comment-header">
                                          <h6>Comment {idx + 1}</h6>
                                        </div>
                                        <div className="comment-text">
                                          {comment.text}
                                        </div>
                                      </div>
                                    ))}
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
                                        setCurrentQuestionForComment(question);
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
                flexWrap: "wrap"
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add Comment</h3>
              <button
                className="close-btn"
                onClick={() => setShowCommentsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="form-group">
              <label>
                Comment Text <span style={{ color: "red" }}>*</span>
              </label>
              <textarea rows={4} placeholder="Enter your comment..."></textarea>
            </div>
            <div className="form-group">
              <label>Upload Media (Optional)</label>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                  padding: "16px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                  flexWrap: "wrap"
                }}
              >
                <button
                  className="btn btn-primary"
                  style={{ fontSize: "0.85rem" }}
                >
                  📷 Camera
                </button>
                <button
                  className="btn btn-primary"
                  style={{ fontSize: "0.85rem" }}
                >
                  🎥 Video
                </button>
                <button
                  className="btn btn-primary"
                  style={{ fontSize: "0.85rem" }}
                >
                  🖼️ Gallery
                </button>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "flex-end",
                flexWrap: "wrap"
              }}
            >
              <button
                className="btn btn-secondary"
                onClick={() => setShowCommentsModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowCommentsModal(false)}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

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