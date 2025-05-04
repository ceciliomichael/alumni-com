import { useState, useEffect } from 'react';
import { Search, Plus, User, X, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  getAllOfficers, 
  searchOfficers, 
  initializeOfficerData,
  deleteOfficer,
  removeOfficerInfoFromUser
} from '../../services/localStorage/officerService';
import { getAlumniById } from '../../services/localStorage/alumniService';
import { OfficerPosition } from '../../../../types';
import AdminLayout from '../../layout/AdminLayout';
import './AlumniOfficers.css';

// Dialog props interface
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  officerName: string;
  position: string;
}

// Confirmation Dialog Component
const ConfirmDialog = ({ isOpen, onClose, onConfirm, officerName, position }: ConfirmDialogProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <div className="confirm-dialog-header">
          <div className="confirm-dialog-icon">
            <AlertTriangle size={24} />
          </div>
          <h3>Remove Officer</h3>
          <button className="confirm-dialog-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="confirm-dialog-content">
          <p>Are you sure you want to remove <strong>{officerName}</strong> from the position of <strong>{position}</strong>?</p>
          <p className="confirm-dialog-warning">This action cannot be undone.</p>
        </div>
        <div className="confirm-dialog-actions">
          <button className="confirm-dialog-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-dialog-confirm" onClick={onConfirm}>
            Remove Officer
          </button>
        </div>
      </div>
    </div>
  );
};

const AlumniOfficers = () => {
  const [officers, setOfficers] = useState<OfficerPosition[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'main' | 'batch'>('all');
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    officerId: '',
    officerName: '',
    position: '',
    alumniId: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize sample data if empty
    initializeOfficerData();
    
    // Load officers data
    loadOfficersData();
  }, []);

  const loadOfficersData = () => {
    setLoading(true);
    const allOfficers = getAllOfficers();
    setOfficers(allOfficers);
    setLoading(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      const results = searchOfficers(query);
      setOfficers(results);
    } else {
      loadOfficersData();
    }
  };
  
  const handleEdit = (id: string) => {
    navigate(`/admin/alumni-officers/edit/${id}`);
  };
  
  const openDeleteDialog = (officer: OfficerPosition) => {
    const alumniName = getAlumniName(officer.alumniId);
    setDeleteDialog({
      isOpen: true,
      officerId: officer.id,
      officerName: alumniName,
      position: officer.title,
      alumniId: officer.alumniId
    });
  };
  
  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      officerId: '',
      officerName: '',
      position: '',
      alumniId: ''
    });
  };
  
  const confirmDelete = () => {
    // Remove officer info from user first
    removeOfficerInfoFromUser(deleteDialog.alumniId);
    
    // Then delete the officer position
    deleteOfficer(deleteDialog.officerId);
    
    // Reload data and close dialog
    loadOfficersData();
    closeDeleteDialog();
  };

  // Helper function to get alumni name by ID
  const getAlumniName = (alumniId: string): string => {
    const alumni = getAlumniById(alumniId);
    return alumni ? alumni.name : 'Unknown Alumni';
  };

  const getFilteredOfficers = () => {
    if (filter === 'main') {
      return officers.filter(officer => !officer.batchYear);
    } else if (filter === 'batch') {
      return officers.filter(officer => officer.batchYear);
    }
    return officers;
  };

  const formatDateRange = (startDate: string, endDate?: string): string => {
    const formattedStart = new Date(startDate).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short'
    });
    
    if (!endDate) {
      return `${formattedStart} - Present`;
    }
    
    const formattedEnd = new Date(endDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
    
    return `${formattedStart} - ${formattedEnd}`;
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <AdminLayout title="Alumni Officers">
      <div className="admin-container">
        <div className="alumni-records-header">
          <div className="search-filter-container">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search officers..."
                className="search-input"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="filter-container">
              <select 
                className="filter-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'main' | 'batch')}
              >
                <option value="all">All Officers</option>
                <option value="main">Main Officers</option>
                <option value="batch">Batch Officers</option>
              </select>
            </div>
          </div>
          
          <button 
            className="add-alumni-button"
            onClick={() => navigate('/admin/alumni-officers/add')}
          >
            <Plus size={18} />
            <span>Add Officer</span>
          </button>
        </div>
        
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Alumni Officers</h2>
          </div>
          
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading officers...</p>
            </div>
          ) : getFilteredOfficers().length > 0 ? (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Position</th>
                    {filter !== 'main' && <th>Batch</th>}
                    <th>Officer Name</th>
                    <th>Term</th>
                    <th>Options</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredOfficers().map(officer => (
                    <tr key={officer.id}>
                      <td>
                        <span className="officer-title">{officer.title}</span>
                      </td>
                      {filter !== 'main' && (
                        <td>
                          {officer.batchYear ? (
                            <span className="batch-badge">Batch {officer.batchYear}</span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                      )}
                      <td>
                        <div className="alumni-name-cell">
                          <div className="alumni-avatar-placeholder">
                            {getInitials(getAlumniName(officer.alumniId))}
                          </div>
                          <div className="alumni-name-info">
                            <span className="alumni-name">{getAlumniName(officer.alumniId)}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="term-dates">
                          {formatDateRange(officer.startDate, officer.endDate)}
                        </div>
                      </td>
                      <td>
                        <div className="officer-actions">
                          <button 
                            onClick={() => handleEdit(officer.id)}
                            className="officer-action-btn edit"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => openDeleteDialog(officer)}
                            className="officer-action-btn delete"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <User size={32} />
              </div>
              <h3>No Officers Found</h3>
              <p>{filter === 'all' ? 'There are no officers assigned yet.' : 
                   filter === 'main' ? 'There are no main officers assigned yet.' :
                   'There are no batch officers assigned yet.'}</p>
              <button 
                className="primary-btn"
                onClick={() => navigate('/admin/alumni-officers/add')}
              >
                Add Officer
              </button>
            </div>
          )}
        </div>
      </div>
      
      <ConfirmDialog 
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        officerName={deleteDialog.officerName}
        position={deleteDialog.position}
      />
    </AdminLayout>
  );
};

export default AlumniOfficers; 