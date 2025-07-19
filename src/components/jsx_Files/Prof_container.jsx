const ProfContainer = ({ 
  user, 
  isEditing, 
  formData, 
  errors, 
  handleInputChange,
  fieldName, 
  label 
}) => {
  const fieldId = `profile-${fieldName}${isEditing ? '-input' : '-display'}`;
  const fieldValue = isEditing ? formData : user[fieldName];
  
  if (!isEditing) {
    return (
      <div className="detail-group">
        <span className="detail-label">{label}</span>
        <span className="detail-value" id={fieldId}>{fieldValue}</span>
      </div>
    );
  }

  return (
    <div className="detail-group">
      <span className="detail-label">{label}</span>
      <div className="input-wrapper">
        <input 
          type={fieldName === 'email' ? 'email' : 
                fieldName === 'date_of_birth' ? 'date' : 'text'}
          id={fieldId}
          className={`profile-input ${errors ? 'error' : ''}`}
          value={formData}
          onChange={handleInputChange}
          placeholder={`Enter your ${label.toLowerCase()}`}
          title={errors || ''}
        />
        {errors && <span className="error-message">{errors}</span>}
      </div>
    </div>
  );
};

export default ProfContainer;