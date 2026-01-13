
import React, { useState, useEffect } from 'react';

const RequireEvidenceModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  selectedResponse = "No",
  initialConfig 
}) => {
  const [evidenceNotes, setEvidenceNotes] = useState(initialConfig?.notes || false);
  const [evidenceMedia, setEvidenceMedia] = useState(initialConfig?.media || false);

  useEffect(() => {
    if (isOpen) {
      setEvidenceNotes(initialConfig?.notes || false);
      setEvidenceMedia(initialConfig?.media || false);
    }
  }, [isOpen, initialConfig]);

  const handleSave = () => {
    onSave({
      notes: evidenceNotes,
      media: evidenceMedia
    });
    onClose();
  };

  return (
    <div className={`logic-config-side-panel ${isOpen ? "is-open" : ""}`}>
      <div className="panel-content">
        <div className="panel-header">
          <h2>Require evidence</h2>
        </div>
        <div className="panel-body">
          <p className="text-sm text-gray-600 mb-6">Choose the evidence that'll be required when this answer is selected.</p>
          <div className="info-bar">
            <i className="fas fa-random text-gray-400"></i>
            <span className="text-sm text-gray-600">If answer is</span>
            <span className="response-pill no">{selectedResponse}</span>
            <span className="text-sm text-gray-600">require</span>
          </div>
          <div className="checkbox-group mt-6">
            <label className="hover:bg-gray-50 rounded-md px-2">
              <input
                type="checkbox"
                checked={evidenceNotes}
                onChange={(e) => setEvidenceNotes(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700 ml-2">Notes</span>
            </label>
            <label className="hover:bg-gray-50 rounded-md px-2">
              <input
                type="checkbox"
                checked={evidenceMedia}
                onChange={(e) => setEvidenceMedia(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700 ml-2">Media</span>
            </label>
          </div>
        </div>
        <div className="panel-footer">
          <button className="btn-save-apply" onClick={handleSave}>Save and apply</button>
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default RequireEvidenceModal;
