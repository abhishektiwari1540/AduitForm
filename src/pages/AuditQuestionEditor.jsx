import { useState, useRef, useEffect, useCallback } from "react";
import {
  FaTrashAlt,
  FaEllipsisV,
  FaPlus,
  FaBell,
  FaFileAlt,
  FaLink,
  FaChevronDown,
  FaCheck,
  FaClipboardCheck,
  FaComments,
  FaSyncAlt,
  FaExternalLinkAlt,
  FaSearch,
  FaCogs,
  FaRandom,
  FaArrowLeft,
  FaUsers,
  FaGlobe,
  FaStar,
  FaEdit,
  FaSave,
  FaTimes,
  FaPalette,
  FaFlag,
  FaCalculator,
} from "react-icons/fa";
import { FaCopy } from "react-icons/fa6";
import axios from "axios";
import { useParams } from "react-router-dom";
import { multipleChoiceService } from "../pages/services/multipleChoiceService";
const styles = `
  .scoring-panel-popup {
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .pill-yes {
    background-color: #e6f4ea !important;
    color: #006400 !important;
  }

  .pill-no {
    background-color: #fdecea !important;
    color: #a00000 !important;
  }

  .pill-na {
    background-color: #f0f0f0 !important;
    color: #666 !important;
  }

  .pill-good {
    background-color: #e6f4ea !important;
    color: #006400 !important;
  }

  .pill-fair {
    background-color: #fef3c7 !important;
    color: #92400e !important;
  }

  .pill-poor {
    background-color: #fdecea !important;
    color: #a00000 !important;
  }

  @media (max-width: 768px) {
  .max-score-input-group {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 6px !important;
  }
  
  .max-score-input {
    font-size: 16px !important;
    padding: 10px 0px !important;
    width: 100% !important;
  }
  
  .more-options-btn-for-score {
    width: 100% !important;
    padding: 10px !important;
    font-size: 1.3rem !important;
  }
  
  /* Optional: Adjust padding for mobile */
  .max-score-widget {
    padding: 10px !important;
        right: 17px;
  }
}
`;
import RequireEvidenceModal from "./RequireEvidenceModal";
import NotifyModal from "./NotifyModal";

export default function AuditQuestionEditor() {
  const API_BASE_URL =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api/";
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const unitId = useParams().id;
  const [unitDetails, setUnitDetails] = useState({
    unitName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    coordinates: "",
    auditDate: "",
    auditType: "",
    auditorName: "",
    auditorEmail: "",

    companyName: "",
    representativeName: "",
    contactNumber: "",
    email: "",
    scheduledManday: "",
    auditScope: "",
    auditDateFrom: "",
    auditDateTo: "",
    auditStartTime: "",
  });

  const [logicModalState, setLogicModalState] = useState({
    type: null,
    questionId: null,
    ruleId: null,
    triggerId: null,
    conditionResponse: "No",
    initialConfig: null,
  });
  const [pages, setPages] = useState([
    {
      id: 1,
      title: "Food Production & Safety Checklist",
      sections: [
        {
          id: 1,
          title: "General Cleanliness",
          questions: [
            {
              id: 1,
              text: "Are all food contact surfaces cleaned and sanitized before and after use?",
              responses: [
                {
                  text: "Yes",
                  pillClass: "yes",
                  score: 1,
                  flagged: false,
                  colorHex: "#13855f",
                },
                {
                  text: "No",
                  pillClass: "no",
                  score: 0,
                  flagged: true,
                  colorHex: "#ef4444",
                },
                {
                  text: "N/A",
                  pillClass: "na",
                  score: "/",
                  flagged: false,
                  colorHex: "#a0aec0",
                },
              ],
              maxScore: 0,
              standardRequirement: "",
              questionRisk: "Low",
              isRequired: false,
              isMultiple: false,
              isFlaggedDefault: true,
              logicRules: [], // Already have this
              showLogicBuilder: false, // Add this line
            },
          ],
          applicable: "Applicable",
          risk: "",
          collapsed: false,
        },
      ],
    },
  ]);

  const [globalResponseSets, setGlobalResponseSets] = useState([]);
  const [loadingGlobalSets, setLoadingGlobalSets] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSaveAsGlobalModal, setShowSaveAsGlobalModal] = useState(false);
  const [newGlobalSetName, setNewGlobalSetName] = useState("");
  const [editingGlobalSetId, setEditingGlobalSetId] = useState(null);
  const [currentQuestionData, setCurrentQuestionData] = useState({
    pageId: null,
    sectionId: null,
    questionId: null,
    questionText: "",
  });

  const colorPalette = [
    { hex: "#13855f", class: "yes", title: "Green (Yes/Good)" },
    { hex: "#ef4444", class: "no", title: "Red (No/Poor)" },
    { hex: "#a0aec0", class: "na", title: "Gray (N/A)" },
    { hex: "#f59e0b", class: "fair", title: "Yellow (Fair)" },
    { hex: "#6e42ff", class: "primary", title: "Purple (Primary)" },
    { hex: "#f0eefe", class: "light-purple", title: "Light Purple BG" },
    { hex: "#ffedd5", class: "custom-orange", title: "Orange" },
    { hex: "#fef9c3", class: "custom-light-yellow", title: "Light Yellow" },
    { hex: "#dbeafe", class: "custom-light-blue", title: "Light Blue" },
    { hex: "#dcfce7", class: "custom-light-green", title: "Light Green" },
    { hex: "#ccfbf1", class: "custom-teal", title: "Teal" },
    { hex: "#e0f2fe", class: "custom-sky-blue", title: "Sky Blue" },
    { hex: "#e0e7ff", class: "custom-indigo", title: "Indigo" },
  ];

  // Predefined response sets
  const predefinedResponseSets = [
    {
      id: "yes-no-na",
      name: "Yes/No/N/A",
      responses: [
        {
          text: "Yes",
          class: "yes",
          score: "1",
          flagged: false,
          colorHex: "#13855f",
        },
        {
          text: "No",
          class: "no",
          score: "0",
          flagged: true,
          colorHex: "#ef4444",
        },
        {
          text: "N/A",
          class: "na",
          score: "/",
          flagged: false,
          colorHex: "#a0aec0",
        },
      ],
      isPredefined: true,
    },
    {
      id: "good-fair-poor",
      name: "Good/Fair/Poor",
      responses: [
        {
          text: "Good",
          class: "good",
          score: "1",
          flagged: false,
          colorHex: "#13855f",
        },
        {
          text: "Fair",
          class: "fair",
          score: "0.5",
          flagged: false,
          colorHex: "#f59e0b",
        },
        {
          text: "Poor",
          class: "poor",
          score: "0",
          flagged: true,
          colorHex: "#ef4444",
        },
      ],
      isPredefined: true,
    },
  ];

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    fetchUnitData();
    fetchGlobalResponseSets();
  }, []);

  // Fetch global response sets
  const fetchGlobalResponseSets = async () => {
    try {
      setLoadingGlobalSets(true);
      const data = await multipleChoiceService.getGlobalResponseSets();
      setGlobalResponseSets(data.data || []);
    } catch (error) {
      console.error("Error fetching global response sets:", error);
      setGlobalResponseSets([]);
    } finally {
      setLoadingGlobalSets(false);
    }
  };

  // Handle saving multiple choice responses
  const saveMultipleChoiceResponses = async (questionId, responses) => {
    try {
      const result = await multipleChoiceService.saveMultipleChoiceResponses(
        questionId,
        responses
      );
      console.log("Responses saved successfully:", result);
      return true;
    } catch (error) {
      console.error("Error saving multiple choice responses:", error);
      alert("Failed to save responses. Please try again.");
      return false;
    }
  };

  // Handle saving as global response set
  const handleSaveAsGlobalSet = async () => {
    if (!newGlobalSetName.trim()) {
      alert("Please enter a name for the response set");
      return;
    }

    if (editingResponses.length === 0) {
      alert("No responses to save");
      return;
    }

    try {
      await multipleChoiceService.saveAsGlobalResponseSet(
        newGlobalSetName,
        editingResponses
      );

      // Refresh global sets
      await fetchGlobalResponseSets();

      setShowSaveAsGlobalModal(false);
      setNewGlobalSetName("");
      alert("Response set saved successfully!");
    } catch (error) {
      console.error("Error saving global response set:", error);
      alert("Failed to save as global set. Please try again.");
    }
  };

  // Handle updating a global response set
  const handleUpdateGlobalSet = async (setId) => {
    try {
      await multipleChoiceService.updateGlobalResponseSet(setId, {
        responses: editingResponses,
      });

      await fetchGlobalResponseSets();
      setEditingGlobalSetId(null);
      alert("Response set updated successfully!");
    } catch (error) {
      console.error("Error updating global response set:", error);
      alert("Failed to update response set. Please try again.");
    }
  };

  // Handle deleting a global response set
  const handleDeleteGlobalSet = async (setId, e) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this response set?")) {
      return;
    }

    try {
      await multipleChoiceService.deleteGlobalResponseSet(setId);
      await fetchGlobalResponseSets();
      alert("Response set deleted successfully!");
    } catch (error) {
      console.error("Error deleting global response set:", error);
      alert("Failed to delete response set. Please try again.");
    }
  };

  // Filter global response sets based on search query
  const filteredGlobalSets = globalResponseSets.filter((set) =>
    set.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Combined sets (predefined + global)
  const allResponseSets = [...predefinedResponseSets, ...filteredGlobalSets];

  // Open edit modal with question data
  const openEditModal = (
    pageId,
    sectionId,
    questionId,
    questionText,
    existingResponses = [],
    globalSetId = null
  ) => {
    setCurrentQuestionData({
      pageId,
      sectionId,
      questionId,
      questionText,
    });

    // Set editing responses - use existing ones or create empty array
    if (existingResponses && existingResponses.length > 0) {
      setEditingResponses(existingResponses);
    } else {
      setEditingResponses([
        {
          text: "",
          class: "",
          score: "0",
          flagged: false,
          colorHex: "#6b7280",
        },
      ]);
    }

    setEditingGlobalSetId(globalSetId);
    setIsEditModalOpen(true);
  };

  // Handle save and apply
  const handleSaveAndApply = async () => {
    // Validate responses
    const validResponses = editingResponses.filter((r) => r.text.trim() !== "");
    if (validResponses.length === 0) {
      alert("Please add at least one response");
      return;
    }

    const { pageId, sectionId, questionId } = currentQuestionData;

    // Save to backend first
    const success = await saveMultipleChoiceResponses(
      questionId,
      validResponses
    );

    if (success) {
      // Update local state
      updateQuestion(pageId, sectionId, questionId, {
        responses: validResponses,
      });

      // If we were editing a global set, update it
      if (editingGlobalSetId) {
        await handleUpdateGlobalSet(editingGlobalSetId);
      }

      setIsEditModalOpen(false);
      setEditingGlobalSetId(null);
      setCurrentQuestionData({
        pageId: null,
        sectionId: null,
        questionId: null,
        questionText: "",
      });
    }
  };

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  useEffect(() => {
    fetchUnitData();
  }, []);

 const fetchUnitData = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await axios.get(`${API_BASE_URL}audit-templates/${unitId}`);
    const templateData = response.data.data;
    
    console.log("Fetched Audit Template Data:", templateData);
    
    // Check if data exists and has the expected structure
    if (templateData) {
      // Map API data to your unitDetails state
      setUnitDetails({
        companyName: templateData?.unitDetails?.company_name || templateData?.company_name || "",
        representativeName: templateData?.unitDetails?.representative_name || templateData?.representative_name || "",
        address: templateData?.unitDetails?.complete_address || templateData?.complete_address || "",
        contactNumber: templateData?.unitDetails?.contact_number || templateData?.contact_number || "",
        email: templateData?.unitDetails?.email || templateData?.email || "",
        scheduledManday: templateData?.unitDetails?.scheduled_manday || templateData?.scheduled_manday || "",
        auditScope: templateData?.unitDetails?.audit_scope || templateData?.audit_scope || "",
        auditDateFrom: templateData?.unitDetails?.audit_date_from || templateData?.audit_date_from
          ? formatDateForInput(templateData?.unitDetails?.audit_date_from || templateData?.audit_date_from)
          : "",
        auditDateTo: templateData?.unitDetails?.audit_date_to || templateData?.audit_date_to
          ? formatDateForInput(templateData?.unitDetails?.audit_date_to || templateData?.audit_date_to)
          : "",
        coordinates: templateData?.unitDetails?.geotag_location || templateData?.geotag_location || "",
      });
      
      // Load template pages
      if (templateData.pages && Array.isArray(templateData.pages)) {
        setPages(templateData.pages);
      } else if (templateData.data?.pages && Array.isArray(templateData.data.pages)) {
        setPages(templateData.data.pages);
      }
      
      // Set audit start time if available
      if (templateData.audit_start_time) {
        setAuditStartTime(templateData.audit_start_time);
        setAuditStarted(true);
      }
    }
    
  } catch (err) {
    console.error("Error fetching audit template:", err);
    setError("Failed to load audit template. Please try again.");
  } finally {
    setLoading(false);
  }
};
  
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [showMaxScoreWidget, setShowMaxScoreWidget] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingResponses, setEditingResponses] = useState([]);
  const [isScoringEnabled, setIsScoringEnabled] = useState(true);
  const [auditStarted, setAuditStarted] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [lastSaved, setLastSaved] = useState("Not saved yet");
  const [activeColorPickerIndex, setActiveColorPickerIndex] = useState(null);
  const [activeTriggerMenu, setActiveTriggerMenu] = useState(null); // Added this state
  const [geotagLoading, setGeotagLoading] = useState(false);
  const [showLogicConfig, setShowLogicConfig] = useState(false);
  const [logicConfigType, setLogicConfigType] = useState(null); // 'evidence' or 'notify'
  const [logicConfigResponse, setLogicConfigResponse] = useState("No");
  const [logicQuestionId, setLogicQuestionId] = useState(null);
  const [logicSectionId, setLogicSectionId] = useState(null);
  const [logicPageId, setLogicPageId] = useState(null);
  const [auditStartTime, setAuditStartTime] = useState("");

  const [scoringPanelState, setScoringPanelState] = useState({
    isOpen: false,
    questionId: null,
    sectionId: null,
    pageId: null,
    maxScore: 0,
    position: { top: 0, left: 0 },
  });
  const [scoringPanelMaxScore, setScoringPanelMaxScore] = useState(0);
  const [colorPickerPosition, setColorPickerPosition] = useState({
    top: 0,
    left: 0,
  });
  
  // Save/Update functionality
const handleSaveOrUpdate = async () => {
  try {
    setSaving(true);
    
    // Prepare the complete data object
    const dataToSave = {
      unit_details: {
        company_name: unitDetails.companyName,
        representative_name: unitDetails.representativeName,
        complete_address: unitDetails.address,
        contact_number: unitDetails.contactNumber,
        email: unitDetails.email,
        scheduled_manday: unitDetails.scheduledManday,
        audit_scope: unitDetails.auditScope,
        audit_date_from: unitDetails.auditDateFrom,
        audit_date_to: unitDetails.auditDateTo,
        geotag_location: unitDetails.coordinates,
      },
      template_data: {
        pages: pages,
        last_updated: new Date().toISOString(),
        version: '1.0'
      },
      audit_started: auditStarted,
      audit_start_time: auditStartTime
    };

    let response;
    let apiUrl;
    
    if (unitId) {
      // Update existing template
      apiUrl = `${API_BASE_URL}audit-templates/${unitId}`;
      response = await axios.put(apiUrl, dataToSave);
      alert("Audit template updated successfully!");
    } else {
      // Create new template
      apiUrl = `${API_BASE_URL}audit-templates/create`;
      response = await axios.post(apiUrl, dataToSave);
      
      // Get the new template ID from response
      const newTemplateId = response.data.data.templateId;
      alert(`Audit template saved successfully! Template ID: ${newTemplateId}`);
      
      // You can redirect to the edit page with the new ID
      // history.push(`/audit-editor/${newTemplateId}`);
    }
    
    console.log("Save/Update response:", response.data);
    
    // Update last saved time
    const now = new Date();
    setLastSaved(now.toLocaleTimeString());
    
  } catch (error) {
    console.error("Error saving data:", error);
    alert(`Failed to save data: ${error.response?.data?.message || error.message}`);
  } finally {
    setSaving(false);
  }
};




  // Handle export data (for debugging or backup)
  const handleExportData = () => {
    const dataToExport = {
      unitDetails,
      pages,
      exportDate: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `audit-template-${new Date().getTime()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  useEffect(() => {
    if (isEditModalOpen) {
      console.log("Modal is now open");
    }
  }, [isEditModalOpen]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        activeColorPickerIndex !== null &&
        !event.target.closest(".color-picker-popup") &&
        !event.target.closest(".color-indicator")
      ) {
        setActiveColorPickerIndex(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [activeColorPickerIndex]);
  
  // Auto-save functionality
  const saveTimeout = useRef();

  const saveData = useCallback(() => {
    const data = { unitDetails, pages };
    localStorage.setItem("auditEditorData", JSON.stringify(data));
    const now = new Date();
    setLastSaved(now.toLocaleTimeString());
  }, [unitDetails, pages]);

  const debouncedSave = useCallback(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(saveData, 1000);
  }, [saveData]);

  useEffect(() => {
    debouncedSave();
  }, [unitDetails, pages, debouncedSave]);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude.toFixed(
            6
          )}, ${position.coords.longitude.toFixed(6)}`;
          setUnitDetails((prev) => ({ ...prev, coordinates: coords }));
        },
        (error) => {
          alert("Unable to retrieve location: " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const addSection = (pageId) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id === pageId) {
          const newSection = {
            id: Date.now(),
            title: "New Section",
            questions: [],
            applicable: "Applicable",
            risk: "",
            collapsed: false,
          };
          return { ...page, sections: [...page.sections, newSection] };
        }
        return page;
      })
    );
  };

  const addQuestion = (pageId, sectionId) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id === pageId) {
          return {
            ...page,
            sections: page.sections.map((section) => {
              if (section.id === sectionId) {
                const newQuestion = {
                  id: Date.now(),
                  text: "Type question (Drag handles to reorder)",
                  responses: [
                    {
                      text: "Yes",
                      pillClass: "yes",
                      score: 1,
                      flagged: false,
                      colorHex: "#13855f",
                    },
                    {
                      text: "No",
                      pillClass: "no",
                      score: 0,
                      flagged: true,
                      colorHex: "#ef4444",
                    },
                    {
                      text: "N/A",
                      pillClass: "na",
                      score: "/",
                      flagged: false,
                      colorHex: "#a0aec0",
                    },
                  ],
                  maxScore: 0,
                  standardRequirement: "",
                  questionRisk: "Low",
                  isRequired: false,
                  isMultiple: false,
                  isFlaggedDefault: true,
                  logicRules: [], // Add this
                  showLogicBuilder: false, // Add this
                };
                return {
                  ...section,
                  questions: [...section.questions, newQuestion],
                };
              }
              return section;
            }),
          };
        }
        return page;
      })
    );
  };

  const deleteQuestion = (pageId, sectionId, questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      setPages((prev) =>
        prev.map((page) => {
          if (page.id === pageId) {
            return {
              ...page,
              sections: page.sections.map((section) => {
                if (section.id === sectionId) {
                  return {
                    ...section,
                    questions: section.questions.filter(
                      (q) => q.id !== questionId
                    ),
                  };
                }
                return section;
              }),
            };
          }
          return page;
        })
      );
    }
  };

  const deleteSection = (pageId, sectionId) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      setPages((prev) =>
        prev.map((page) => {
          if (page.id === pageId) {
            return {
              ...page,
              sections: page.sections.filter((s) => s.id !== sectionId),
            };
          }
          return page;
        })
      );
    }
  };

  const toggleSection = (pageId, sectionId) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id === pageId) {
          return {
            ...page,
            sections: page.sections.map((section) => {
              if (section.id === sectionId) {
                return { ...section, collapsed: !section.collapsed };
              }
              return section;
            }),
          };
        }
        return page;
      })
    );
  };

  const updateQuestion = async (pageId, sectionId, questionId, updates) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id === pageId) {
          return {
            ...page,
            sections: page.sections.map((section) => {
              if (section.id === sectionId) {
                return {
                  ...section,
                  questions: section.questions.map((q) => {
                    if (q.id === questionId) {
                      const updatedQuestion = { ...q, ...updates };
                      return updatedQuestion;
                    }
                    return q;
                  }),
                };
              }
              return section;
            }),
          };
        }
        return page;
      })
    );
  };

  const toggleLogicBuilder = (pageId, sectionId, qId) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === pageId
          ? {
              ...p,
              sections: p.sections.map((s) =>
                s.id === sectionId
                  ? {
                      ...s,
                      questions: s.questions.map((q) => {
                        if (q.id === qId) {
                          const isOpening = !q.showLogicBuilder;
                          // Ensure logicRules exists
                          const currentLogicRules = q.logicRules || [];
                          let newRules = currentLogicRules;
                          if (isOpening && currentLogicRules.length === 0) {
                            const firstResponse = q.responses[0]?.text || "Yes";
                            newRules = [
                              {
                                id: Math.random().toString(36).substr(2, 9),
                                conditionResponse: firstResponse,
                                triggers: [],
                              },
                            ];
                          }
                          return {
                            ...q,
                            showLogicBuilder: isOpening,
                            logicRules: newRules,
                          };
                        }
                        return q;
                      }),
                    }
                  : s
              ),
            }
          : p
      )
    );
  };
  
  const addLogicRule = (pageId, sectionId, qId) => {
    const question = pages
      .find((p) => p.id === pageId)
      ?.sections.find((s) => s.id === sectionId)
      ?.questions.find((q) => q.id === qId);
    if (!question) return;

    const firstResponse = question.responses[0]?.text || "Yes";
    const newRule = {
      id: Math.random().toString(36).substr(2, 9),
      conditionResponse: firstResponse,
      triggers: [],
    };

    updateQuestion(pageId, sectionId, qId, {
      logicRules: [...question.logicRules, newRule],
      showLogicBuilder: true,
    });
  };

  const removeLogicRule = (pageId, sectionId, qId, ruleId) => {
    const question = pages
      .find((p) => p.id === pageId)
      ?.sections.find((s) => s.id === sectionId)
      ?.questions.find((q) => q.id === qId);
    if (!question) return;
    updateQuestion(pageId, sectionId, qId, {
      logicRules: question.logicRules.filter((r) => r.id !== ruleId),
    });
  };

  const updateLogicRule = (pageId, sectionId, qId, ruleId, updates) => {
    const question = pages
      .find((p) => p.id === pageId)
      ?.sections.find((s) => s.id === sectionId)
      ?.questions.find((q) => q.id === qId);
    if (!question) return;
    updateQuestion(pageId, sectionId, qId, {
      logicRules: question.logicRules.map((r) =>
        r.id === ruleId ? { ...r, ...updates } : r
      ),
    });
  };

  const addTriggerToRule = (pageId, sectionId, qId, ruleId, type) => {
    const question = pages
      .find((p) => p.id === pageId)
      ?.sections.find((s) => s.id === sectionId)
      ?.questions.find((q) => q.id === qId);
    if (!question) return;
    const rule = question.logicRules.find((r) => r.id === ruleId);
    if (!rule) return;

    const newTrigger = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      config: {},
    };

    updateLogicRule(pageId, sectionId, qId, ruleId, {
      triggers: [...rule.triggers, newTrigger],
    });

    setActiveTriggerMenu(null);

    // Automatically open modal for the new trigger
    setLogicModalState({
      type,
      questionId: qId,
      ruleId,
      triggerId: newTrigger.id,
      conditionResponse: rule.conditionResponse,
      initialConfig: {},
    });
  };

  const removeTriggerFromRule = (pageId, sectionId, qId, ruleId, triggerId) => {
    const question = pages
      .find((p) => p.id === pageId)
      ?.sections.find((s) => s.id === sectionId)
      ?.questions.find((q) => q.id === qId);
    if (!question) return;
    const rule = question.logicRules.find((r) => r.id === ruleId);
    if (!rule) return;

    updateLogicRule(pageId, sectionId, qId, ruleId, {
      triggers: rule.triggers.filter((t) => t.id !== triggerId),
    });
  };
  
  const handleTriggerSave = (config) => {
    const { questionId, ruleId, triggerId } = logicModalState;
    if (!questionId || !ruleId || !triggerId) return;

    setPages((prev) =>
      prev.map((p) => ({
        ...p,
        sections: p.sections.map((s) => ({
          ...s,
          questions: s.questions.map((q) => {
            if (q.id === questionId) {
              return {
                ...q,
                logicRules: q.logicRules.map((r) => {
                  if (r.id === ruleId) {
                    return {
                      ...r,
                      triggers: r.triggers.map((t) =>
                        t.id === triggerId ? { ...t, config } : t
                      ),
                    };
                  }
                  return r;
                }),
              };
            }
            return q;
          }),
        })),
      }))
    );
    setLogicModalState((prev) => ({ ...prev, type: null }));
  };

  const updateSection = (pageId, sectionId, updates) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id === pageId) {
          return {
            ...page,
            sections: page.sections.map((section) => {
              if (section.id === sectionId) {
                return { ...section, ...updates };
              }
              return section;
            }),
          };
        }
        return page;
      })
    );
  };

  const handleAddLogic = (
    pageId,
    sectionId,
    questionId,
    responseText = "No"
  ) => {
    setLogicPageId(pageId);
    setLogicSectionId(sectionId);
    setLogicQuestionId(questionId);
    setLogicConfigResponse(responseText);
    setShowLogicConfig(true);
  };

  const handleLogicConfig = (type) => {
    setLogicConfigType(type);
  };
  
  const handleSaveEvidenceConfig = (config) => {
    // Add logic rule to the question
    const rule = {
      id: Date.now(),
      type: "evidence",
      response: logicConfigResponse,
      config: config,
    };

    setPages((prev) =>
      prev.map((page) => {
        if (page.id === logicPageId) {
          return {
            ...page,
            sections: page.sections.map((section) => {
              if (section.id === logicSectionId) {
                return {
                  ...section,
                  questions: section.questions.map((question) => {
                    if (question.id === logicQuestionId) {
                      return {
                        ...question,
                        logicRules: [...(question.logicRules || []), rule],
                      };
                    }
                    return question;
                  }),
                };
              }
              return section;
            }),
          };
        }
        return page;
      })
    );

    setLogicConfigType(null);
    setShowLogicConfig(false);
  };

  const handleSaveNotifyConfig = (config) => {
    // Add logic rule to the question
    const rule = {
      id: Date.now(),
      type: "notify",
      response: logicConfigResponse,
      config: config,
    };

    setPages((prev) =>
      prev.map((page) => {
        if (page.id === logicPageId) {
          return {
            ...page,
            sections: page.sections.map((section) => {
              if (section.id === logicSectionId) {
                return {
                  ...section,
                  questions: section.questions.map((question) => {
                    if (question.id === logicQuestionId) {
                      return {
                        ...question,
                        logicRules: [...(question.logicRules || []), rule],
                      };
                    }
                    return question;
                  }),
                };
              }
              return section;
            }),
          };
        }
        return page;
      })
    );

    setLogicConfigType(null);
    setShowLogicConfig(false);
  };

  const closeLogicConfig = () => {
    setShowLogicConfig(false);
    setLogicConfigType(null);
  };
  
  useEffect(() => {
    const handleScroll = () => {
      if (scoringPanelState.isOpen) {
        closeScoringPanel();
      }
    };

    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [scoringPanelState.isOpen]);

  const openScoringPanel = (e, pageId, sectionId, questionId, maxScore) => {
    e.stopPropagation();

    // Calculate position relative to the button
    const buttonRect = e.currentTarget.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;

    setScoringPanelState({
      isOpen: true,
      questionId,
      sectionId,
      pageId,
      maxScore: maxScore || 0,
      position: {
        top: buttonRect.bottom + scrollTop,
        left: buttonRect.left + scrollLeft,
      },
    });

    setScoringPanelMaxScore(maxScore || 0);
  };

  const handleMaxScoreChange = (value) => {
    setScoringPanelMaxScore(value);

    if (
      scoringPanelState.questionId &&
      scoringPanelState.sectionId &&
      scoringPanelState.pageId
    ) {
      updateQuestion(
        scoringPanelState.pageId,
        scoringPanelState.sectionId,
        scoringPanelState.questionId,
        { maxScore: parseInt(value) || 0 }
      );
    }
  };

  const handleClearMaxScore = () => {
    setScoringPanelMaxScore(0);

    if (
      scoringPanelState.questionId &&
      scoringPanelState.sectionId &&
      scoringPanelState.pageId
    ) {
      updateQuestion(
        scoringPanelState.pageId,
        scoringPanelState.sectionId,
        scoringPanelState.questionId,
        { maxScore: 0 }
      );
    }
  };

  const closeScoringPanel = () => {
    setScoringPanelState({
      isOpen: false,
      questionId: null,
      sectionId: null,
      pageId: null,
      maxScore: 0,
      position: { top: 0, left: 0 },
    });
  };

  const renderResponseSetsSection = (question, pageId, sectionId) => (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: "400px",
        position: "relative",
      }}
    >
      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          padding: "8px 12px",
          marginBottom: "20px",
        }}
      >
        <FaSearch style={{ color: "#6b7280", marginRight: "8px" }} />
        <input
          type="text"
          placeholder="Search responses"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: "none",
            outline: "none",
            fontSize: "16px",
            flexGrow: 1,
            color: "#333",
          }}
        />
      </div>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <h2
          style={{
            fontSize: "16px",
            fontWeight: "500",
            color: "#4b5563",
            margin: 0,
          }}
        >
          Multiple choice
        </h2>
        <button
          onClick={(e) => {
            e.stopPropagation();
            openEditModal(pageId, sectionId, question.id, question.text);
            setActiveDropdownId(null);
            setActiveColorPickerIndex(null);
          }}
          style={{
            color: "#6d28d9",
            fontSize: "14px",
            fontWeight: "500",
            textDecoration: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
          className="add-responses-btn"
        >
          <FaPlus />
          Add responses
        </button>
      </div>

      {/* Response Sets List */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          borderTop: "1px solid #e5e7eb",
          flex: 1,
          overflowY: "auto",
        }}
      >
        {loadingGlobalSets ? (
          <li
            style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}
          >
            Loading response sets...
          </li>
        ) : allResponseSets.length === 0 ? (
          <li
            style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}
          >
            No response sets found. Click "Add responses" to create one.
          </li>
        ) : (
          allResponseSets.map((set) => (
            <li
              key={set.id}
              className="response-set-item"
              onClick={() => {
                updateQuestion(pageId, sectionId, question.id, {
                  responses: set.responses,
                });
                setActiveDropdownId(null);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: "1px solid #e5e7eb",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f8f9fa";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  flexWrap: "wrap",
                  gap: "5px",
                }}
              >
                {set.responses.slice(0, 3).map((resp, idx) => (
                  <span
                    key={idx}
                    className={`pill ${resp.class || "na"}`}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "13px",
                      fontWeight: "500",
                      backgroundColor: resp.colorHex || "#a0aec0",
                      color: "white",
                      display: "inline-block",
                      marginRight: "5px",
                      marginBottom: "3px",
                    }}
                  >
                    {resp.text}
                  </span>
                ))}
                {set.responses.length > 3 && (
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      backgroundColor: "#e5e7eb",
                      color: "#6b7280",
                    }}
                  >
                    +{set.responses.length - 3} more
                  </span>
                )}

                {set.isPredefined ? (
                  <span
                    className="global-set-badge"
                    style={{
                      backgroundColor: "#e6f4ea",
                      color: "#006400",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "0.7rem",
                      marginLeft: "8px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <FaStar size={10} /> Predefined
                  </span>
                ) : (
                  <span
                    className="global-set-badge"
                    style={{
                      backgroundColor: "#e6f4ea",
                      color: "#006400",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "0.7rem",
                      marginLeft: "8px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <FaGlobe size={10} /> Global
                  </span>
                )}
              </div>

              <div style={{ display: "flex", gap: "5px" }}>
                <button
                  className="edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (set.isPredefined) {
                      // For predefined sets, create a copy to edit
                      openEditModal(
                        pageId,
                        sectionId,
                        question.id,
                        question.text,
                        set.responses
                      );
                    } else {
                      // For global sets, edit the actual set
                      openEditModal(
                        pageId,
                        sectionId,
                        question.id,
                        question.text,
                        set.responses,
                        set.id
                      );
                    }
                    setActiveDropdownId(null);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#6d28d9",
                    cursor: "pointer",
                    padding: "5px",
                    flexShrink: 0,
                  }}
                  title="Edit response set"
                >
                  <FaEdit />
                </button>

                {!set.isPredefined && (
                  <button
                    className="delete-btn"
                    onClick={(e) => handleDeleteGlobalSet(set.id, e)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#dc3545",
                      cursor: "pointer",
                      padding: "5px",
                      flexShrink: 0,
                    }}
                    title="Delete response set"
                  >
                    <FaTrashAlt />
                  </button>
                )}
              </div>
            </li>
          ))
        )}
      </ul>

      {/* Global Response Sets Info */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "20px",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <h3
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#4b5563",
            marginTop: 0,
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <FaGlobe /> Global response sets
        </h3>
        <p
          style={{
            fontSize: "13px",
            color: "#6b7280",
            lineHeight: "1.6",
            margin: 0,
          }}
        >
          Create global response sets to use them across multiple templates.
          {globalResponseSets.length > 0 && (
            <span style={{ marginLeft: "5px", fontWeight: "500" }}>
              ({globalResponseSets.length} sets available)
            </span>
          )}
        </p>
      </div>
    </div>
  );

  const renderMultipleChoiceEditorModal = () =>
    isEditModalOpen && (
      <div
        className="multiple-choice-editor-modal modal-overlay"
        id="multipleChoiceEditorModal"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
        onClick={(e) => {
          if (
            e.target.className.includes("multiple-choice-editor-modal") ||
            e.target.className.includes("modal-overlay")
          ) {
            setIsEditModalOpen(false);
            setActiveColorPickerIndex(null);
            setEditingGlobalSetId(null);
            setCurrentQuestionData({
              pageId: null,
              sectionId: null,
              questionId: null,
              questionText: "",
            });
          }
        }}
      >
        <div
          className="modal-content"
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "25px 30px",
            width: "550px",
            maxWidth: "90%",
            maxHeight: "90vh",
            boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1100,
            position: "relative",
          }}
        >
          {/* Modal Header - Updated with dynamic title */}
          <div
            className="modal-header"
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: "20px",
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: "15px",
            }}
          >
            <h2
              style={{
                fontSize: "1.4rem",
                fontWeight: "600",
                color: "#2d3748",
                margin: 0,
                flexBasis: "100%",
              }}
            >
              {editingGlobalSetId
                ? "Edit Global Response Set"
                : "Multiple choice responses"}
              {editingGlobalSetId && (
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: "#6b7280",
                    marginLeft: "10px",
                  }}
                >
                  (Editing:{" "}
                  {
                    globalResponseSets.find((s) => s.id === editingGlobalSetId)
                      ?.name
                  }
                  )
                </span>
              )}
            </h2>

            <span
              className="example-text"
              id="editorExampleText"
              style={{
                fontSize: "0.9rem",
                color: "#718096",
                marginTop: "5px",
                flexGrow: 1,
              }}
            >
              {currentQuestionData.questionText
                ? `For: "${currentQuestionData.questionText.substring(0, 30)}${
                    currentQuestionData.questionText.length > 30 ? "..." : ""
                  }"`
                : editingGlobalSetId
                ? "Edit this global response set"
                : "e.g. New Option Set"}
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              {!editingGlobalSetId && (
                <button
                  onClick={() => setShowSaveAsGlobalModal(true)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "transparent",
                    color: "#6d28d9",
                    border: "1px solid #6d28d9",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <FaGlobe /> Save as Global
                </button>
              )}

              <label
                className="scoring-checkbox-label"
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  color: "#4a5568",
                  fontWeight: "500",
                }}
              >
                <input
                  type="checkbox"
                  id="editorScoringCheckbox"
                  checked={isScoringEnabled}
                  onChange={(e) => setIsScoringEnabled(e.target.checked)}
                  style={{ display: "none" }}
                />
                <span
                  className="custom-checkbox-editor"
                  style={{
                    width: "18px",
                    height: "18px",
                    border: "2px solid #a0aec0",
                    borderRadius: "4px",
                    marginRight: "8px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isScoringEnabled
                      ? "#6d28d9"
                      : "transparent",
                    position: "relative",
                    transition: "background-color 0.2s, border-color 0.2s",
                  }}
                >
                  {isScoringEnabled && (
                    <span style={{ fontSize: "12px", color: "white" }}>✔</span>
                  )}
                </span>
                Scoring
              </label>
            </div>
          </div>

          {/* Modal Body - Keep your existing structure */}
          <div
            className="modal-body"
            style={{
              flexGrow: 1,
              overflowY: "auto",
              marginBottom: "20px",
              position: "relative",
            }}
          >
            <div
              className="response-list-header"
              style={{
                fontSize: "0.75rem",
                color: "#a0aec0",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "10px",
                paddingLeft: "35px",
              }}
            >
              Response
            </div>

            <ul
              className="editor-response-list"
              id="editorResponseListContainer"
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {editingResponses.length === 0 ? (
                <li
                  style={{
                    padding: "20px 0",
                    textAlign: "center",
                    color: "#718096",
                    fontStyle: "italic",
                  }}
                >
                  No responses added yet. Click "Add Response" to get started.
                </li>
              ) : (
                editingResponses.map((response, index) => (
                  <li
                    key={`response-${index}-${response.text}`}
                    className="editor-response-item"
                    style={{
                      display: "flex",
                      padding: "10px 0",
                      borderBottom: "1px solid #edf2f7",
                      cursor: "default",
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Drag Handle */}
                    <div
                      className="drag-handle"
                      style={{
                        fontSize: "1rem",
                        color: "#cbd5e0",
                        cursor: "grab",
                        marginRight: "15px",
                        display: "flex",
                        flexDirection: "column",
                        lineHeight: "0.3",
                        alignSelf: "flex-start",
                        marginTop: "20px",
                        padding: "5px",
                      }}
                    >
                      <span>⋮</span>
                      <span>⋮</span>
                    </div>

                    {/* Response Content */}
                    <div
                      style={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        className="item-main-edit-row"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <div
                          className="response-input-wrapper-editing"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #6d28d9",
                            borderRadius: "6px",
                            padding: "8px 10px",
                            marginBottom: "10px",
                            flexGrow: 1,
                            backgroundColor: "#f9fafb",
                          }}
                        >
                          <input
                            type="text"
                            value={response.text}
                            onChange={(e) => {
                              const newResponses = [...editingResponses];
                              newResponses[index].text = e.target.value;
                              setEditingResponses(newResponses);
                            }}
                            className="response-text-input-editing"
                            style={{
                              flexGrow: 1,
                              border: "none",
                              outline: "none",
                              fontSize: "0.95rem",
                              color: "#2d3748",
                              backgroundColor: "transparent",
                              padding: "4px 0",
                            }}
                            placeholder="Response text"
                          />
                          <div
                            className="color-indicator"
                            onClick={(e) => {
                              e.stopPropagation();
                              const buttonRect =
                                e.currentTarget.getBoundingClientRect();
                              setActiveColorPickerIndex(index);
                              setColorPickerPosition({
                                top: buttonRect.bottom,
                                left: buttonRect.left,
                              });
                            }}
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              backgroundColor: response.colorHex || "#6b7280",
                              cursor: "pointer",
                              marginLeft: "10px",
                              border: "2px solid #fff",
                              boxShadow: "0 0 0 1px #d1d5db",
                              flexShrink: 0,
                            }}
                            title="Change color"
                          >
                            {response.flagged && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "-5px",
                                  right: "-5px",
                                  width: "12px",
                                  height: "12px",
                                  borderRadius: "50%",
                                  backgroundColor: "#ef4444",
                                  border: "2px solid white",
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        className="response-sub-controls"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          paddingLeft: "0",
                          marginTop: "8px",
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      >
                        <label
                          className="sub-control-checkbox-label"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            color: "#4a5568",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={response.flagged || false}
                            onChange={(e) => {
                              const newResponses = [...editingResponses];
                              newResponses[index].flagged = e.target.checked;
                              setEditingResponses(newResponses);
                            }}
                            style={{ display: "none" }}
                          />
                          <span
                            className="custom-sub-checkbox"
                            style={{
                              width: "16px",
                              height: "16px",
                              border: "1.5px solid #a0aec0",
                              borderRadius: "3px",
                              marginRight: "6px",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: response.flagged
                                ? "#6d28d9"
                                : "transparent",
                              position: "relative",
                            }}
                          >
                            {response.flagged && (
                              <span
                                style={{ fontSize: "10px", color: "white" }}
                              >
                                ✔
                              </span>
                            )}
                          </span>
                          Mark as flagged
                        </label>

                        {isScoringEnabled && (
                          <>
                            <span
                              className="sub-control-divider"
                              style={{ color: "#cbd5e0" }}
                            >
                              |
                            </span>
                            <label
                              className="sub-control-score-label"
                              style={{
                                fontSize: "0.85rem",
                                color: "#4a5568",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              Score
                              <input
                                type="number"
                                value={response.score || "0"}
                                onChange={(e) => {
                                  const newResponses = [...editingResponses];
                                  newResponses[index].score = e.target.value;
                                  setEditingResponses(newResponses);
                                }}
                                className="sub-control-score-input"
                                style={{
                                  width: "40px",
                                  padding: "4px 6px",
                                  border: "1px solid #cbd5e0",
                                  borderRadius: "4px",
                                  fontSize: "0.85rem",
                                  marginLeft: "5px",
                                  textAlign: "center",
                                }}
                              />
                            </label>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => {
                        const newResponses = editingResponses.filter(
                          (_, i) => i !== index
                        );
                        setEditingResponses(newResponses);
                        if (activeColorPickerIndex === index) {
                          setActiveColorPickerIndex(null);
                        }
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#dc3545",
                        fontSize: "1.2rem",
                        cursor: "pointer",
                        padding: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "36px",
                        height: "36px",
                        borderRadius: "4px",
                        transition: "all 0.2s",
                        alignSelf: "flex-start",
                        marginLeft: "10px",
                      }}
                      title="Delete this response"
                    >
                      <FaTrashAlt />
                    </button>
                  </li>
                ))
              )}
            </ul>

            {/* Add Response Button */}
            <button
              className="add-response-button"
              id="editorAddResponseBtn"
              onClick={() => {
                setEditingResponses([
                  ...editingResponses,
                  {
                    text: "",
                    class: "",
                    score: "0",
                    flagged: false,
                    colorHex: "#6b7280",
                  },
                ]);
              }}
              style={{
                background: "none",
                border: "none",
                color: "#6d28d9",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                padding: "10px 0",
                marginTop: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span className="plus-icon" style={{ fontSize: "1.1rem" }}>
                +
              </span>
              Add Response
            </button>
          </div>

          {/* Modal Footer - Updated with dynamic buttons */}
          <div
            className="modal-footer"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "20px",
              borderTop: "1px solid #e5e7eb",
              marginTop: "10px",
            }}
          >
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="btn-save-apply"
                id="editorSaveApplyBtn"
                onClick={handleSaveAndApply}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6d28d9",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                {editingGlobalSetId ? "Update Set" : "Save and apply"}
              </button>

              {editingGlobalSetId && (
                <button
                  className="btn-save-as-new"
                  onClick={() => {
                    setEditingGlobalSetId(null);
                    setShowSaveAsGlobalModal(true);
                  }}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "transparent",
                    color: "#6d28d9",
                    border: "1px solid #6d28d9",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Save as New Set
                </button>
              )}
            </div>

            <button
              className="btn-cancel"
              id="editorCancelBtn"
              onClick={() => {
                setIsEditModalOpen(false);
                setActiveColorPickerIndex(null);
                setEditingGlobalSetId(null);
                setCurrentQuestionData({
                  pageId: null,
                  sectionId: null,
                  questionId: null,
                  questionText: "",
                });
              }}
              style={{
                padding: "10px 20px",
                backgroundColor: "transparent",
                color: "#6b7280",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>

          {/* Color Picker Popup - Keep your existing structure */}
          {activeColorPickerIndex !== null && (
            <div
              className="color-picker-popup"
              style={{
                position: "absolute",
                top: `${colorPickerPosition.top}px`,
                left: `${colorPickerPosition.left - 230}px`,
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                padding: "15px",
                zIndex: 1200,
                width: "230px",
              }}
            >
              <div
                className="color-picker-header"
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <div
                  className="color-picker-preview-swatch"
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "4px",
                    border: "1px solid #e5e7eb",
                    marginRight: "10px",
                    backgroundColor:
                      editingResponses[activeColorPickerIndex]?.colorHex ||
                      "#6b7280",
                  }}
                />
                <input
                  type="text"
                  className="color-picker-hex-input"
                  value={
                    editingResponses[activeColorPickerIndex]?.colorHex ||
                    "#6b7280"
                  }
                  onChange={(e) => {
                    const newResponses = [...editingResponses];
                    newResponses[activeColorPickerIndex].colorHex =
                      e.target.value;
                    setEditingResponses(newResponses);
                  }}
                  style={{
                    flexGrow: 1,
                    padding: "6px 8px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "4px",
                    fontSize: "0.85rem",
                    outline: "none",
                  }}
                  maxLength="7"
                />
              </div>

              <div
                className="color-picker-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(6, 1fr)",
                  gap: "8px",
                }}
              >
                {colorPalette.map((color, idx) => (
                  <div
                    key={`color-${idx}-${color.hex}`}
                    className={`color-picker-swatch ${
                      editingResponses[activeColorPickerIndex]?.colorHex ===
                      color.hex
                        ? "selected"
                        : ""
                    }`}
                    title={color.title}
                    onClick={() => {
                      const newResponses = [...editingResponses];
                      newResponses[activeColorPickerIndex].colorHex = color.hex;
                      newResponses[activeColorPickerIndex].class = color.class;
                      setEditingResponses(newResponses);
                    }}
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      border:
                        editingResponses[activeColorPickerIndex]?.colorHex ===
                        color.hex
                          ? "2px solid #6d28d9"
                          : "2px solid transparent",
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: color.hex,
                    }}
                  >
                    {editingResponses[activeColorPickerIndex]?.colorHex ===
                      color.hex && (
                      <FaCheck
                        style={{ color: "#6d28d9", fontSize: "0.8em" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );

  const renderSaveAsGlobalModal = () =>
    showSaveAsGlobalModal && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1300,
        }}
        onClick={(e) => {
          if (e.target.className.includes("modal-overlay")) {
            setShowSaveAsGlobalModal(false);
            setNewGlobalSetName("");
          }
        }}
        className="modal-overlay"
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "25px 30px",
            width: "400px",
            maxWidth: "90%",
            boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
          }}
        >
          <h2
            style={{ margin: "0 0 15px 0", fontSize: "1.2rem", color: "#333" }}
          >
            Save as Global Response Set
          </h2>
          <p
            style={{ margin: "0 0 20px 0", color: "#666", fontSize: "0.9rem" }}
          >
            Give a name to this response set so you can use it across multiple
            templates.
          </p>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#555",
              }}
            >
              Set Name
            </label>
            <input
              type="text"
              value={newGlobalSetName}
              onChange={(e) => setNewGlobalSetName(e.target.value)}
              placeholder="e.g., Compliance Checklist Responses"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                fontSize: "0.95rem",
              }}
            />
          </div>

          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
          >
            <button
              onClick={() => {
                setShowSaveAsGlobalModal(false);
                setNewGlobalSetName("");
              }}
              style={{
                padding: "10px 20px",
                backgroundColor: "transparent",
                color: "#6b7280",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAsGlobalSet}
              style={{
                padding: "10px 20px",
                backgroundColor: "#6d28d9",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Save Set
            </button>
          </div>
        </div>
      </div>
    );
    
  // Handle click outside to close panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        scoringPanelState.isOpen &&
        !event.target.closest(".scoring-panel-popup") &&
        !event.target.closest(".more-options-btn-for-score")
      ) {
        closeScoringPanel();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [scoringPanelState.isOpen]);
  
  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        backgroundColor: "#e0e0e0",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          position: "relative",
          paddingBottom: "50px",
        }}
      >
        {/* Header with Save/Update buttons */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #ced4da",
            borderRadius: "10px",
            marginBottom: "30px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            padding: "15px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#6e42ff",
                margin: 0,
              }}
            >
              Audit Template Editor
            </h1>
            <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "0.9rem" }}>
              {unitId ? `Editing Unit: ${unitId}` : "Creating New Audit Template"}
              <span style={{ marginLeft: "15px", color: "#28a745" }}>
                Last saved: {lastSaved}
              </span>
            </p>
          </div>
          
          <div style={{ display: "flex", gap: "10px" }}>
            {/* <button
              onClick={handleExportData}
              style={{
                padding: "10px 20px",
                backgroundColor: "transparent",
                color: "#6e42ff",
                border: "1px solid #6e42ff",
                borderRadius: "6px",
                fontSize: "0.95rem",
                fontWeight: "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              title="Export template data"
            >
              <FaFileAlt /> Export
            </button> */}
            
            <button
              onClick={handleSaveOrUpdate}
              disabled={saving}
              style={{
                padding: "10px 25px",
                backgroundColor: saving ? "#999" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "0.95rem",
                fontWeight: "500",
                cursor: saving ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                minWidth: "120px",
                justifyContent: "center",
              }}
            >
              {saving ? (
                <>
                  <FaSyncAlt style={{ animation: "spin 1s linear infinite" }} />
                  Saving...
                </>
              ) : unitId ? (
                <>
                  <FaSave /> Update
                </>
              ) : (
                <>
                  <FaSave /> Save Template
                </>
              )}
            </button>
          </div>
        </div>

        {/* Unit Details Form */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #ced4da",
            borderRadius: "10px",
            marginBottom: "30px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              backgroundColor: "#e9ecef",
              padding: "15px 20px",
              borderBottom: "1px solid #ced4da",
              borderTopLeftRadius: "9px",
              borderTopRightRadius: "9px",
            }}
          >
            <h1
              style={{
                fontSize: "1.3rem",
                fontWeight: "700",
                color: "#6e42ff",
                margin: 0,
              }}
            >
              Unit Details
            </h1>
          </div>

          <div style={{ padding: "20px" }}>
            {/* First Row: Company Name & Representative Name */}
            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                marginBottom: "15px",
              }}
            >
              <div style={{ flex: "1 1 calc(50% - 7.5px)", minWidth: "250px" }}>
                <label
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    color: "#555",
                    marginBottom: "6px",
                    display: "block",
                  }}
                >
                  Company Name
                </label>
                <input
                  type="text"
                  value={unitDetails.companyName}
                  onChange={(e) =>
                    setUnitDetails((prev) => ({
                      ...prev,
                      companyName: e.target.value,
                    }))
                  }
                  placeholder="Enter company name"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    fontSize: "0.95rem",
                    backgroundColor: "#ffffff",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ flex: "1 1 calc(50% - 7.5px)", minWidth: "250px" }}>
                <label
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    color: "#555",
                    marginBottom: "6px",
                    display: "block",
                  }}
                >
                  Representative Name
                </label>
                <input
                  type="text"
                  value={unitDetails.representativeName}
                  onChange={(e) =>
                    setUnitDetails((prev) => ({
                      ...prev,
                      representativeName: e.target.value,
                    }))
                  }
                  placeholder="Enter representative's name"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    fontSize: "0.95rem",
                    backgroundColor: "#ffffff",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Complete Address */}
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "500",
                  color: "#555",
                  marginBottom: "6px",
                  display: "block",
                }}
              >
                Complete Address
              </label>
              <textarea
                type="text"
                value={unitDetails.address}
                onChange={(e) =>
                  setUnitDetails((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                placeholder="Enter full address"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  fontSize: "0.95rem",
                  backgroundColor: "#ffffff",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Second Row: Contact Number & Email ID */}
            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                marginBottom: "15px",
              }}
            >
              <div style={{ flex: "1 1 calc(50% - 7.5px)", minWidth: "250px" }}>
                <label
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    color: "#555",
                    marginBottom: "6px",
                    display: "block",
                  }}
                >
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={unitDetails.contactNumber}
                  onChange={(e) =>
                    setUnitDetails((prev) => ({
                      ...prev,
                      contactNumber: e.target.value,
                    }))
                  }
                  placeholder="Enter contact number"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    fontSize: "0.95rem",
                    backgroundColor: "#ffffff",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ flex: "1 1 calc(50% - 7.5px)", minWidth: "250px" }}>
                <label
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    color: "#555",
                    marginBottom: "6px",
                    display: "block",
                  }}
                >
                  Email ID
                </label>
                <input
                  type="email"
                  value={unitDetails.email}
                  onChange={(e) =>
                    setUnitDetails((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="Enter email address"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    fontSize: "0.95rem",
                    backgroundColor: "#ffffff",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Third Row: Scheduled Manday & Audit Scope */}
            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                marginBottom: "15px",
              }}
            >
              <div style={{ flex: "1 1 calc(50% - 7.5px)", minWidth: "250px" }}>
                <label
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    color: "#555",
                    marginBottom: "6px",
                    display: "block",
                  }}
                >
                  Scheduled Manday
                </label>
                <input
                  type="text"
                  placeholder="e.g., 1.5"
                  value={unitDetails.scheduledManday}
                  onChange={(e) =>
                    setUnitDetails((prev) => ({
                      ...prev,
                      scheduledManday: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    fontSize: "0.95rem",
                    backgroundColor: "#ffffff",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ flex: "1 1 calc(50% - 7.5px)", minWidth: "250px" }}>
                <label
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    color: "#555",
                    marginBottom: "6px",
                    display: "block",
                  }}
                >
                  Audit Scope
                </label>
                <input
                  type="text"
                  value={unitDetails.auditScope}
                  onChange={(e) =>
                    setUnitDetails((prev) => ({
                      ...prev,
                      auditScope: e.target.value,
                    }))
                  }
                  placeholder="Define the scope of the audit"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    fontSize: "0.95rem",
                    backgroundColor: "#ffffff",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Fourth Row: Audit Date (From) & Audit Date (To) */}
            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                marginBottom: "15px",
              }}
            >
              <div style={{ flex: "1 1 calc(50% - 7.5px)", minWidth: "250px" }}>
                <label
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    color: "#555",
                    marginBottom: "6px",
                    display: "block",
                  }}
                >
                  Audit Date (From)
                </label>
                <input
                  type="date"
                  value={unitDetails.auditDateFrom}
                  onChange={(e) =>
                    setUnitDetails((prev) => ({
                      ...prev,
                      auditDateFrom: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    fontSize: "0.95rem",
                    backgroundColor: "#ffffff",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ flex: "1 1 calc(50% - 7.5px)", minWidth: "250px" }}>
                <label
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    color: "#555",
                    marginBottom: "6px",
                    display: "block",
                  }}
                >
                  Audit Date (To)
                </label>
                <input
                  type="date"
                  value={unitDetails.auditDateTo}
                  onChange={(e) =>
                    setUnitDetails((prev) => ({
                      ...prev,
                      auditDateTo: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    fontSize: "0.95rem",
                    backgroundColor: "#ffffff",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Fifth Row: Geotag Location & Audit Start Time */}
            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                marginBottom: "15px",
              }}
            >
              <div style={{ flex: "1 1 calc(50% - 7.5px)", minWidth: "250px" }}>
                <label
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    color: "#555",
                    marginBottom: "6px",
                    display: "block",
                  }}
                >
                  Geotag Location
                </label>
                <div style={{ display: "flex" }}>
                  <input
                    type="text"
                    value={unitDetails.coordinates}
                    onChange={(e) =>
                      setUnitDetails((prev) => ({
                        ...prev,
                        coordinates: e.target.value,
                      }))
                    }
                    placeholder="Click 'Get Location' to fetch coordinates"
                    readOnly
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      border: "1px solid #e0e0e0",
                      borderRight: "none",
                      borderTopLeftRadius: "6px",
                      borderBottomLeftRadius: "6px",
                      fontSize: "0.95rem",
                      backgroundColor: "#f8f9fc",
                      color: unitDetails.coordinates ? "#000" : "#dc3545",
                      cursor: "default",
                      boxSizing: "border-box",
                      minWidth: "0",
                    }}
                  />
                  <button
                    onClick={() => {
                      setGeotagLoading(true);
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            const lat = position.coords.latitude.toFixed(6);
                            const lon = position.coords.longitude.toFixed(6);
                            const coords = `${lat}, ${lon}`;
                            setUnitDetails((prev) => ({
                              ...prev,
                              coordinates: coords,
                            }));
                            setGeotagLoading(false);
                            debouncedSave(); // Trigger autosave
                          },
                          (error) => {
                            let errorMessage = "Error: ";
                            switch (error.code) {
                              case error.PERMISSION_DENIED:
                                errorMessage += "User denied Geolocation";
                                break;
                              case error.POSITION_UNAVAILABLE:
                                errorMessage +=
                                  "Location information unavailable";
                                break;
                              case error.TIMEOUT:
                                errorMessage += "Location request timed out";
                                break;
                              default:
                                errorMessage += "Unknown error";
                            }
                            setUnitDetails((prev) => ({
                              ...prev,
                              coordinates: errorMessage,
                            }));
                            setGeotagLoading(false);
                          }
                        );
                      } else {
                        setUnitDetails((prev) => ({
                          ...prev,
                          coordinates:
                            "Geolocation is not supported by this browser.",
                        }));
                        setGeotagLoading(false);
                      }
                    }}
                    disabled={geotagLoading}
                    style={{
                      padding: "10px 15px",
                      border: "1px solid #e0e0e0",
                      borderLeft: "none",
                      backgroundColor: geotagLoading ? "#999" : "#6e42ff",
                      color: "white",
                      borderTopRightRadius: "6px",
                      borderBottomRightRadius: "6px",
                      fontWeight: "500",
                      whiteSpace: "nowrap",
                      cursor: geotagLoading ? "not-allowed" : "pointer",
                      fontSize: "0.9rem",
                      minWidth: "120px",
                      transition: "background-color 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                    }}
                  >
                    {geotagLoading ? (
                      <>
                        <FaSyncAlt
                          style={{ animation: "spin 1s linear infinite" }}
                        />
                        Fetching...
                      </>
                    ) : (
                      "Get Location"
                    )}
                  </button>
                </div>
              </div>
              <div style={{ flex: "1 1 calc(50% - 7.5px)", minWidth: "250px" }}>
                <label
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    color: "#555",
                    marginBottom: "6px",
                    display: "block",
                  }}
                >
                  Audit Start Time
                </label>
                <div style={{ display: "flex" }}>
                  <input
                    type="text"
                    value={
                      auditStarted ? auditStartTime : "Click 'Start Audit'"
                    }
                    onChange={(e) => setAuditStartTime(e.target.value)}
                    readOnly
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      border: "1px solid #e0e0e0",
                      borderRight: "none",
                      borderTopLeftRadius: "6px",
                      borderBottomLeftRadius: "6px",
                      fontSize: "0.95rem",
                      backgroundColor: "#f8f9fc",
                      cursor: "default",
                      color: auditStarted ? "#000" : "#6c757d",
                      fontStyle: auditStarted ? "normal" : "italic",
                      boxSizing: "border-box",
                      minWidth: "0",
                    }}
                  />
                  <button
                    onClick={() => {
                      const now = new Date();
                      const timeString = now.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      });
                      const dateString = now.toLocaleDateString();
                      const formattedDateTime = `${dateString} ${timeString}`;

                      setAuditStartTime(formattedDateTime);
                      setAuditStarted(true);
                      debouncedSave(); // Trigger autosave
                    }}
                    disabled={auditStarted}
                    style={{
                      padding: "10px 15px",
                      border: "1px solid #e0e0e0",
                      borderLeft: "none",
                      backgroundColor: auditStarted ? "#28a745" : "#6e42ff",
                      color: "white",
                      borderTopRightRadius: "6px",
                      borderBottomRightRadius: "6px",
                      fontWeight: "500",
                      whiteSpace: "nowrap",
                      cursor: auditStarted ? "not-allowed" : "pointer",
                      minWidth: "120px",
                      transition: "background-color 0.3s ease",
                      fontSize: "0.9rem",
                    }}
                  >
                    {auditStarted ? "Started" : "Start Audit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Pages */}
        {pages.map((page) => (
          <div
            key={page.id}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #ced4da",
              borderRadius: "10px",
              marginBottom: "30px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                backgroundColor: "#e9ecef",
                padding: "15px 25px",
                borderBottom: "1px solid #ced4da",
                borderTopLeftRadius: "9px",
                borderTopRightRadius: "9px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <input
                type="text"
                value={page.title}
                onChange={(e) => {
                  setPages((prev) =>
                    prev.map((p) =>
                      p.id === page.id ? { ...p, title: e.target.value } : p
                    )
                  );
                }}
                style={{
                  flexGrow: 1,
                  border: "none",
                  background: "transparent",
                  fontSize: "1.3rem",
                  fontWeight: "700",
                  color: "#6e42ff",
                  padding: "8px",
                }}
              />
            </div>

            <div style={{ padding: "20px 25px 10px 25px" }}>
              {/* Sections */}
              {page.sections.map((section) => (
                <div
                  key={section.id}
                  style={{
                    backgroundColor: "#ffffff",
                    border:
                      activeSectionId === section.id
                        ? "2px solid #6e42ff"
                        : "1px solid #e0e0e0",
                    borderRadius: "8px",
                    marginBottom: "25px",
                    boxShadow: "0 3px 6px rgba(0,0,0,0.07)",
                    position: "relative",
                  }}
                >
                  {/* Section Header */}
                  <div
                    onClick={() => setActiveSectionId(section.id)}
                    style={{
                      backgroundColor: "#f0f2f5",
                      padding: "12px 20px",
                      borderBottom: "1px solid #e0e0e0",
                      borderTopLeftRadius: "7px",
                      borderTopRightRadius: "7px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSection(page.id, section.id);
                      }}
                      style={{
                        fontSize: "0.9em",
                        color: "#6e42ff",
                        padding: "5px",
                        cursor: "pointer",
                        transform: section.collapsed
                          ? "rotate(-90deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    >
                      ▼
                    </span>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) =>
                        updateSection(page.id, section.id, {
                          title: e.target.value,
                        })
                      }
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        flexGrow: 1,
                        border: "none",
                        background: "transparent",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: "#6e42ff",
                        padding: "5px",
                        minWidth: "150px",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#555",
                        backgroundColor: "#ffffff",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      {section.questions.length} question
                      {section.questions.length !== 1 ? "s" : ""}
                    </span>

                    {/* Section Applicability */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "0.85rem",
                        color: "#555",
                        marginLeft: "10px",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <label
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="radio"
                          checked={section.applicable === "Applicable"}
                          onChange={() =>
                            updateSection(page.id, section.id, {
                              applicable: "Applicable",
                            })
                          }
                          style={{ marginRight: "4px" }}
                        />
                        Applicable
                      </label>
                      <label
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="radio"
                          checked={section.applicable === "NotApplicable"}
                          onChange={() =>
                            updateSection(page.id, section.id, {
                              applicable: "NotApplicable",
                            })
                          }
                          style={{ marginRight: "4px" }}
                        />
                        Not Applicable
                      </label>
                    </div>

                    {/* Section Risk */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "0.85rem",
                        color: "#555",
                        marginLeft: "10px",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <label
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="radio"
                          checked={section.risk === "Low"}
                          onChange={() =>
                            updateSection(page.id, section.id, { risk: "Low" })
                          }
                          style={{ marginRight: "4px" }}
                        />
                        Low
                      </label>
                      <label
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="radio"
                          checked={section.risk === "Medium"}
                          onChange={() =>
                            updateSection(page.id, section.id, {
                              risk: "Medium",
                            })
                          }
                          style={{ marginRight: "4px" }}
                        />
                        Med
                      </label>
                      <label
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="radio"
                          checked={section.risk === "High"}
                          onChange={() =>
                            updateSection(page.id, section.id, { risk: "High" })
                          }
                          style={{ marginRight: "4px" }}
                        />
                        High
                      </label>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        marginLeft: "auto",
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newSection = {
                            ...section,
                            id: Date.now(),
                            title: section.title + " (Copy)",
                          };
                          setPages((prev) =>
                            prev.map((p) => {
                              if (p.id === page.id) {
                                return {
                                  ...p,
                                  sections: [...p.sections, newSection],
                                };
                              }
                              return p;
                            })
                          );
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          fontSize: "1.1rem",
                          cursor: "pointer",
                          padding: "5px",
                          color: "#6e42ff",
                        }}
                        title="Duplicate section"
                      >
                        <FaCopy />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSection(page.id, section.id);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          fontSize: "1.1rem",
                          cursor: "pointer",
                          padding: "5px",
                          color: "#dc3545",
                        }}
                        title="Delete section"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>

                  {/* Questions */}
                  {!section.collapsed && (
                    <div style={{ padding: "0px 20px 5px 20px" }}>
                      {section.questions.map((question) => (
                        <div
                          key={question.id}
                          onClick={() => setActiveQuestionId(question.id)}
                          style={{
                            backgroundColor:
                              activeQuestionId === question.id
                                ? "#e9ecef"
                                : "#f8f9fc",
                            border:
                              activeQuestionId === question.id
                                ? "2px solid #6e42ff"
                                : "1px solid transparent",
                            borderTop: "1px dashed #e2e8f0",
                            position: "relative",
                            paddingRight: "35px",
                            cursor: "default",
                            transition: "background-color 0.2s, border 0.2s",
                          }}
                        >
                          {/* Question Top Section */}
                          <div
                            style={{
                              padding: "15px 0 10px 0",
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "10px",
                            }}
                          >
                            {/* Question Input */}
                            <div style={{ flexGrow: 1 }}>
                              <label
                                style={{
                                  display: "block",
                                  fontSize: "0.8rem",
                                  fontWeight: "500",
                                  color: "#555",
                                  marginBottom: "6px",
                                }}
                              >
                                Question
                              </label>
                              <div
                                style={{
                                  position: "relative",
                                  display: "flex",
                                  alignItems: "center",
                                  border: "2px solid #6e42ff",
                                  backgroundColor: "#f0eefe",
                                  borderRadius: "6px",
                                }}
                              >
                                <div
                                  style={{
                                    width: "10px",
                                    height: "10px",
                                    backgroundColor: "#6e42ff",
                                    borderRadius: "50%",
                                    position: "absolute",
                                    left: "-5px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "grab",
                                  }}
                                />
                                <input
                                  type="text"
                                  value={question.text}
                                  onChange={(e) =>
                                    updateQuestion(
                                      page.id,
                                      section.id,
                                      question.id,
                                      { text: e.target.value }
                                    )
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    width: "100%",
                                    padding: "10px 12px",
                                    border: "none",
                                    backgroundColor: "transparent",
                                    fontSize: "1rem",
                                    color: "#333",
                                    outline: "none",
                                  }}
                                />
                                <div
                                  style={{
                                    width: "10px",
                                    height: "10px",
                                    backgroundColor: "#6e42ff",
                                    borderRadius: "50%",
                                    position: "absolute",
                                    right: "-5px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "grab",
                                  }}
                                />
                              </div>
                            </div>

                            {/* Response Type */}
                            {/* Response Type */}
                            <div
                              style={{
                                minWidth: "220px",
                                position: "relative",
                              }}
                            >
                              <label
                                style={{
                                  display: "block",
                                  fontSize: "0.8rem",
                                  fontWeight: "500",
                                  color: "#555",
                                  marginBottom: "6px",
                                }}
                              >
                                Type of response
                              </label>

                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  backgroundColor: "#f0eefe",
                                  borderRadius: "6px",
                                  padding: "4px",
                                  minHeight: "34px",
                                  position: "relative",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "5px",
                                    flexWrap: "nowrap",
                                    overflow: "hidden",
                                    alignItems: "center",
                                    flex: 1,
                                  }}
                                  id="selectedResponseOptions"
                                >
                                  {question.responses.map((resp, idx) => (
                                    <button
                                      key={idx}
                                      className={`response-btn ${
                                        resp.pillClass || "na"
                                      }`}
                                      style={{
                                        padding: "6px 12px",
                                        border: "none",
                                        borderRadius: "4px",
                                        fontSize: "0.85rem",
                                        fontWeight: "500",
                                        cursor: "default",
                                        whiteSpace: "nowrap",
                                        backgroundColor:
                                          resp.pillClass === "yes"
                                            ? "#e6f4ea"
                                            : resp.pillClass === "no"
                                            ? "#fdecea"
                                            : resp.pillClass === "good"
                                            ? "#e6f4ea"
                                            : resp.pillClass === "fair"
                                            ? "#fef3c7"
                                            : resp.pillClass === "poor"
                                            ? "#fdecea"
                                            : resp.pillClass === "custom-single"
                                            ? "#f0eefe"
                                            : "#f0f0f0",
                                        color:
                                          resp.pillClass === "yes"
                                            ? "#006400"
                                            : resp.pillClass === "no"
                                            ? "#a00000"
                                            : resp.pillClass === "good"
                                            ? "#006400"
                                            : resp.pillClass === "fair"
                                            ? "#92400e"
                                            : resp.pillClass === "poor"
                                            ? "#a00000"
                                            : resp.pillClass === "custom-single"
                                            ? "#6e42ff"
                                            : "#666666",
                                        border:
                                          resp.pillClass === "custom-single"
                                            ? "1px solid #6e42ff"
                                            : "none",
                                      }}
                                      data-score={resp.score}
                                      data-flagged={String(resp.flagged)}
                                      data-color-hex={resp.colorHex}
                                      data-pill-class={resp.pillClass}
                                    >
                                      {resp.text}
                                    </button>
                                  ))}
                                </div>
                                <span
                                  style={{
                                    fontSize: "0.9rem",
                                    color: "#555",
                                    marginLeft: "auto",
                                    padding: "5px 8px",
                                    cursor: "pointer",
                                    userSelect: "none",
                                    flexShrink: 0,
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDropdownId(
                                      activeDropdownId === question.id
                                        ? null
                                        : question.id
                                    );
                                  }}
                                >
                                  {activeDropdownId === question.id ? "▲" : "▼"}
                                </span>
                              </div>

                              {/* Dropdown Panel */}
                              {activeDropdownId === question.id && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "100%",
                                    left: 0,
                                    right: 0,
                                    zIndex: 1000,
                                    backgroundColor: "#f0f2f5",
                                    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                    width: "100%",
                                    minWidth: "520px",
                                    maxWidth: "800px",
                                    marginTop: "5px",
                                  }}
                                  id="responseTypeDropdownPanel"
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "20px",
                                      padding: "20px",
                                    }}
                                  >
                                    {/* Left Card - Multiple Choice */}
                                    {renderResponseSetsSection(
                                      question,
                                      page.id,
                                      section.id
                                    )}
                                    {/* Right Card - Single Response Types */}
                                    <div
                                      style={{
                                        backgroundColor: "#fff",
                                        borderRadius: "8px",
                                        boxShadow:
                                          "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        padding: "20px",
                                        flex: 1,
                                        minHeight: "400px",
                                      }}
                                    >
                                      <ul
                                        style={{
                                          listStyle: "none",
                                          padding: 0,
                                          margin: 0,
                                        }}
                                      >
                                        {/* Text answer */}
                                        <li
                                          data-response-type="single"
                                          data-response-name="Text answer"
                                          onClick={() => {
                                            updateQuestion(
                                              page.id,
                                              section.id,
                                              question.id,
                                              {
                                                responses: [
                                                  {
                                                    text: "Text answer",
                                                    class: "custom-single",
                                                    score: "/",
                                                    flagged: false,
                                                    colorHex: "#6e42ff",
                                                  },
                                                ],
                                              }
                                            );
                                            setActiveDropdownId(null);
                                          }}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "10px 0",
                                            fontSize: "14px",
                                            color: "#374151",
                                            cursor: "pointer",
                                          }}
                                        >
                                          <span
                                            className="icon-wrapper icon-text"
                                            style={{
                                              width: "28px",
                                              height: "28px",
                                              borderRadius: "50%",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              marginRight: "12px",
                                              fontSize: "12px",
                                              fontWeight: "bold",
                                              backgroundColor: "#ffedd5",
                                              color: "#c2410c",
                                              flexShrink: 0,
                                            }}
                                          >
                                            Aa
                                          </span>
                                          <span
                                            className="item-text"
                                            style={{ flex: 1 }}
                                          >
                                            Text answer
                                          </span>
                                        </li>

                                        {/* Number */}
                                        <li
                                          data-response-type="single"
                                          data-response-name="Number"
                                          onClick={() => {
                                            updateQuestion(
                                              page.id,
                                              section.id,
                                              question.id,
                                              {
                                                responses: [
                                                  {
                                                    text: "Number",
                                                    class: "custom-single",
                                                    score: "/",
                                                    flagged: false,
                                                    colorHex: "#6e42ff",
                                                  },
                                                ],
                                              }
                                            );
                                            setActiveDropdownId(null);
                                          }}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "10px 0",
                                            fontSize: "14px",
                                            color: "#374151",
                                            cursor: "pointer",
                                          }}
                                        >
                                          <span
                                            className="icon-wrapper icon-number"
                                            style={{
                                              width: "28px",
                                              height: "28px",
                                              borderRadius: "50%",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              marginRight: "12px",
                                              fontSize: "12px",
                                              fontWeight: "bold",
                                              backgroundColor: "#fef9c3",
                                              color: "#a16207",
                                              flexShrink: 0,
                                            }}
                                          >
                                            123
                                          </span>
                                          <span
                                            className="item-text"
                                            style={{ flex: 1 }}
                                          >
                                            Number
                                          </span>
                                        </li>

                                        {/* Checkbox */}
                                        <li
                                          data-response-type="single"
                                          data-response-name="Checkbox"
                                          onClick={() => {
                                            updateQuestion(
                                              page.id,
                                              section.id,
                                              question.id,
                                              {
                                                responses: [
                                                  {
                                                    text: "Checkbox",
                                                    class: "custom-single",
                                                    score: "/",
                                                    flagged: false,
                                                    colorHex: "#6e42ff",
                                                  },
                                                ],
                                              }
                                            );
                                            setActiveDropdownId(null);
                                          }}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "10px 0",
                                            fontSize: "14px",
                                            color: "#374151",
                                            cursor: "pointer",
                                          }}
                                        >
                                          <span
                                            className="icon-wrapper icon-checkbox"
                                            style={{
                                              width: "28px",
                                              height: "28px",
                                              borderRadius: "50%",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              marginRight: "12px",
                                              fontSize: "12px",
                                              fontWeight: "bold",
                                              backgroundColor: "#dbeafe",
                                              color: "#1d4ed8",
                                              flexShrink: 0,
                                            }}
                                          >
                                            <i
                                              className="fas fa-check-square"
                                              style={{ color: "#1d4ed8" }}
                                            ></i>
                                          </span>
                                          <span
                                            className="item-text"
                                            style={{ flex: 1 }}
                                          >
                                            Checkbox
                                          </span>
                                        </li>

                                        <hr
                                          style={{
                                            border: "none",
                                            borderTop: "1px solid #e5e7eb",
                                            margin: "10px 0",
                                          }}
                                        />

                                        {/* Date & Time */}
                                        <li
                                          data-response-type="single"
                                          data-response-name="Date & Time"
                                          onClick={() => {
                                            updateQuestion(
                                              page.id,
                                              section.id,
                                              question.id,
                                              {
                                                responses: [
                                                  {
                                                    text: "Date & Time",
                                                    class: "custom-single",
                                                    score: "/",
                                                    flagged: false,
                                                    colorHex: "#6e42ff",
                                                  },
                                                ],
                                              }
                                            );
                                            setActiveDropdownId(null);
                                          }}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "10px 0",
                                            fontSize: "14px",
                                            color: "#374151",
                                            cursor: "pointer",
                                          }}
                                        >
                                          <span
                                            className="icon-wrapper icon-date"
                                            style={{
                                              width: "28px",
                                              height: "28px",
                                              borderRadius: "50%",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              marginRight: "12px",
                                              fontSize: "12px",
                                              fontWeight: "bold",
                                              backgroundColor: "#dcfce7",
                                              color: "#15803d",
                                              flexShrink: 0,
                                            }}
                                          >
                                            <i
                                              className="far fa-calendar-alt"
                                              style={{ color: "#15803d" }}
                                            ></i>
                                          </span>
                                          <span
                                            className="item-text"
                                            style={{ flex: 1 }}
                                          >
                                            Date & Time
                                          </span>
                                        </li>

                                        {/* Media */}
                                        <li
                                          data-response-type="single"
                                          data-response-name="Media"
                                          onClick={() => {
                                            updateQuestion(
                                              page.id,
                                              section.id,
                                              question.id,
                                              {
                                                responses: [
                                                  {
                                                    text: "Media",
                                                    class: "custom-single",
                                                    score: "/",
                                                    flagged: false,
                                                    colorHex: "#6e42ff",
                                                  },
                                                ],
                                              }
                                            );
                                            setActiveDropdownId(null);
                                          }}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "10px 0",
                                            fontSize: "14px",
                                            color: "#374151",
                                            cursor: "pointer",
                                          }}
                                        >
                                          <span
                                            className="icon-wrapper icon-media"
                                            style={{
                                              width: "28px",
                                              height: "28px",
                                              borderRadius: "50%",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              marginRight: "12px",
                                              fontSize: "12px",
                                              fontWeight: "bold",
                                              backgroundColor: "#ccfbf1",
                                              color: "#0d9488",
                                              flexShrink: 0,
                                            }}
                                          >
                                            <i
                                              className="fas fa-camera"
                                              style={{ color: "#0d9488" }}
                                            ></i>
                                          </span>
                                          <span
                                            className="item-text"
                                            style={{ flex: 1 }}
                                          >
                                            Media
                                          </span>
                                        </li>

                                        {/* Slider */}
                                        <li
                                          data-response-type="single"
                                          data-response-name="Slider"
                                          onClick={() => {
                                            updateQuestion(
                                              page.id,
                                              section.id,
                                              question.id,
                                              {
                                                responses: [
                                                  {
                                                    text: "Slider",
                                                    class: "custom-single",
                                                    score: "/",
                                                    flagged: false,
                                                    colorHex: "#6e42ff",
                                                  },
                                                ],
                                              }
                                            );
                                            setActiveDropdownId(null);
                                          }}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "10px 0",
                                            fontSize: "14px",
                                            color: "#374151",
                                            cursor: "pointer",
                                          }}
                                        >
                                          <span
                                            className="icon-wrapper icon-slider"
                                            style={{
                                              width: "28px",
                                              height: "28px",
                                              borderRadius: "50%",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              marginRight: "12px",
                                              fontSize: "12px",
                                              fontWeight: "bold",
                                              backgroundColor: "#e0f2fe",
                                              color: "#0284c7",
                                              flexShrink: 0,
                                            }}
                                          >
                                            <i
                                              className="fas fa-sliders-h"
                                              style={{ color: "#0284c7" }}
                                            ></i>
                                          </span>
                                          <span
                                            className="item-text"
                                            style={{ flex: 1 }}
                                          >
                                            Slider
                                          </span>
                                        </li>

                                        <hr
                                          style={{
                                            border: "none",
                                            borderTop: "1px solid #e5e7eb",
                                            margin: "10px 0",
                                          }}
                                        />

                                        {/* Annotation */}
                                        <li
                                          data-response-type="single"
                                          data-response-name="Annotation"
                                          onClick={() => {
                                            updateQuestion(
                                              page.id,
                                              section.id,
                                              question.id,
                                              {
                                                responses: [
                                                  {
                                                    text: "Annotation",
                                                    class: "custom-single",
                                                    score: "/",
                                                    flagged: false,
                                                    colorHex: "#6e42ff",
                                                  },
                                                ],
                                              }
                                            );
                                            setActiveDropdownId(null);
                                          }}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "10px 0",
                                            fontSize: "14px",
                                            color: "#374151",
                                            cursor: "pointer",
                                          }}
                                        >
                                          <span
                                            className="icon-wrapper icon-annotation"
                                            style={{
                                              width: "28px",
                                              height: "28px",
                                              borderRadius: "50%",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              marginRight: "12px",
                                              fontSize: "12px",
                                              fontWeight: "bold",
                                              backgroundColor: "#fef9c3",
                                              color: "#a16207",
                                              flexShrink: 0,
                                            }}
                                          >
                                            <i
                                              className="fas fa-signature"
                                              style={{ color: "#a16207" }}
                                            ></i>
                                          </span>
                                          <span
                                            className="item-text"
                                            style={{ flex: 1 }}
                                          >
                                            Annotation
                                          </span>
                                        </li>

                                        {/* Signature */}
                                        <li
                                          data-response-type="single"
                                          data-response-name="Signature"
                                          onClick={() => {
                                            updateQuestion(
                                              page.id,
                                              section.id,
                                              question.id,
                                              {
                                                responses: [
                                                  {
                                                    text: "Signature",
                                                    class: "custom-single",
                                                    score: "/",
                                                    flagged: false,
                                                    colorHex: "#6e42ff",
                                                  },
                                                ],
                                              }
                                            );
                                            setActiveDropdownId(null);
                                          }}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "10px 0",
                                            fontSize: "14px",
                                            color: "#374151",
                                            cursor: "pointer",
                                          }}
                                        >
                                          <span
                                            className="icon-wrapper icon-signature"
                                            style={{
                                              width: "28px",
                                              height: "28px",
                                              borderRadius: "50%",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              marginRight: "12px",
                                              fontSize: "12px",
                                              fontWeight: "bold",
                                              backgroundColor: "#e0e7ff",
                                              color: "#4338ca",
                                              flexShrink: 0,
                                            }}
                                          >
                                            <i
                                              className="fas fa-file-signature"
                                              style={{ color: "#4338ca" }}
                                            ></i>
                                          </span>
                                          <span
                                            className="item-text"
                                            style={{ flex: 1 }}
                                          >
                                            Signature
                                          </span>
                                        </li>

                                        {/* Location */}
                                        <li
                                          data-response-type="single"
                                          data-response-name="Location"
                                          onClick={() => {
                                            updateQuestion(
                                              page.id,
                                              section.id,
                                              question.id,
                                              {
                                                responses: [
                                                  {
                                                    text: "Location",
                                                    class: "custom-single",
                                                    score: "/",
                                                    flagged: false,
                                                    colorHex: "#6e42ff",
                                                  },
                                                ],
                                              }
                                            );
                                            setActiveDropdownId(null);
                                          }}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "10px 0",
                                            fontSize: "14px",
                                            color: "#374151",
                                            cursor: "pointer",
                                          }}
                                        >
                                          <span
                                            className="icon-wrapper icon-location"
                                            style={{
                                              width: "28px",
                                              height: "28px",
                                              borderRadius: "50%",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              marginRight: "12px",
                                              fontSize: "12px",
                                              fontWeight: "bold",
                                              backgroundColor: "#ffedd5",
                                              color: "#c2410c",
                                              flexShrink: 0,
                                            }}
                                          >
                                            <i
                                              className="fas fa-map-marker-alt"
                                              style={{ color: "#c2410c" }}
                                            ></i>
                                          </span>
                                          <span
                                            className="item-text"
                                            style={{ flex: 1 }}
                                          >
                                            Location
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            {/* {!showMaxScoreWidget && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowMaxScoreWidget(!showMaxScoreWidget);
                                }}
                                style={{
                                  background: "none",
                                  border: "none",
                                  fontSize: "1.2rem",
                                  color: "#6e42ff",
                                  cursor: "pointer",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "24px",
                                  height: "24px",
                                  marginBottom: "6px",
                                  boxShadow: "0 0 0 1px #6e42ff",
                                }}
                                title="Add max score"
                              >
                                +
                              </button>
                            )}

                            {showMaxScoreWidget && (
                              <>
                                <div
                                  className="max-score-widget"
                                  style={{
                                    backgroundColor: "#f8f9fc",
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "6px",
                                    padding: "12px",
                                    marginBottom: "10px",
                                    position: "relative",
                                  }}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowMaxScoreWidget(false);
                                    }}
                                    style={{
                                      background: "none",
                                      border: "none",
                                      fontSize: "1rem",
                                      color: "#999",
                                      cursor: "pointer",
                                      padding: "2px",
                                      position: "absolute",
                                      right: "6px",
                                      color: "red",
                                    }}
                                    title="Remove max score"
                                  >
                                    ×
                                  </button>

                                  <label
                                    className="field-label"
                                    htmlFor={`q${question.id}-topMaxScoreInput`}
                                    style={{
                                      fontSize: "0.8rem",
                                      fontWeight: "500",
                                      color: "#555",
                                      marginBottom: "6px",
                                      display: "block",
                                    }}
                                  >
                                    Max score
                                  </label>

                                  <div
                                    className="max-score-input-group"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <input
                                      type="text"
                                      id={`q${question.id}-topMaxScoreInput`}
                                      value={question.maxScore || 0}
                                      onChange={(e) => {
                                        // Only allow numbers
                                        const value = e.target.value;

                                        // Check if value is empty or contains only numbers
                                        if (
                                          value === "" ||
                                          /^\d+$/.test(value)
                                        ) {
                                          updateQuestion(
                                            page.id,
                                            section.id,
                                            question.id,
                                            {
                                              maxScore:
                                                value === ""
                                                  ? 0
                                                  : parseInt(value),
                                            }
                                          );
                                        }
                                        // If not a valid number, don't update
                                      }}
                                      onBlur={(e) => {
                                        // On blur, ensure we have a valid number (strip leading zeros, etc.)
                                        const value = e.target.value;

                                        if (value === "") {
                                          updateQuestion(
                                            page.id,
                                            section.id,
                                            question.id,
                                            { maxScore: 0 }
                                          );
                                        } else if (/^\d+$/.test(value)) {
                                          // Remove leading zeros and convert
                                          const numericValue = parseInt(
                                            value,
                                            10
                                          );
                                          updateQuestion(
                                            page.id,
                                            section.id,
                                            question.id,
                                            { maxScore: numericValue }
                                          );
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        // Allow: backspace, delete, tab, escape, enter
                                        if (
                                          [46, 8, 9, 27, 13].includes(
                                            e.keyCode
                                          ) ||
                                          // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                                          (e.keyCode === 65 &&
                                            e.ctrlKey === true) ||
                                          (e.keyCode === 67 &&
                                            e.ctrlKey === true) ||
                                          (e.keyCode === 86 &&
                                            e.ctrlKey === true) ||
                                          (e.keyCode === 88 &&
                                            e.ctrlKey === true) ||
                                          // Allow: home, end, left, right
                                          (e.keyCode >= 35 && e.keyCode <= 39)
                                        ) {
                                          return;
                                        }

                                        // Ensure that it's a number and stop the keypress if not
                                        if (
                                          (e.keyCode < 48 || e.keyCode > 57) &&
                                          (e.keyCode < 96 || e.keyCode > 105)
                                        ) {
                                          e.preventDefault();
                                        }
                                      }}
                                      style={{
                                        flex: 1,
                                        padding: "8px 12px",
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "4px",
                                        fontSize: "0.9rem",
                                      }}
                                    />
                                    <button
                                      className="more-options-btn-for-score"
                                      id={`q${question.id}-moreOptionsBtnForScore`}
                                      aria-label="More score options"
                                      onClick={(e) =>
                                        openScoringPanel(
                                          e,
                                          page.id,
                                          section.id,
                                          question.id,
                                          question.maxScore
                                        )
                                      }
                                      style={{
                                        background: "none",
                                        border: "1px solid #e0e0e0",
                                        color: "#666",
                                        fontSize: "1.2rem",
                                        cursor: "pointer",
                                        padding: "6px 10px",
                                        borderRadius: "4px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      ⋮
                                    </button>
                                  </div>
                                </div>
                              </>
                            )} */}

                            {!showMaxScoreWidget && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowMaxScoreWidget(!showMaxScoreWidget);
                                }}
                                style={{
                                  background: "none",
                                  border: "none",
                                  fontSize: "1.2rem",
                                  color: "#6e42ff",
                                  cursor: "pointer",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "24px",
                                  height: "24px",
                                  marginBottom: "6px",
                                  boxShadow: "0 0 0 1px #6e42ff",
                                }}
                                title="Add max score"
                              >
                                +
                              </button>
                            )}

                            {showMaxScoreWidget && (
                              <>
                                <div
                                  className="max-score-widget"
                                  style={{
                                    backgroundColor: "#f8f9fc",
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "6px",
                                    padding: "12px",
                                    marginBottom: "10px",
                                    position: "relative",
                                  }}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowMaxScoreWidget(false);
                                    }}
                                    style={{
                                      background: "none",
                                      border: "none",
                                      fontSize: "1rem",
                                      cursor: "pointer",
                                      padding: "2px",
                                      position: "absolute",
                                      right: "6px",
                                      top: "6px",
                                      color: "red",
                                      zIndex: "10",
                                    }}
                                    title="Remove max score"
                                  >
                                    ×
                                  </button>

                                  <label
                                    className="field-label"
                                    htmlFor={`q${question.id}-topMaxScoreInput`}
                                    style={{
                                      fontSize: "0.8rem",
                                      fontWeight: "500",
                                      color: "#555",
                                      marginBottom: "6px",
                                      display: "block",
                                    }}
                                  >
                                    Max score
                                  </label>

                                  <div
                                    className="max-score-input-group"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <input
                                      type="text"
                                      id={`q${question.id}-topMaxScoreInput`}
                                      value={question.maxScore || 0}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        if (
                                          value === "" ||
                                          /^\d+$/.test(value)
                                        ) {
                                          updateQuestion(
                                            page.id,
                                            section.id,
                                            question.id,
                                            {
                                              maxScore:
                                                value === ""
                                                  ? 0
                                                  : parseInt(value),
                                            }
                                          );
                                        }
                                      }}
                                      onBlur={(e) => {
                                        const value = e.target.value;
                                        if (value === "") {
                                          updateQuestion(
                                            page.id,
                                            section.id,
                                            question.id,
                                            { maxScore: 0 }
                                          );
                                        } else if (/^\d+$/.test(value)) {
                                          const numericValue = parseInt(
                                            value,
                                            10
                                          );
                                          updateQuestion(
                                            page.id,
                                            section.id,
                                            question.id,
                                            { maxScore: numericValue }
                                          );
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (
                                          [46, 8, 9, 27, 13].includes(
                                            e.keyCode
                                          ) ||
                                          (e.keyCode === 65 &&
                                            e.ctrlKey === true) ||
                                          (e.keyCode === 67 &&
                                            e.ctrlKey === true) ||
                                          (e.keyCode === 86 &&
                                            e.ctrlKey === true) ||
                                          (e.keyCode === 88 &&
                                            e.ctrlKey === true) ||
                                          (e.keyCode >= 35 && e.keyCode <= 39)
                                        ) {
                                          return;
                                        }
                                        if (
                                          (e.keyCode < 48 || e.keyCode > 57) &&
                                          (e.keyCode < 96 || e.keyCode > 105)
                                        ) {
                                          e.preventDefault();
                                        }
                                      }}
                                      style={{
                                        flex: 1,
                                        padding: "8px 12px",
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "4px",
                                        fontSize: "0.9rem",
                                      }}
                                      className="max-score-input"
                                    />
                                    <button
                                      className="more-options-btn-for-score"
                                      id={`q${question.id}-moreOptionsBtnForScore`}
                                      aria-label="More score options"
                                      onClick={(e) =>
                                        openScoringPanel(
                                          e,
                                          page.id,
                                          section.id,
                                          question.id,
                                          question.maxScore
                                        )
                                      }
                                      style={{
                                        background: "none",
                                        border: "1px solid #e0e0e0",
                                        color: "#666",
                                        fontSize: "1.2rem",
                                        cursor: "pointer",
                                        padding: "6px 10px",
                                        borderRadius: "4px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      ⋮
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Question Risk */}
                          <div
                            style={{
                              padding: "10px 0",
                              borderTop: "1px solid #e0e0e0",
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              flexWrap: "wrap",
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <label
                              style={{
                                fontSize: "0.8rem",
                                fontWeight: "500",
                                color: "#555",
                              }}
                            >
                              Risk
                            </label>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                              }}
                            >
                              <label
                                style={{
                                  fontSize: "0.9rem",
                                  color: "#555",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                }}
                              >
                                <input
                                  type="radio"
                                  checked={question.questionRisk === "Low"}
                                  onChange={() =>
                                    updateQuestion(
                                      page.id,
                                      section.id,
                                      question.id,
                                      { questionRisk: "Low" }
                                    )
                                  }
                                  style={{ marginRight: "4px" }}
                                />
                                Low
                              </label>
                              <label
                                style={{
                                  fontSize: "0.9rem",
                                  color: "#555",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                }}
                              >
                                <input
                                  type="radio"
                                  checked={question.questionRisk === "Medium"}
                                  onChange={() =>
                                    updateQuestion(
                                      page.id,
                                      section.id,
                                      question.id,
                                      { questionRisk: "Medium" }
                                    )
                                  }
                                  style={{ marginRight: "4px" }}
                                />
                                Medium
                              </label>
                              <label
                                style={{
                                  fontSize: "0.9rem",
                                  color: "#555",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                }}
                              >
                                <input
                                  type="radio"
                                  checked={question.questionRisk === "High"}
                                  onChange={() =>
                                    updateQuestion(
                                      page.id,
                                      section.id,
                                      question.id,
                                      { questionRisk: "High" }
                                    )
                                  }
                                  style={{ marginRight: "4px" }}
                                />
                                High
                              </label>
                            </div>
                          </div>

                          {/* Standard Requirement */}
                          <div
                            style={{
                              padding: "10px 0",
                              borderTop: "1px solid #e0e0e0",
                            }}
                          >
                            <label
                              style={{
                                display: "block",
                                fontSize: "0.8rem",
                                fontWeight: "500",
                                color: "#555",
                                marginBottom: "6px",
                              }}
                            >
                              Standard Requirement
                            </label>
                            <textarea
                              value={question.standardRequirement}
                              onChange={(e) =>
                                updateQuestion(
                                  page.id,
                                  section.id,
                                  question.id,
                                  {
                                    standardRequirement: e.target.value,
                                  }
                                )
                              }
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                width: "100%",
                                padding: "8px 12px",
                                border: "1px solid #e0e0e0",
                                borderRadius: "6px",
                                minHeight: "60px",
                                fontSize: "0.95rem",
                                backgroundColor: "#ffffff",
                                resize: "vertical",
                              }}
                              placeholder="Enter standard requirement..."
                            />
                          </div>

                          {/* Bottom Controls */}
                          <>
                            {/* Bottom Controls */}
                            <div
                              className="bottom-controls"
                              style={{
                                backgroundColor: "#ffffff",
                                borderTop: "1px solid #e0e0e0",
                                padding: "10px 0",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                fontSize: "0.9rem",
                                flexWrap: "wrap",
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div
                                className="left-options-group"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  flexWrap: "wrap",
                                }}
                              >
                                {/* Add Logic Link */}
                                {/* <div className="control-item">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      addLogicRule(
                                        page.id,
                                        section.id,
                                        question.id
                                      );
                                    }}
                                    style={{
                                      color: "#6e42ff",
                                      textDecoration: "none",
                                      fontWeight: "500",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "5px",
                                      background: "none",
                                      border: "none",
                                      cursor: "pointer",
                                      padding: "5px 10px",
                                      borderRadius: "4px",
                                    }}
                                    className="add-logic-link"
                                  >
                                    <span className="icon">🔗</span>
                                    {question.logicRules &&
                                    question.logicRules.length > 0
                                      ? `${question.logicRules.length} Logic Rules`
                                      : "Add logic"}
                                  </button>
                                </div> */}

                                {/* Required Checkbox */}
                                <div className="control-item">
                                  <label
                                    className="checkbox-label"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      cursor: "pointer",
                                      color: "#555",
                                      fontWeight: "500",
                                      padding: "5px 10px",
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      id="q1-requiredCheckbox"
                                      checked={question.isRequired}
                                      onChange={(e) =>
                                        updateQuestion(
                                          page.id,
                                          section.id,
                                          question.id,
                                          { isRequired: e.target.checked }
                                        )
                                      }
                                      style={{ display: "none" }}
                                    />
                                    <span
                                      className="custom-checkbox"
                                      style={{
                                        width: "16px",
                                        height: "16px",
                                        border: "2px solid #6e42ff",
                                        borderRadius: "3px",
                                        marginRight: "6px",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: question.isRequired
                                          ? "#6e42ff"
                                          : "transparent",
                                      }}
                                    >
                                      {question.isRequired && (
                                        <span
                                          style={{
                                            color: "white",
                                            fontSize: "12px",
                                          }}
                                        >
                                          ✓
                                        </span>
                                      )}
                                    </span>
                                    Required
                                  </label>
                                </div>

                                {/* Multiple Selection Checkbox */}
                                <div className="control-item">
                                  <label
                                    className="checkbox-label"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      cursor: "pointer",
                                      color: "#555",
                                      fontWeight: "500",
                                      padding: "5px 10px",
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      id="q1-multipleSelectionCheckbox"
                                      checked={question.isMultiple}
                                      onChange={(e) =>
                                        updateQuestion(
                                          page.id,
                                          section.id,
                                          question.id,
                                          { isMultiple: e.target.checked }
                                        )
                                      }
                                      style={{ display: "none" }}
                                    />
                                    <span
                                      className="custom-checkbox"
                                      style={{
                                        width: "16px",
                                        height: "16px",
                                        border: "2px solid #6e42ff",
                                        borderRadius: "3px",
                                        marginRight: "6px",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: question.isMultiple
                                          ? "#6e42ff"
                                          : "transparent",
                                      }}
                                    >
                                      {question.isMultiple && (
                                        <span
                                          style={{
                                            color: "white",
                                            fontSize: "12px",
                                          }}
                                        >
                                          ✓
                                        </span>
                                      )}
                                    </span>
                                    Multiple selection
                                  </label>
                                </div>

                                {/* Flagged Responses Checkbox */}
                                <div className="control-item">
                                  <label
                                    className="checkbox-label"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      cursor: "pointer",
                                      color: "#555",
                                      fontWeight: "500",
                                      padding: "5px 10px",
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      id="q1-flaggedResponseCheckbox"
                                      checked={question.isFlaggedDefault}
                                      onChange={(e) =>
                                        updateQuestion(
                                          page.id,
                                          section.id,
                                          question.id,
                                          { isFlaggedDefault: e.target.checked }
                                        )
                                      }
                                      style={{ display: "none" }}
                                    />
                                    <span
                                      className="custom-checkbox"
                                      style={{
                                        width: "16px",
                                        height: "16px",
                                        border: "2px solid #6e42ff",
                                        borderRadius: "3px",
                                        marginRight: "6px",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor:
                                          question.isFlaggedDefault
                                            ? "#6e42ff"
                                            : "transparent",
                                      }}
                                    >
                                      {question.isFlaggedDefault && (
                                        <span
                                          style={{
                                            color: "white",
                                            fontSize: "12px",
                                          }}
                                        >
                                          ✓
                                        </span>
                                      )}
                                    </span>
                                    Flagged responses
                                    <span
                                      className="flagged-response-badge"
                                      style={{
                                        marginLeft: "5px",
                                        backgroundColor: "#f0f0f0",
                                        color: "#666",
                                        fontSize: "0.8rem",
                                        padding: "2px 6px",
                                        borderRadius: "10px",
                                      }}
                                    >
                                      No
                                    </span>
                                  </label>
                                </div>
                              </div>

                              <button
                                className="more-options-menu"
                                aria-label="More options"
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "#666",
                                  cursor: "pointer",
                                  fontSize: "1.2rem",
                                  padding: "5px 10px",
                                }}
                              >
                                ⋮
                              </button>
                            </div>

                            {question.showLogicBuilder && (
                              <div
                                className="logic-rules-container logic-visible"
                                style={{
                                  padding: "15px 20px",
                                  backgroundColor: "#ffffff",
                                  borderTop: "1px solid #e2e8f0",
                                  display: "block",
                                }}
                              >
                                {/* Existing Logic Rules */}
                                {question.logicRules &&
                                  question.logicRules.length > 0 && (
                                    <div
                                      className="logic-rules-container logic-visible"
                                      style={{
                                        padding: "15px 20px",
                                        backgroundColor: "#ffffff",
                                        borderTop: "1px solid #e2e8f0",
                                        display: "block",
                                      }}
                                    >
                                      {question.logicRules.map((rule) => (
                                        <div
                                          key={rule.id}
                                          className="logic-rule"
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            padding: "10px 0",
                                            fontSize: "0.9rem",
                                            color: "#4a5568",
                                            position: "relative",
                                            borderBottom:
                                              rule.id !==
                                              question.logicRules[
                                                question.logicRules.length - 1
                                              ].id
                                                ? "1px dashed #e2e8f0"
                                                : "none",
                                          }}
                                        >
                                          <span
                                            className="logic-rule-drag-handle"
                                            style={{
                                              width: "4px",
                                              height: "20px",
                                              backgroundColor: "#6e42ff",
                                              borderRadius: "2px",
                                              opacity: 0.5,
                                              cursor: "grab",
                                            }}
                                          />
                                          <span className="logic-if-text">
                                            If answer is
                                          </span>
                                          <select
                                            className="logic-answer-select"
                                            value={rule.conditionResponse}
                                            onChange={(e) =>
                                              updateLogicRule(
                                                page.id,
                                                section.id,
                                                question.id,
                                                rule.id,
                                                {
                                                  conditionResponse:
                                                    e.target.value,
                                                }
                                              )
                                            }
                                            style={{
                                              padding: "6px 10px",
                                              border: "1px solid #e0e0e0",
                                              borderRadius: "6px",
                                              backgroundColor: "#ffffff",
                                              fontSize: "0.9rem",
                                              color: "#333",
                                              minWidth: "80px",
                                            }}
                                          >
                                            {question.responses.map(
                                              (response) => (
                                                <option
                                                  key={response.text}
                                                  value={response.text}
                                                >
                                                  {response.text}
                                                </option>
                                              )
                                            )}
                                          </select>
                                          <span className="logic-then-text">
                                            then
                                          </span>

                                          {/* Selected Triggers */}
                                          <div
                                            className="logic-selected-triggers-container"
                                            style={{
                                              display: "flex",
                                              flexWrap: "wrap",
                                              gap: "8px",
                                              alignItems: "center",
                                            }}
                                          >
                                            {rule.triggers.map((trigger) => (
                                              <span
                                                key={trigger.id}
                                                className="trigger-pill"
                                                data-action-type={trigger.type}
                                                onClick={() => {
                                                  setLogicModalState({
                                                    type:
                                                      trigger.type ===
                                                      "require-evidence"
                                                        ? "require-evidence"
                                                        : trigger.type ===
                                                          "notify"
                                                        ? "notify"
                                                        : null,
                                                    questionId: question.id,
                                                    ruleId: rule.id,
                                                    triggerId: trigger.id,
                                                    conditionResponse:
                                                      rule.conditionResponse,
                                                    initialConfig:
                                                      trigger.config || {},
                                                  });
                                                }}
                                                style={{
                                                  backgroundColor: "#e0f2fe",
                                                  color: "#0284c7",
                                                  padding: "4px 8px",
                                                  borderRadius: "12px",
                                                  fontSize: "0.85rem",
                                                  fontWeight: "500",
                                                  display: "inline-flex",
                                                  alignItems: "center",
                                                  gap: "5px",
                                                  cursor: "pointer",
                                                }}
                                              >
                                                {trigger.type ===
                                                  "require-action" && (
                                                  <>
                                                    <FaClipboardCheck
                                                      style={{
                                                        fontSize: "0.8rem",
                                                      }}
                                                    />{" "}
                                                    Require action
                                                  </>
                                                )}
                                                {trigger.type ===
                                                  "require-evidence" && (
                                                  <>
                                                    <FaFileAlt
                                                      style={{
                                                        fontSize: "0.8rem",
                                                      }}
                                                    />{" "}
                                                    Require evidence
                                                  </>
                                                )}
                                                {trigger.type === "notify" && (
                                                  <>
                                                    <FaBell
                                                      style={{
                                                        fontSize: "0.8rem",
                                                      }}
                                                    />{" "}
                                                    Notify
                                                  </>
                                                )}
                                                {trigger.type ===
                                                  "ask-questions" && (
                                                  <>
                                                    <FaComments
                                                      style={{
                                                        fontSize: "0.8rem",
                                                      }}
                                                    />{" "}
                                                    Ask questions
                                                  </>
                                                )}
                                                <button
                                                  className="trigger-pill-remove"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeTriggerFromRule(
                                                      page.id,
                                                      section.id,
                                                      question.id,
                                                      rule.id,
                                                      trigger.id
                                                    );
                                                  }}
                                                  style={{
                                                    background: "none",
                                                    border: "none",
                                                    color: "#0284c7",
                                                    opacity: 0.7,
                                                    cursor: "pointer",
                                                    padding: 0,
                                                    fontSize: "0.9em",
                                                    lineHeight: 1,
                                                  }}
                                                  aria-label="Remove trigger"
                                                >
                                                  ×
                                                </button>
                                              </span>
                                            ))}
                                          </div>

                                          {/* Add Trigger Button */}
                                          <button
                                            className="logic-add-trigger-btn"
                                            onClick={() =>
                                              setActiveTriggerMenu(rule.id)
                                            }
                                            style={{
                                              background: "none",
                                              border: "none",
                                              color: "#6e42ff",
                                              fontWeight: "500",
                                              cursor: "pointer",
                                              padding: "5px",
                                              fontSize: "0.9rem",
                                              position: "relative",
                                            }}
                                            aria-expanded={
                                              activeTriggerMenu === rule.id
                                            }
                                          >
                                            + trigger
                                          </button>

                                          {/* Trigger Actions Popup */}
                                          {activeTriggerMenu === rule.id && (
                                            <div
                                              className="logic-trigger-actions-popup"
                                              style={{
                                                position: "absolute",
                                                top: "calc(100% + 5px)",
                                                left: 0,
                                                backgroundColor: "#ffffff",
                                                border: "1px solid #e0e0e0",
                                                borderRadius: "6px",
                                                boxShadow:
                                                  "0 4px 12px rgba(0, 0, 0, 0.1)",
                                                zIndex: 1070,
                                                padding: "5px 0",
                                                minWidth: "180px",
                                                display: "block",
                                              }}
                                            >
                                              <button
                                                className="trigger-action-item"
                                                onClick={() => {
                                                  addTriggerToRule(
                                                    page.id,
                                                    section.id,
                                                    question.id,
                                                    rule.id,
                                                    "require-action"
                                                  );
                                                  setActiveTriggerMenu(null);
                                                }}
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  width: "100%",
                                                  padding: "8px 15px",
                                                  fontSize: "0.9rem",
                                                  color: "#333",
                                                  backgroundColor:
                                                    "transparent",
                                                  border: "none",
                                                  textAlign: "left",
                                                  cursor: "pointer",
                                                  gap: "8px",
                                                }}
                                              >
                                                <FaClipboardCheck
                                                  style={{
                                                    color: "#555",
                                                    width: "16px",
                                                  }}
                                                />{" "}
                                                Require action
                                              </button>
                                              <button
                                                className="trigger-action-item"
                                                onClick={() => {
                                                  addTriggerToRule(
                                                    page.id,
                                                    section.id,
                                                    question.id,
                                                    rule.id,
                                                    "require-evidence"
                                                  );
                                                  setActiveTriggerMenu(null);
                                                }}
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  width: "100%",
                                                  padding: "8px 15px",
                                                  fontSize: "0.9rem",
                                                  color: "#333",
                                                  backgroundColor:
                                                    "transparent",
                                                  border: "none",
                                                  textAlign: "left",
                                                  cursor: "pointer",
                                                  gap: "8px",
                                                }}
                                              >
                                                <FaFileAlt
                                                  style={{
                                                    color: "#555",
                                                    width: "16px",
                                                  }}
                                                />{" "}
                                                Require evidence
                                              </button>
                                              <button
                                                className="trigger-action-item"
                                                onClick={() => {
                                                  addTriggerToRule(
                                                    page.id,
                                                    section.id,
                                                    question.id,
                                                    rule.id,
                                                    "notify"
                                                  );
                                                  setActiveTriggerMenu(null);
                                                }}
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  width: "100%",
                                                  padding: "8px 15px",
                                                  fontSize: "0.9rem",
                                                  color: "#333",
                                                  backgroundColor:
                                                    "transparent",
                                                  border: "none",
                                                  textAlign: "left",
                                                  cursor: "pointer",
                                                  gap: "8px",
                                                }}
                                              >
                                                <FaBell
                                                  style={{
                                                    color: "#555",
                                                    width: "16px",
                                                  }}
                                                />{" "}
                                                Notify
                                              </button>
                                              <button
                                                className="trigger-action-item"
                                                onClick={() => {
                                                  addTriggerToRule(
                                                    page.id,
                                                    section.id,
                                                    question.id,
                                                    rule.id,
                                                    "ask-questions"
                                                  );
                                                  setActiveTriggerMenu(null);
                                                }}
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  width: "100%",
                                                  padding: "8px 15px",
                                                  fontSize: "0.9rem",
                                                  color: "#333",
                                                  backgroundColor:
                                                    "transparent",
                                                  border: "none",
                                                  textAlign: "left",
                                                  cursor: "pointer",
                                                  gap: "8px",
                                                }}
                                              >
                                                <FaComments
                                                  style={{
                                                    color: "#555",
                                                    width: "16px",
                                                  }}
                                                />{" "}
                                                Ask questions
                                              </button>
                                            </div>
                                          )}

                                          {/* Options Button */}
                                          <button
                                            className="logic-rule-options-btn"
                                            onClick={() =>
                                              removeLogicRule(
                                                page.id,
                                                section.id,
                                                question.id,
                                                rule.id
                                              )
                                            }
                                            style={{
                                              background: "none",
                                              border: "none",
                                              fontSize: "1.2rem",
                                              color: "#555",
                                              cursor: "pointer",
                                              padding: "5px",
                                              marginLeft: "auto",
                                            }}
                                          >
                                            <FaTrashAlt />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                              </div>
                            )}
                          </>
                          {/* Delete Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteQuestion(page.id, section.id, question.id);
                            }}
                            style={{
                              position: "absolute",
                              top: "10px",
                              right: "5px",
                              background: "none",
                              border: "none",
                              color: "#dc3545",
                              fontSize: "1.1rem",
                              cursor: "pointer",
                              padding: "5px",
                              opacity:
                                activeQuestionId === question.id ? 1 : 0.7,
                            }}
                            title="Delete question"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      ))}

                      {/* Add Question Button */}
                      <button
                        onClick={() => addQuestion(page.id, section.id)}
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e0e0e0",
                          color: "#6e42ff",
                          padding: "8px 15px",
                          borderRadius: "6px",
                          fontSize: "0.9rem",
                          fontWeight: "500",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                          marginTop: "20px",
                        }}
                      >
                        <span
                          style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                        >
                          +
                        </span>{" "}
                        Add Question
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Add Section Button */}
              <button
                onClick={() => addSection(page.id)}
                style={{
                  backgroundColor: "#6e42ff",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                + Add Section
              </button>
            </div>
          </div>
        ))}

        {isEditModalOpen && (
          <div
            className="multiple-choice-editor-modal modal-overlay"
            id="multipleChoiceEditorModal"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
            onClick={(e) => {
              if (
                e.target.className.includes("multiple-choice-editor-modal") ||
                e.target.className.includes("modal-overlay")
              ) {
                setIsEditModalOpen(false);
                setActiveColorPickerIndex(null);
              }
            }}
          >
            <div
              className="modal-content"
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "25px 30px",
                width: "520px",
                maxWidth: "90%",
                maxHeight: "85vh",
                boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
                display: "flex",
                flexDirection: "column",
                zIndex: 1100,
                position: "relative",
              }}
            >
              <div
                className="modal-header"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  marginBottom: "20px",
                  borderBottom: "1px solid #e5e7eb",
                  paddingBottom: "15px",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "600",
                    color: "#2d3748",
                    margin: 0,
                    flexBasis: "100%",
                  }}
                >
                  Multiple choice responses
                </h2>
                <span
                  className="example-text"
                  id="editorExampleText"
                  style={{
                    fontSize: "0.9rem",
                    color: "#718096",
                    marginTop: "5px",
                    flexGrow: 1,
                  }}
                >
                  e.g. New Option Set
                </span>
                <label
                  className="scoring-checkbox-label"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    color: "#4a5568",
                    fontWeight: "500",
                    marginLeft: "auto",
                  }}
                >
                  <input
                    type="checkbox"
                    id="editorScoringCheckbox"
                    checked={isScoringEnabled}
                    onChange={(e) => setIsScoringEnabled(e.target.checked)}
                    style={{ display: "none" }}
                  />
                  <span
                    className="custom-checkbox-editor"
                    style={{
                      width: "18px",
                      height: "18px",
                      border: "2px solid #a0aec0",
                      borderRadius: "4px",
                      marginRight: "8px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isScoringEnabled
                        ? "#6d28d9"
                        : "transparent",
                      position: "relative",
                      transition: "background-color 0.2s, border-color 0.2s",
                    }}
                  >
                    {isScoringEnabled && (
                      <span
                        style={{
                          fontSize: "12px",
                          color: "white",
                        }}
                      >
                        ✔
                      </span>
                    )}
                  </span>
                  Scoring
                </label>
              </div>

              <div
                className="modal-body"
                style={{
                  flexGrow: 1,
                  overflowY: "auto",
                  marginBottom: "20px",
                  position: "relative",
                }}
              >
                <div
                  className="response-list-header"
                  style={{
                    fontSize: "0.75rem",
                    color: "#a0aec0",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "10px",
                    paddingLeft: "35px",
                  }}
                >
                  Response
                </div>
                <ul
                  className="editor-response-list"
                  id="editorResponseListContainer"
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {editingResponses.length === 0 ? (
                    <li
                      style={{
                        padding: "20px 0",
                        textAlign: "center",
                        color: "#718096",
                        fontStyle: "italic",
                      }}
                    >
                      No responses added yet. Click "Add Response" to get
                      started.
                    </li>
                  ) : (
                    editingResponses.map((response, index) => (
                      <li
                        key={`response-${index}-${response.text}`}
                        className="editor-response-item"
                        style={{
                          display: "flex",
                          padding: "10px 0",
                          borderBottom: "1px solid #edf2f7",
                          cursor: "default",
                          alignItems: "flex-start",
                        }}
                      >
                        <div
                          className="drag-handle"
                          style={{
                            fontSize: "1rem",
                            color: "#cbd5e0",
                            cursor: "grab",
                            marginRight: "15px",
                            display: "flex",
                            flexDirection: "column",
                            lineHeight: "0.3",
                            alignSelf: "flex-start",
                            marginTop: "20px",
                            padding: "5px",
                          }}
                        >
                          <span>⋮</span>
                          <span>⋮</span>
                        </div>
                        <div
                          style={{
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <div
                            className="item-main-edit-row"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <div
                              className="response-input-wrapper-editing"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                border: "1px solid #6d28d9",
                                borderRadius: "6px",
                                padding: "8px 10px",
                                marginBottom: "10px",
                                flexGrow: 1,
                                backgroundColor: "#f9fafb",
                              }}
                            >
                              <input
                                type="text"
                                value={response.text}
                                onChange={(e) => {
                                  const newResponses = [...editingResponses];
                                  newResponses[index].text = e.target.value;
                                  setEditingResponses(newResponses);
                                }}
                                className="response-text-input-editing"
                                style={{
                                  flexGrow: 1,
                                  border: "none",
                                  outline: "none",
                                  fontSize: "0.95rem",
                                  color: "#2d3748",
                                  backgroundColor: "transparent",
                                  padding: "4px 0",
                                }}
                                placeholder="Response text"
                              />
                              <div
                                className="color-indicator"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const buttonRect =
                                    e.currentTarget.getBoundingClientRect();
                                  setActiveColorPickerIndex(index);
                                  setColorPickerPosition({
                                    top: buttonRect.bottom,
                                    left: buttonRect.left,
                                  });
                                }}
                                style={{
                                  width: "24px",
                                  height: "24px",
                                  borderRadius: "50%",
                                  backgroundColor: response.colorHex,
                                  cursor: "pointer",
                                  marginLeft: "10px",
                                  border: "2px solid #fff",
                                  boxShadow: "0 0 0 1px #d1d5db",
                                  flexShrink: 0,
                                }}
                                title="Change color"
                              />
                            </div>
                          </div>
                          <div
                            className="response-sub-controls"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              paddingLeft: "0",
                              marginTop: "8px",
                              width: "100%",
                              boxSizing: "border-box",
                            }}
                          >
                            <label
                              className="sub-control-checkbox-label"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                fontSize: "0.85rem",
                                color: "#4a5568",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={response.flagged}
                                onChange={(e) => {
                                  const newResponses = [...editingResponses];
                                  newResponses[index].flagged =
                                    e.target.checked;
                                  setEditingResponses(newResponses);
                                }}
                                style={{
                                  display: "none",
                                }}
                              />
                              <span
                                className="custom-sub-checkbox"
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  border: "1.5px solid #a0aec0",
                                  borderRadius: "3px",
                                  marginRight: "6px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: response.flagged
                                    ? "#6d28d9"
                                    : "transparent",
                                  position: "relative",
                                }}
                              >
                                {response.flagged && (
                                  <span
                                    style={{
                                      fontSize: "10px",
                                      color: "white",
                                    }}
                                  >
                                    ✔
                                  </span>
                                )}
                              </span>
                              Mark as flagged
                            </label>
                            {isScoringEnabled && (
                              <>
                                <span
                                  className="sub-control-divider"
                                  style={{
                                    color: "#cbd5e0",
                                  }}
                                >
                                  |
                                </span>
                                <label
                                  className="sub-control-score-label"
                                  style={{
                                    fontSize: "0.85rem",
                                    color: "#4a5568",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  Score
                                  <input
                                    type="number"
                                    value={response.score}
                                    onChange={(e) => {
                                      const newResponses = [
                                        ...editingResponses,
                                      ];
                                      newResponses[index].score =
                                        e.target.value;
                                      setEditingResponses(newResponses);
                                    }}
                                    className="sub-control-score-input"
                                    style={{
                                      width: "40px",
                                      padding: "4px 6px",
                                      border: "1px solid #cbd5e0",
                                      borderRadius: "4px",
                                      fontSize: "0.85rem",
                                      marginLeft: "5px",
                                      textAlign: "center",
                                    }}
                                  />
                                </label>
                              </>
                            )}
                          </div>
                        </div>
                        {/* DELETE BUTTON AT FAR RIGHT OF ROW */}
                        <button
                          onClick={() => {
                            const newResponses = editingResponses.filter(
                              (_, i) => i !== index
                            );
                            setEditingResponses(newResponses);
                            if (activeColorPickerIndex === index) {
                              setActiveColorPickerIndex(null);
                            }
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#dc3545",
                            fontSize: "1.2rem",
                            cursor: "pointer",
                            padding: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "36px",
                            height: "36px",
                            borderRadius: "4px",
                            transition: "all 0.2s",
                            alignSelf: "flex-start",
                            marginLeft: "10px",
                          }}
                          title="Delete this response"
                        >
                          <FaTrashAlt />
                        </button>
                      </li>
                    ))
                  )}
                </ul>
                <button
                  className="add-response-button"
                  id="editorAddResponseBtn"
                  onClick={() => {
                    setEditingResponses([
                      ...editingResponses,
                      {
                        text: "",
                        class: "",
                        score: "0",
                        flagged: false,
                        colorHex: "#6b7280",
                      },
                    ]);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#6d28d9",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    padding: "10px 0",
                    marginTop: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <span className="plus-icon" style={{ fontSize: "1.1rem" }}>
                    +
                  </span>
                  Add Response
                </button>
              </div>

              <div
                className="modal-footer"
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  paddingTop: "20px",
                  borderTop: "1px solid #e5e7eb",
                  marginTop: "10px",
                }}
              >
                <button
                  className="btn-save-apply"
                  id="editorSaveApplyBtn"
                  onClick={() => {
                    // Validate responses
                    const validResponses = editingResponses.filter(
                      (r) => r.text.trim() !== ""
                    );
                    if (validResponses.length === 0) {
                      alert("Please add at least one response");
                      return;
                    }

                    // Update the question with new responses
                    updateQuestion(page.id, section.id, question.id, {
                      responses: validResponses,
                    });
                    setIsEditModalOpen(false);
                  }}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#6d28d9",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Save and apply
                </button>
                <button
                  className="btn-cancel"
                  id="editorCancelBtn"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setActiveColorPickerIndex(null);
                  }}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "transparent",
                    color: "#6b7280",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>

              {/* Color Picker Popup */}
              {activeColorPickerIndex !== null && (
                <div
                  className="color-picker-popup"
                  style={{
                    position: "absolute",
                    top: "201px",
                    right: "0px",
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    padding: "15px",
                    zIndex: 1200,
                    width: "230px",
                  }}
                >
                  <div
                    className="color-picker-header"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      className="color-picker-preview-swatch"
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "4px",
                        border: "1px solid #e5e7eb",
                        marginRight: "10px",
                        backgroundColor:
                          editingResponses[activeColorPickerIndex]?.colorHex ||
                          "#6b7280",
                      }}
                    ></div>
                    <input
                      type="text"
                      className="color-picker-hex-input"
                      value={
                        editingResponses[activeColorPickerIndex]?.colorHex ||
                        "#6b7280"
                      }
                      onChange={(e) => {
                        const newResponses = [...editingResponses];
                        newResponses[activeColorPickerIndex].colorHex =
                          e.target.value;
                        setEditingResponses(newResponses);
                      }}
                      style={{
                        flexGrow: 1,
                        padding: "6px 8px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "4px",
                        fontSize: "0.85rem",
                        outline: "none",
                      }}
                      maxLength="7"
                    />
                  </div>
                  <div
                    className="color-picker-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(6, 1fr)",
                      gap: "8px",
                    }}
                  >
                    {[
                      {
                        hex: "#13855f",
                        class: "yes",
                        title: "Green (Yes/Good)",
                      },
                      {
                        hex: "#ef4444",
                        class: "no",
                        title: "Red (No/Poor)",
                      },
                      {
                        hex: "#a0aec0",
                        class: "na",
                        title: "Gray (N/A)",
                      },
                      {
                        hex: "#f59e0b",
                        class: "fair",
                        title: "Yellow (Fair)",
                      },
                      {
                        hex: "#6e42ff",
                        class: "primary",
                        title: "Purple (Primary)",
                      },
                      {
                        hex: "#f0eefe",
                        class: "light-purple",
                        title: "Light Purple BG",
                      },
                      {
                        hex: "#ffedd5",
                        class: "custom-orange",
                        title: "Orange",
                      },
                      {
                        hex: "#fef9c3",
                        class: "custom-light-yellow",
                        title: "Light Yellow",
                      },
                      {
                        hex: "#dbeafe",
                        class: "custom-light-blue",
                        title: "Light Blue",
                      },
                      {
                        hex: "#dcfce7",
                        class: "custom-light-green",
                        title: "Light Green",
                      },
                      {
                        hex: "#ccfbf1",
                        class: "custom-teal",
                        title: "Teal",
                      },
                      {
                        hex: "#e0f2fe",
                        class: "custom-sky-blue",
                        title: "Sky Blue",
                      },
                      {
                        hex: "#e0e7ff",
                        class: "custom-indigo",
                        title: "Indigo",
                      },
                      // Removed duplicate #a0aec0 entry
                    ].map((color, idx) => (
                      <div
                        key={`color-${idx}-${color.hex}`}
                        className={`color-picker-grid-swatch ${
                          editingResponses[activeColorPickerIndex]?.colorHex ===
                          color.hex
                            ? "selected"
                            : ""
                        }`}
                        title={color.title}
                        onClick={() => {
                          const newResponses = [...editingResponses];
                          newResponses[activeColorPickerIndex].colorHex =
                            color.hex;
                          newResponses[activeColorPickerIndex].class =
                            color.class;
                          setEditingResponses(newResponses);
                        }}
                        style={{
                          width: "26px",
                          height: "26px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          border:
                            editingResponses[activeColorPickerIndex]
                              ?.colorHex === color.hex
                              ? "2px solid #6d28d9"
                              : "2px solid transparent",
                          boxSizing: "border-box",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: color.hex,
                        }}
                      >
                        {editingResponses[activeColorPickerIndex]?.colorHex ===
                          color.hex && (
                          <i
                            className="fas fa-check"
                            style={{
                              color: "#6d28d9",
                              fontSize: "0.8em",
                            }}
                          ></i>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {showLogicConfig && !logicConfigType && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.4)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1200,
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "30px",
                borderRadius: "10px",
                boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
                minWidth: "400px",
              }}
            >
              <h2 style={{ margin: "0 0 20px 0", color: "#333" }}>Add Logic</h2>
              <p style={{ margin: "0 0 20px 0", color: "#666" }}>
                Choose the type of logic to add when answer is{" "}
                <strong>{logicConfigResponse}</strong>
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() => handleLogicConfig("evidence")}
                  style={{
                    padding: "12px 20px",
                    backgroundColor: "#f0f2f5",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "16px",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span style={{ fontSize: "1.2em" }}>📄</span>
                  <span>
                    <strong>Require Evidence</strong>
                    <br />
                    <small>
                      Require notes or media when this answer is selected
                    </small>
                  </span>
                </button>
                <button
                  onClick={() => handleLogicConfig("notify")}
                  style={{
                    padding: "12px 20px",
                    backgroundColor: "#f0f2f5",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "16px",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span style={{ fontSize: "1.2em" }}>🔔</span>
                  <span>
                    <strong>Notify</strong>
                    <br />
                    <small>Send notifications to users or groups</small>
                  </span>
                </button>
              </div>
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  onClick={closeLogicConfig}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#f7fafc",
                    color: "#4a5568",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {scoringPanelState.isOpen && (
          <div
            className="scoring-panel-popup"
            id="q1-scoringPanelPopup"
            style={{
              position: "absolute",
              top: `${scoringPanelState.position.top}px`,
              right: "0px",
              zIndex: 2000,
              backgroundColor: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              width: "320px",
              maxHeight: "400px",
              display: "block",
            }}
          >
            <div
              className="scoring-panel-header"
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid #e0e0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                className="label"
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                Score calculation
              </span>
              <div
                className="scoring-panel-max-score-input-wrapper"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <input
                  type="number"
                  id="q1-scoringPanelMaxScore"
                  value={scoringPanelMaxScore}
                  onChange={(e) => handleMaxScoreChange(e.target.value)}
                  min="0"
                  style={{
                    width: "60px",
                    padding: "4px 8px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    fontSize: "0.9rem",
                    textAlign: "center",
                  }}
                />
                <button
                  className="clear-max-score-btn"
                  id="q1-clearMaxScoreBtn"
                  aria-label="Clear max score"
                  onClick={handleClearMaxScore}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.2rem",
                    color: "#999",
                    cursor: "pointer",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            <div
              className="scoring-panel-body"
              style={{
                padding: "12px 16px",
              }}
            >
              <div
                className="table-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.8rem",
                  color: "#666",
                  marginBottom: "8px",
                  paddingBottom: "4px",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <span>Response</span>
                <span>Actual Score</span>
              </div>

              <ul
                className="response-score-list"
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                {/* Get the current question to display its responses */}
                {(() => {
                  const currentQuestion = pages
                    .find((p) => p.id === scoringPanelState.pageId)
                    ?.sections.find((s) => s.id === scoringPanelState.sectionId)
                    ?.questions.find(
                      (q) => q.id === scoringPanelState.questionId
                    );

                  if (!currentQuestion) return null;

                  return currentQuestion.responses.map((response, index) => (
                    <li
                      key={index}
                      className="response-score-item"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 0",
                        borderBottom: "1px solid #f8f8f8",
                      }}
                    >
                      <span
                        className={`response-name-pill pill-${
                          response.pillClass || "na"
                        }`}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "0.85rem",
                          fontWeight: "500",
                          backgroundColor:
                            response.pillClass === "yes"
                              ? "#e6f4ea"
                              : response.pillClass === "no"
                              ? "#fdecea"
                              : response.pillClass === "na"
                              ? "#f0f0f0"
                              : "#f0eefe",
                          color:
                            response.pillClass === "yes"
                              ? "#006400"
                              : response.pillClass === "no"
                              ? "#a00000"
                              : response.pillClass === "na"
                              ? "#666"
                              : "#6e42ff",
                        }}
                      >
                        {response.text}
                      </span>
                      <span
                        className="actual-score-value"
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "500",
                          color: "#333",
                        }}
                      >
                        {typeof response.score === "number" ? (
                          <span>
                            <span
                              className="calculation"
                              style={{
                                fontSize: "0.8rem",
                                color: "#666",
                                marginRight: "4px",
                              }}
                            >
                              {response.score} × {scoringPanelMaxScore} =
                            </span>
                            {(response.score * scoringPanelMaxScore).toFixed(1)}
                          </span>
                        ) : (
                          response.score
                        )}
                      </span>
                    </li>
                  ));
                })()}
              </ul>
            </div>

            <div
              className="scoring-panel-footer"
              style={{
                padding: "12px 16px",
                borderTop: "1px solid #e0e0e0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "0.85rem",
                color: "#666",
              }}
            >
              <i
                className="fas fa-info-circle info-icon"
                style={{ color: "#6e42ff" }}
              ></i>
              <a
                href="#"
                className="edit-response-set-link"
                id="q1-scoringPanelEditSetLink"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  closeScoringPanel();

                  // Find the current question and open the edit modal
                  const currentQuestion = pages
                    .find((p) => p.id === scoringPanelState.pageId)
                    ?.sections.find((s) => s.id === scoringPanelState.sectionId)
                    ?.questions.find(
                      (q) => q.id === scoringPanelState.questionId
                    );

                  if (currentQuestion) {
                    setEditingResponses(currentQuestion.responses);
                    setIsEditModalOpen(true);
                  }
                }}
                style={{
                  color: "#6e42ff",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                Edit response set
              </a>
            </div>
          </div>
        )}

        {logicModalState.type === "require-evidence" && (
          <div
            className="logic-config-side-panel is-open"
            style={{
              position: "fixed",
              top: "0",
              right: "0",
              width: "400px",
              height: "100%",
              backgroundColor: "#fff",
              boxShadow: "-5px 0 15px rgba(0,0,0,0.1)",
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              className="panel-content"
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              <div
                className="panel-header"
                style={{ padding: "20px", borderBottom: "1px solid #e0e0e0" }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  Require evidence
                </h2>
              </div>
              <div
                className="panel-body"
                style={{ flex: 1, padding: "20px", overflowY: "auto" }}
              >
                <p
                  style={{
                    margin: "0 0 20px 0",
                    color: "#666",
                    fontSize: "0.95rem",
                  }}
                >
                  Choose the evidence that'll be required when this answer is
                  selected.
                </p>
                <div
                  className="info-bar"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "#f8f9fa",
                    padding: "10px",
                    borderRadius: "6px",
                    marginBottom: "20px",
                  }}
                >
                  <FaRandom style={{ color: "#6e42ff", fontSize: "0.9rem" }} />
                  <span style={{ fontSize: "0.9rem", color: "#555" }}>
                    If answer is
                  </span>
                  <span
                    className="response-pill yes"
                    style={{
                      padding: "4px 10px",
                      backgroundColor: "#13855f",
                      color: "white",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                    }}
                  >
                    {logicModalState.conditionResponse}
                  </span>
                  <span style={{ fontSize: "0.9rem", color: "#555" }}>
                    require
                  </span>
                </div>
                <div
                  className="form-group checkbox-group"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      name="evidence-notes"
                      defaultChecked={
                        logicModalState.initialConfig?.notes || false
                      }
                      style={{ display: "none" }}
                    />
                    <span
                      className="custom-checkbox-side-panel"
                      style={{
                        width: "20px",
                        height: "20px",
                        border: "2px solid #a0aec0",
                        borderRadius: "4px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {logicModalState.initialConfig?.notes && (
                        <FaCheck
                          style={{ fontSize: "0.8rem", color: "#6e42ff" }}
                        />
                      )}
                    </span>
                    <span style={{ fontSize: "1rem", color: "#333" }}>
                      Notes
                    </span>
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      name="evidence-media"
                      defaultChecked={
                        logicModalState.initialConfig?.media || false
                      }
                      style={{ display: "none" }}
                    />
                    <span
                      className="custom-checkbox-side-panel"
                      style={{
                        width: "20px",
                        height: "20px",
                        border: "2px solid #a0aec0",
                        borderRadius: "4px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {logicModalState.initialConfig?.media && (
                        <FaCheck
                          style={{ fontSize: "0.8rem", color: "#6e42ff" }}
                        />
                      )}
                    </span>
                    <span style={{ fontSize: "1rem", color: "#333" }}>
                      Media
                    </span>
                  </label>
                </div>
              </div>
              <div
                className="panel-footer"
                style={{ padding: "20px", borderTop: "1px solid #e0e0e0" }}
              >
                <button
                  className="btn-save-apply"
                  onClick={() => {
                    const notesCheckbox = document.querySelector(
                      'input[name="evidence-notes"]'
                    );
                    const mediaCheckbox = document.querySelector(
                      'input[name="evidence-media"]'
                    );

                    const config = {
                      notes: notesCheckbox?.checked || false,
                      media: mediaCheckbox?.checked || false,
                    };

                    handleTriggerSave(config);
                    setLogicModalState({ type: null });
                  }}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#6e42ff",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                >
                  Save and apply
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => setLogicModalState({ type: null })}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "transparent",
                    color: "#666",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notify Modal */}
        {logicModalState.type === "notify" && (
          <div
            className="logic-config-side-panel is-open"
            style={{
              position: "fixed",
              top: "0",
              right: "0",
              width: "500px",
              height: "100%",
              backgroundColor: "#fff",
              boxShadow: "-5px 0 15px rgba(0,0,0,0.1)",
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              className="panel-content"
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              <div
                className="panel-header"
                style={{ padding: "20px", borderBottom: "1px solid #e0e0e0" }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  Notify
                </h2>
              </div>
              <div
                className="panel-body"
                style={{ flex: 1, padding: "20px", overflowY: "auto" }}
              >
                <div className="notify-panel-body-content">
                  <div
                    className="condition-box"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      backgroundColor: "#f8f9fa",
                      padding: "12px",
                      borderRadius: "6px",
                      marginBottom: "20px",
                    }}
                  >
                    <FaSyncAlt
                      style={{ color: "#6e42ff", fontSize: "0.9rem" }}
                    />
                    <span
                      className="condition-text"
                      style={{ fontSize: "0.9rem", color: "#555" }}
                    >
                      If answer is
                    </span>
                    <span
                      className="response-pill yes"
                      style={{
                        padding: "4px 10px",
                        backgroundColor: "#13855f",
                        color: "white",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                      }}
                    >
                      {logicModalState.conditionResponse}
                    </span>
                    <span
                      className="condition-text"
                      style={{ fontSize: "0.9rem", color: "#555" }}
                    >
                      notify
                    </span>
                  </div>

                  {/* Notify form content - Simplified version */}
                  <div className="form-group" style={{ marginBottom: "20px" }}>
                    <label
                      className="form-label"
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
                      Send a notification to
                    </label>
                    <div className="select-wrapper">
                      <div
                        className="custom-select-display"
                        style={{
                          border: "1px solid #e0e0e0",
                          borderRadius: "6px",
                          padding: "10px",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ color: "#777" }}>
                          Select users, groups or dynamic notifications
                        </span>
                        <span className="select-arrow">▾</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: "20px" }}>
                    <p
                      className="form-label"
                      style={{
                        marginBottom: "10px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
                      When should the notification be sent?
                    </p>
                    <div
                      className="radio-group"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <div
                        className="radio-option"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <input
                          type="radio"
                          id="notifyImmediately"
                          name="notifySendTime"
                          value="immediately"
                          defaultChecked
                        />
                        <label
                          htmlFor="notifyImmediately"
                          style={{ cursor: "pointer", color: "#333" }}
                        >
                          Immediately
                        </label>
                      </div>
                      <div
                        className="radio-option"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <input
                          type="radio"
                          id="notifyOnCompletion"
                          name="notifySendTime"
                          value="on-completion"
                        />
                        <label
                          htmlFor="notifyOnCompletion"
                          style={{ cursor: "pointer", color: "#333" }}
                        >
                          On inspection completion
                        </label>
                      </div>
                    </div>
                  </div>

                  <div
                    className="info-box"
                    style={{
                      backgroundColor: "#e6f4ea",
                      padding: "12px",
                      borderRadius: "6px",
                      marginBottom: "20px",
                    }}
                  >
                    <p
                      className="info-text"
                      style={{
                        margin: 0,
                        fontSize: "0.85rem",
                        color: "#13855f",
                      }}
                    >
                      Notification recipients will need access to an inspection
                      to view the results. To receive alerts, recipients must
                      have notifications turned on in their settings.
                    </p>
                  </div>

                  <div
                    className="learn-more-link"
                    style={{ marginBottom: "20px" }}
                  >
                    <a
                      href="#"
                      style={{
                        color: "#6e42ff",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <FaExternalLinkAlt style={{ fontSize: "0.8rem" }} />
                      Learn more about response notifications
                    </a>
                  </div>
                </div>
              </div>
              <div
                className="panel-footer"
                style={{ padding: "20px", borderTop: "1px solid #e0e0e0" }}
              >
                <button
                  className="btn-save-apply"
                  onClick={() => {
                    const config = {
                      recipients: "selected", // This would come from form state
                      sendTime:
                        document.querySelector(
                          'input[name="notifySendTime"]:checked'
                        )?.value || "immediately",
                    };

                    handleTriggerSave(config);
                    setLogicModalState({ type: null });
                  }}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#6e42ff",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                >
                  Save and apply
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => setLogicModalState({ type: null })}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "transparent",
                    color: "#666",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {renderMultipleChoiceEditorModal()}
        {renderSaveAsGlobalModal()}
        {/* Autosave Status */}
      </div>
    </div>
  );
}
