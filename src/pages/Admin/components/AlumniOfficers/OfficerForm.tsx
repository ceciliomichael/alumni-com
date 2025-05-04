import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { 
  addOfficer, 
  getOfficerById, 
  updateOfficer,
  initializeOfficerData,
  updateUserWithOfficerInfo
} from '../../services/localStorage/officerService';
import { 
  getAllAlumni, 
  initializeAlumniData 
} from '../../services/localStorage/alumniService';
import { OfficerPosition, AlumniRecord } from '../../../../types';
import AdminLayout from '../../layout/AdminLayout';
import './AlumniOfficers.css';

const OFFICER_POSITIONS = [
  'President',
  'Vice President',
  'Secretary',
  'Treasurer',
  'Events Coordinator',
  'Alumni Recruitment Officer',
  'Communications Director',
  'Career Development Officer',
  'Batch President'
];

const OfficerForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [allAlumni, setAllAlumni] = useState<AlumniRecord[]>([]);
  const [formData, setFormData] = useState<Omit<OfficerPosition, 'id'>>({
    title: '',
    alumniId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    batchYear: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Initialize sample data if empty
    initializeOfficerData();
    initializeAlumniData();
    
    // Load all alumni for the dropdown
    const alumni = getAllAlumni();
    setAllAlumni(alumni);
    
    // If editing, fetch officer data
    if (isEditing && id) {
      const officerData = getOfficerById(id);
      
      if (officerData) {
        // Format dates for form inputs
        const formattedData = {
          ...officerData,
          startDate: new Date(officerData.startDate).toISOString().split('T')[0],
          endDate: officerData.endDate 
            ? new Date(officerData.endDate).toISOString().split('T')[0] 
            : ''
        };
        
        // Remove id as we don't need it in the form
        const { id: _, ...dataWithoutId } = formattedData;
        setFormData(dataWithoutId);
      } else {
        // Handle case where officer record doesn't exist
        navigate('/admin/alumni-officers');
      }
    }
    
    setLoading(false);
  }, [id, isEditing, navigate]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Special handling for batch president
    if (name === 'title' && value === 'Batch President') {
      if (!formData.batchYear) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          batchYear: '' // Ensure this field is available
        }));
      }
    }
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title) {
      newErrors.title = 'Position title is required';
    }
    
    if (!formData.alumniId) {
      newErrors.alumniId = 'Please select an alumni';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (formData.title === 'Batch President' && !formData.batchYear) {
      newErrors.batchYear = 'Batch year is required for Batch President';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format dates for storage
      const formattedData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate 
          ? new Date(formData.endDate).toISOString()
          : undefined
      };
      
      let officerId: string;
      
      if (isEditing && id) {
        const updated = updateOfficer(id, formattedData);
        if (updated) {
          officerId = updated.id;
        } else {
          throw new Error("Failed to update officer");
        }
      } else {
        const newOfficer = addOfficer(formattedData);
        officerId = newOfficer.id;
      }
      
      // Update the user account with officer information
      updateUserWithOfficerInfo(officerId);
      
      navigate('/admin/alumni-officers');
    } catch (error) {
      console.error('Error saving officer position:', error);
      setIsSubmitting(false);
    }
  };
  
  const isBatchPosition = formData.title === 'Batch President';
  
  if (loading) {
    return (
      <AdminLayout title={isEditing ? 'Edit Officer' : 'Add Officer'}>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title={isEditing ? 'Edit Officer' : 'Add Officer'}>
      <div className="admin-container">
        <div className="alumni-records-header">
          <button 
            className="back-button"
            onClick={() => navigate('/admin/alumni-officers')}
          >
            <ArrowLeft size={20} />
            <span>Back to Officers</span>
          </button>
        </div>
        
        <div className="admin-card">
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-section">
                <label htmlFor="title" className="admin-form-label">Position Title *</label>
                <select
                  id="title"
                  name="title"
                  className={`admin-form-input ${errors.title ? 'admin-input-error' : ''}`}
                  value={formData.title}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="">Select Position</option>
                  {OFFICER_POSITIONS.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
                {errors.title && <div className="admin-form-error">{errors.title}</div>}
              </div>
              
              {isBatchPosition && (
                <div className="form-section">
                  <label htmlFor="batchYear" className="admin-form-label">Batch Year *</label>
                  <input
                    type="text"
                    id="batchYear"
                    name="batchYear"
                    className={`admin-form-input ${errors.batchYear ? 'admin-input-error' : ''}`}
                    value={formData.batchYear || ''}
                    onChange={handleChange}
                    placeholder="Enter batch year (e.g., 2020)"
                    disabled={isSubmitting}
                  />
                  {errors.batchYear && <div className="admin-form-error">{errors.batchYear}</div>}
                </div>
              )}
              
              <div className="form-section">
                <label htmlFor="alumniId" className="admin-form-label">Assigned Alumni *</label>
                <select
                  id="alumniId"
                  name="alumniId"
                  className={`admin-form-input ${errors.alumniId ? 'admin-input-error' : ''}`}
                  value={formData.alumniId}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="">Select Alumni</option>
                  {allAlumni
                    .filter(alumni => alumni.isActive)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(alumni => (
                      <option key={alumni.id} value={alumni.id}>
                        {alumni.name} (Batch {alumni.batch})
                      </option>
                    ))
                  }
                </select>
                {errors.alumniId && <div className="admin-form-error">{errors.alumniId}</div>}
              </div>
              
              <div className="form-section">
                <label htmlFor="startDate" className="admin-form-label">Start Date *</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className={`admin-form-input ${errors.startDate ? 'admin-input-error' : ''}`}
                  value={formData.startDate}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.startDate && <div className="admin-form-error">{errors.startDate}</div>}
              </div>
              
              <div className="form-section">
                <label htmlFor="endDate" className="admin-form-label">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="admin-form-input"
                  value={formData.endDate || ''}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <div className="form-hint">Leave blank for current position</div>
              </div>
            </div>
            
            <div className="admin-form-actions">
              <button 
                type="button"
                className="admin-form-cancel"
                onClick={() => navigate('/admin/alumni-officers')}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                className="admin-form-submit"
                disabled={isSubmitting}
              >
                <Save size={18} />
                <span>{isSubmitting ? 'Saving...' : (isEditing ? 'Update' : 'Save')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OfficerForm; 