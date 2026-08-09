import React from "react";
import UploadPhoto from "./UploadPhoto";
import "../styles/UserForm.css";

const UserForm = ({
  formData,
  onFormChange,
  photoUrl,
  onPhotoSelect,
  photoOffset,
  onOffsetChange,
  onSubmit,
  formError
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormChange({
      ...formData,
      [name]: value
    });
  };

  return (
    <form className="user-form" onSubmit={onSubmit} noValidate>
      {/* 1. Photo Upload with Live Crop Preview */}
      <UploadPhoto
        photoUrl={photoUrl}
        onPhotoSelect={onPhotoSelect}
        photoOffset={photoOffset}
        onOffsetChange={onOffsetChange}
      />

      {/* 2. Full Name Input */}
      <div className={`form-group ${formError && !formData.name.trim() ? "has-error" : ""}`}>
        <label className="form-label" htmlFor="name-input">
          Full Name
        </label>
        <input
          id="name-input"
          type="text"
          name="name"
          placeholder="e.g. Satoshi Nakamoto"
          value={formData.name || ""}
          onChange={handleInputChange}
          className="form-input"
          maxLength={30}
          autoComplete="off"
          required
        />
      </div>

      {/* 3. Stack / Role Input */}
      <div className={`form-group ${formError && !formData.stackRole.trim() ? "has-error" : ""}`}>
        <label className="form-label" htmlFor="stack-role-input">
          Stack / Role
        </label>
        <input
          id="stack-role-input"
          type="text"
          name="stackRole"
          placeholder="e.g. Full-Stack / Rust / AI"
          value={formData.stackRole || ""}
          onChange={handleInputChange}
          className="form-input"
          maxLength={35}
          autoComplete="off"
          required
        />
      </div>

      {/* Inline Validation error if any */}
      {formError && <div className="form-error-msg">{formError}</div>}

      {/* Primary Submit Action */}
      <button type="submit" className="btn-primary-generate">
        <span>Generate Pass</span>
        <svg className="btn-arrow-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </form>
  );
};

export default UserForm;
