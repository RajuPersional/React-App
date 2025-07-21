const ProfContainer = ({ 
  user, 
  isEditing, 
  formData, 
  errors, 
  handleInputChange,
  fieldName, 
  label 
}) => {
  const fieldId = `profile-${fieldName}${isEditing ? '-input' : '-display'}`; // its Dones not impact the code you can Give the random id but should be unique
  const fieldValue = isEditing ? formData : user[fieldName];// its is used to display the data in the Fields 
  
  return (
    !isEditing? // initally the isEditing is false (converted into to true because of the ! operator) so it will display the data in the Fields 
    (
      <div className="detail-group">
        <span className="detail-label">{label}</span>
        <span className="detail-value" id={fieldId}>{fieldValue}</span>
      </div>
    ):(
    <div className="detail-group">
      <span className="detail-label">{label}</span>
      <div className="input-wrapper">
        <input 
          type={fieldName === 'email' ? 'email' : //1* 
                fieldName === 'date_of_birth' ? 'date' : 'text'}//2*
          id={fieldId}
          className={`profile-input ${errors ? 'error' : ''}`}
          value={formData}              // this will Diplay the valye here 
          onChange={handleInputChange}  // this is used to update the value from the input field
          placeholder={`Enter your ${label.toLowerCase()}`}
          title={errors || ''} // 2*
        />
       
        
        {errors && <span className="error-message">{errors}</span>}
      </div>
    </div> 
    ) 
  );
};

export default ProfContainer;