
import React, { useState, useEffect } from 'react';

const NotifyModal = ({
  isOpen,
  onClose,
  onSave,
  selectedResponse = "Fail",
  initialConfig,
}) => {
  const [showRecipientPopup, setShowRecipientPopup] = useState(false);
  const [showGroupPopup, setShowGroupPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState(initialConfig?.groups || []);
  const [selectedUsers, setSelectedUsers] = useState(initialConfig?.users || []);
  const [selectedRecipientType, setSelectedRecipientType] = useState(initialConfig?.recipientType || "");
  const [notifySendTime, setNotifySendTime] = useState(initialConfig?.sendTime || "immediately");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      setShowRecipientPopup(false);
      setShowGroupPopup(false);
      setShowUserPopup(false);
      setSearchTerm("");
      if (initialConfig) {
        setSelectedGroups(initialConfig.groups || []);
        setSelectedUsers(initialConfig.users || []);
        setSelectedRecipientType(initialConfig.recipientType || "");
        setNotifySendTime(initialConfig.sendTime || "immediately");
      } else {
        setSelectedGroups([]);
        setSelectedUsers([]);
        setSelectedRecipientType("");
        setNotifySendTime("immediately");
      }
    }
  }, [isOpen, initialConfig]);

  const handleGroupToggle = (groupName) => {
    setSelectedGroups((prev) =>
      prev.includes(groupName)
        ? prev.filter((g) => g !== groupName)
        : [...prev, groupName]
    );
  };

  const handleUserToggle = (userName) => {
    setSelectedUsers((prev) =>
      prev.includes(userName)
        ? prev.filter((u) => u !== userName)
        : [...prev, userName]
    );
  };

  const handleRecipientTypeSelect = (type) => {
    setSelectedRecipientType(type);
    setShowRecipientPopup(false);

    if (type === "groups") {
      setShowGroupPopup(true);
    } else if (type === "users") {
      setShowUserPopup(true);
    }
  };

  const getSelectedRecipientDisplay = () => {
    if (selectedRecipientType === "groups" && selectedGroups.length > 0) {
      return `${selectedGroups.length} group${selectedGroups.length > 1 ? "s" : ""} selected`;
    }
    if (selectedRecipientType === "users" && selectedUsers.length > 0) {
      return `${selectedUsers.length} user${selectedUsers.length > 1 ? "s" : ""} selected`;
    }
    if (selectedRecipientType === "site_group_membership") {
      return "Based on Site & Group membership";
    }
    return "Select users, groups or dynamic notifications";
  };

  const handleSave = () => {
    const config = {
      selectedResponse,
      recipientType: selectedRecipientType,
      groups: selectedRecipientType === "groups" ? selectedGroups : [],
      users: selectedRecipientType === "users" ? selectedUsers : [],
      sendTime: notifySendTime,
    };
    onSave(config);
    onClose();
  };

  const renderGroupPopup = () => {
    if (!showGroupPopup) return null;
    const groups = ["All users (HACCP)", "Kitchen Staff", "Managers", "Front of House"];
    const filteredGroups = groups.filter((group) => group.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
      <div className="selection-popup">
        <div className="sp-header">
          <button className="sp-back-button" onClick={() => { setShowGroupPopup(false); setSearchTerm(""); }}>
            <i className="fas fa-chevron-left mr-2"></i> Back
          </button>
          <h3 className="sp-title text-gray-800 font-semibold">Select group</h3>
        </div>
        <div className="sp-search-container">
          <div className="sp-search-input-wrapper">
            <i className="fas fa-search text-gray-400"></i>
            <input type="search" className="sp-search-input" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="sp-items-section">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">GROUPS</span>
          </div>
          <div id="sgGroupList">
            {filteredGroups.map((group, index) => (
              <div className="sp-item" key={index}>
                <input type="checkbox" id={`group-${index}`} checked={selectedGroups.includes(group)} onChange={() => handleGroupToggle(group)} />
                <label className="text-sm text-gray-700" htmlFor={`group-${index}`}>{group}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="sp-footer">
          <button className="sp-done-button" onClick={() => { setShowGroupPopup(false); setSearchTerm(""); }}>Done</button>
        </div>
      </div>
    );
  };

  const renderUserPopup = () => {
    if (!showUserPopup) return null;
    const users = ["HACCP PRO (you)", "John Doe", "Jane Smith", "Alex Manager"];
    const filteredUsers = users.filter((user) => user.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
      <div className="selection-popup">
        <div className="sp-header">
          <button className="sp-back-button" onClick={() => { setShowUserPopup(false); setSearchTerm(""); }}>
            <i className="fas fa-chevron-left mr-2"></i> Back
          </button>
          <h3 className="sp-title text-gray-800 font-semibold">Select user</h3>
        </div>
        <div className="sp-search-container">
          <div className="sp-search-input-wrapper">
            <i className="fas fa-search text-gray-400"></i>
            <input type="search" className="sp-search-input" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="sp-items-section">
          <div className="text-xs font-bold text-gray-400 tracking-wider mb-4">USERS</div>
          <div id="suUserList">
            {filteredUsers.map((user, index) => (
              <div className="sp-item" key={index}>
                <input type="checkbox" id={`user-${index}`} checked={selectedUsers.includes(user)} onChange={() => handleUserToggle(user)} />
                <label className="text-sm text-gray-700" htmlFor={`user-${index}`}>{user}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="sp-footer">
          <button className="sp-done-button" onClick={() => { setShowUserPopup(false); setSearchTerm(""); }}>Done</button>
        </div>
      </div>
    );
  };

  return (
    <div className={`logic-config-side-panel ${isOpen ? "is-open" : ""}`}>
      <div className="panel-content relative h-full">
        <div className="panel-header">
          <h2>Notify</h2>
        </div>
        <div className="panel-body">
          <div className="notify-panel-body-content">
            {!showGroupPopup && !showUserPopup && (
              <>
                <div className="condition-box">
                  <i className="fas fa-sync-alt condition-icon text-gray-400"></i>
                  <span className="condition-text text-sm text-gray-600">If answer is</span>
                  <span className="condition-status fail">{selectedResponse}</span>
                  <span className="condition-text text-sm text-gray-600">notify</span>
                </div>

                <div className="mb-6 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Send a notification to</label>
                  <div className="select-wrapper relative">
                    <div className="custom-select-display" onClick={() => setShowRecipientPopup(!showRecipientPopup)}>
                      <span className={`${getSelectedRecipientDisplay() === "Select users, groups or dynamic notifications" ? "text-gray-400" : "text-gray-800"}`}>
                        {getSelectedRecipientDisplay()}
                      </span>
                      <span className="text-gray-400">▼</span>
                    </div>
                    {showRecipientPopup && (
                       <div className="recipient-custom-popup">
                       <div className="popup-list">
                         <div className="popup-list-item" onClick={() => handleRecipientTypeSelect("groups")}>
                           <i className="fas fa-users text-purple-600 w-5"></i>
                           <span className="popup-item-text">Groups</span>
                           <span className="popup-item-count">{selectedGroups.length > 0 ? `(${selectedGroups.length})` : ""}</span>
                           <i className="fas fa-chevron-right text-xs text-gray-300"></i>
                         </div>
                         <div className="popup-list-item" onClick={() => handleRecipientTypeSelect("users")}>
                           <i className="fas fa-user text-purple-600 w-5"></i>
                           <span className="popup-item-text">Users</span>
                           <span className="popup-item-count">{selectedUsers.length > 0 ? `(${selectedUsers.length})` : ""}</span>
                           <i className="fas fa-chevron-right text-xs text-gray-300"></i>
                         </div>
                         <div className="popup-list-item" onClick={() => handleRecipientTypeSelect("site_group_membership")}>
                           <i className="fas fa-cogs text-purple-600 w-5"></i>
                           <span className="popup-item-text">Based on Site & Group membership</span>
                         </div>
                       </div>
                       <div className="popup-footer">
                         <button className="popup-done-button" onClick={() => setShowRecipientPopup(false)}>Done</button>
                       </div>
                     </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">When should the notification be sent?</p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="timing" value="immediately" checked={notifySendTime === "immediately"} onChange={(e) => setNotifySendTime(e.target.value)} />
                      <span className="text-sm text-gray-700">Immediately</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="timing" value="on-completion" checked={notifySendTime === "on-completion"} onChange={(e) => setNotifySendTime(e.target.value)} />
                      <span className="text-sm text-gray-700">On inspection completion</span>
                    </label>
                  </div>
                </div>

                <div className="info-box mb-6">
                  <span className="info-icon">ℹ</span>
                  <p className="info-text">
                    Notification recipients will need access to an inspection to view the results. To receive alerts, recipients must have notifications turned on in their settings.
                  </p>
                </div>
              </>
            )}
            {renderGroupPopup()}
            {renderUserPopup()}
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

export default NotifyModal;
