import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function AuditFrontPage() {
  const [checklistData, setChecklistData] = useState({
    id: "page-food-production",
    title: "Food Production & Safety Checklist With A Long Name",
    pageNumber: "Page 2 of 2",
    globalNotesStructured: { bestPractice: "", opportunityForImprovement: "" },
    categories: [
      {
        id: "category-kitchen",
        title: "Kitchen 1 Operations & Sanitation With A Potentially Very Long Title That Needs to Truncate",
        isApplicable: true,
        subcategories: [
          {
            id: "subcategory-general-cleanliness",
            title: "General Cleanliness - Also A Longer Title Example",
            isApplicable: true,
            info: "This entire subcategory focuses on maintaining a hygienic environment. Critical for food safety.",
            infoAttachment: { name: "Hygiene_Overview.pdf", url: "#" },
            questions: [
              {
                id: "q1",
                text: "Are all food contact surfaces cleaned and sanitized before and after use?",
                answers: [
                  { text: "Yes", marks: 2 },
                  { text: "No", marks: 0 },
                  { text: "NA", marks: 0 },
                ],
                maxMarks: 2,
                selectedAnswerMarks: null,
                comments: [],
                riskLevel: "high",
                info: "Detailed cleaning protocols require specific sanitizers. Refer to SOP-001 for approved products and contact times.",
                infoAttachment: { name: "SOP-001_Cleaning.pdf", url: "#" },
              },
              {
                id: "q2",
                text: "Are floors, walls, and ceilings clean and in good repair?",
                answers: [
                  { text: "Yes", marks: 1 },
                  { text: "No", marks: 0 },
                  { text: "NA", marks: 0 },
                ],
                maxMarks: 1,
                selectedAnswerMarks: null,
                comments: [],
                riskLevel: "medium",
                info: null,
                infoAttachment: null,
              },
            ],
          },
        ],
      },
    ],
  })

  const [geotagLocation, setGeotagLocation] = useState("")
  const [auditStartTime, setAuditStartTime] = useState("")
  const [activeTimer, setActiveTimer] = useState(0)
  const [pauseTimer, setPauseTimer] = useState(0)
  const [totalTimer, setTotalTimer] = useState(0)
  const [isAuditStarted, setIsAuditStarted] = useState(false)
  const [isAuditPaused, setIsAuditPaused] = useState(false)
  const [globalNoteModal, setGlobalNoteModal] = useState(false)
  const [infoModal, setInfoModal] = useState(false)
  const [selectedInfo, setSelectedInfo] = useState({ title: "", text: "", attachment: null })
  const [floatingButtonPos, setFloatingButtonPos] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ startX: 0, startY: 0 })

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFloatingButtonPos({
        x: window.innerWidth - 90,
        y: window.innerHeight - 90,
      })
    }
  }, [])

  // Timer logic
  useEffect(() => {
    let interval
    if (isAuditStarted && !isAuditPaused) {
      interval = setInterval(() => {
        setActiveTimer((prev) => prev + 1)
        setTotalTimer((prev) => prev + 1)
      }, 1000)
    } else if (isAuditPaused) {
      interval = setInterval(() => {
        setPauseTimer((prev) => prev + 1)
        setTotalTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isAuditStarted, isAuditPaused])

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeotagLocation(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`)
        },
        (error) => {
          alert(`Error getting location: ${error.message}`)
        },
      )
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }

  const handleStartAudit = () => {
    setIsAuditStarted(true)
    setAuditStartTime(new Date().toLocaleString())
  }

  const toggleSection = (level, id) => {
    const element = document.getElementById(`${id}-content`)
    const icon = document.querySelector(`[data-id="${id}"] .icon-chevron`)
    if (element && icon) {
      element.classList.toggle("is-expanded")
      icon.classList.toggle("collapsed")
    }
  }

  const handleFloatingButtonDrag = (e) => {
    if (e.button !== 0) return
    setIsDragging(true)
    dragRef.current = {
      startX: e.clientX - floatingButtonPos.x,
      startY: e.clientY - floatingButtonPos.y,
    }

    const handleMouseMove = (moveEvent) => {
      setFloatingButtonPos({
        x: moveEvent.clientX - dragRef.current.startX,
        y: moveEvent.clientY - dragRef.current.startY,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  return (
    <div
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        backgroundColor: "#f0f2f5",
        color: "#202124",
        padding: "10px",
        minHeight: "100vh",
      }}
    >
      <style jsx global>{`
        .unit-details-container {
          background-color: #ffffff;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .timer-display-container {
          background-color: #e9eafb;
          color: #4c37a3;
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
        }
        .timer-label {
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 0.25rem;
          opacity: 0.8;
        }
        .timer-value {
          font-size: 1.5rem;
          font-weight: 700;
          font-family: 'Courier New', Courier, monospace;
        }
        .main-page-block {
          background-color: #F8F9FA;
          border-radius: 8px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        .header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          margin-bottom: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
          background-color: #ffffff;
          border: 1px solid #e0e4e7;
          gap: 0.75rem;
        }
        .header-bar.is-active {
          background-color: #664DE5;
          color: #ffffff;
          border-color: #664DE5;
        }
        .icon-chevron {
          margin-right: 10px;
          font-size: 14px;
          color: #5f6368;
          width: 16px;
          text-align: center;
          transition: transform 0.2s ease-in-out;
        }
        .icon-chevron.collapsed {
          transform: rotate(-90deg);
        }
        .content-area {
          display: none;
          padding-left: 25px;
          margin-bottom: 8px;
        }
        .content-area.is-expanded {
          display: block;
        }
        .question-block {
          background-color: #ffffff;
          border: 1px solid #e0e4e7;
          padding: 15px 20px;
          margin-bottom: 12px;
          border-radius: 8px;
        }
        .question-block.risk-high {
          border-left: 5px solid #dc3545;
        }
        .question-block.risk-medium {
          border-left: 5px solid #ffc107;
        }
        .question-block.risk-low {
          border-left: 5px solid #198754;
        }
        .answer-options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 15px;
        }
        .answer-btn {
          flex: 1 0 auto;
          min-width: 80px;
          padding: 8px 12px;
          font-size: 0.85rem;
          font-weight: 500;
          color: #664DE5;
          background-color: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .answer-btn:hover {
          background-color: #f3f4f6;
        }
        .answer-btn.selected {
          background-color: #664DE5;
          color: #ffffff;
          border-color: #664DE5;
        }
        @media (min-width: 768px) {
          .header-bar {
            padding: 12px 16px;
          }
        }
      `}</style>

      {/* Unit Details Form */}
      <div className="unit-details-container mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Company Name</label>
            <Input type="text" placeholder="Enter company name" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Representative Name</label>
            <Input type="text" placeholder="Enter representative's name" />
          </div>
          <div className="col-12">
            <label className="form-label">Complete Address</label>
            <Input type="text" placeholder="Enter full address" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Contact Number</label>
            <Input type="text" placeholder="Enter contact number" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email ID</label>
            <Input type="email" placeholder="Enter email address" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Geotag Location</label>
            <div className="flex gap-2">
              <Input type="text" value={geotagLocation} placeholder="Click to fetch location" readOnly />
              <Button onClick={handleGetLocation}>Get Location</Button>
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label">Audit Start Time</label>
            <Input type="text" value={auditStartTime} readOnly />
          </div>
        </div>

        <hr className="my-4" />

        {/* Audit Controls and Timers */}
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <div className="flex gap-2">
              {!isAuditStarted && (
                <Button onClick={handleStartAudit} className="bg-green-600">
                  ▶ Start Audit
                </Button>
              )}
              {isAuditStarted && !isAuditPaused && (
                <Button onClick={() => setIsAuditPaused(true)} className="bg-yellow-600">
                  ⏸ Pause Audit
                </Button>
              )}
              {isAuditPaused && (
                <Button onClick={() => setIsAuditPaused(false)} className="bg-blue-600">
                  ▶ Resume Audit
                </Button>
              )}
              {isAuditStarted && (
                <Button onClick={() => alert("Audit Completed!")} className="bg-primary">
                  ✓ Complete Audit
                </Button>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="timer-display-container">
              <div className="row">
                <div className="col-4">
                  <div className="timer-label">Active Time</div>
                  <div className="timer-value">{formatTime(activeTimer)}</div>
                </div>
                <div className="col-4">
                  <div className="timer-label">Pause Time</div>
                  <div className="timer-value">{formatTime(pauseTimer)}</div>
                </div>
                <div className="col-4">
                  <div className="timer-label">Total Time</div>
                  <div className="timer-value">{formatTime(totalTimer)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="audit-container">
        {checklistData.categories.map((category) => (
          <div key={category.id} className="main-page-block">
            <div className="header-bar" data-id={category.id} onClick={() => toggleSection("category", category.id)}>
              <div className="flex items-center flex-1">
                <span className="icon-chevron collapsed">►</span>
                <h3 className="m-0 font-semibold">{category.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Score: 0/0 (0%)</span>
              </div>
            </div>
            <div className="content-area" id={`${category.id}-content`}>
              {category.subcategories.map((subcategory) => (
                <div key={subcategory.id}>
                  <div className="header-bar" data-id={subcategory.id} onClick={() => toggleSection("subcategory", subcategory.id)}>
                    <div className="flex items-center flex-1">
                      <span className="icon-chevron collapsed">►</span>
                      <h4 className="m-0 font-semibold text-sm">{subcategory.title}</h4>
                    </div>
                  </div>
                  <div className="content-area" id={`${subcategory.id}-content`}>
                    {subcategory.questions.map((question) => (
                      <div key={question.id} className={`question-block risk-${question.riskLevel}`}>
                        <div className="mb-3">
                          <p className="font-medium">{question.text}</p>
                          <div className="text-sm text-gray-600">Marks: --/{question.maxMarks} (--%)</div>
                        </div>
                        <div className="answer-options">
                          {question.answers.map((answer, idx) => (
                            <button
                              key={idx}
                              className="answer-btn"
                              onClick={() => {
                                // Handle answer selection
                              }}
                            >
                              {answer.text}
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-4 pt-2 border-t">
                          <button className="text-primary text-sm">💬 Add Comment</button>
                          <button className="text-primary text-sm">➕ Create action</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <div
        style={{
          position: "fixed",
          bottom: floatingButtonPos.y > 0 ? `${floatingButtonPos.y}px` : "20px",
          right: floatingButtonPos.x > 0 ? `${floatingButtonPos.x}px` : "20px",
          width: "56px",
          height: "56px",
          backgroundColor: "#664DE5",
          color: "white",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2), 0 6px 20px rgba(0,0,0,0.19)",
          cursor: isDragging ? "grabbing" : "grab",
          zIndex: 1050,
          userSelect: "none",
        }}
        onMouseDown={handleFloatingButtonDrag}
        onClick={() => !isDragging && setGlobalNoteModal(true)}
      >
        📝
      </div>

      {/* Global Notes Modal */}
      {globalNoteModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1060]"
          onClick={() => setGlobalNoteModal(false)}
        >
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h5 className="text-xl font-bold mb-4">Notes</h5>
            <div className="space-y-4">
              <div>
                <h6 className="font-semibold mb-2">Best Practice/Improvement</h6>
                <Textarea rows={4} placeholder="Enter best practices or improvements..." />
              </div>
              <div>
                <h6 className="font-semibold mb-2">Opportunity for Improvement</h6>
                <Textarea rows={4} placeholder="Enter opportunities for improvement..." />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setGlobalNoteModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setGlobalNoteModal(false)}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
