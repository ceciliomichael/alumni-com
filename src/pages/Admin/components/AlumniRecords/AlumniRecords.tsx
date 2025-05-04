import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Eye, Filter, Check, User, X, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  getAllAlumni, 
  searchAlumni, 
  deleteAlumni, 
  initializeAlumniData 
} from '../../services/localStorage/alumniService';
import { AlumniRecord } from '../../../../types';
import AdminLayout from '../../layout/AdminLayout';

// Confirmation Dialog Component
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  alumniName: string;
}

const ConfirmDialog = ({ isOpen, onClose, onConfirm, alumniName }: ConfirmDialogProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <div className="confirm-dialog-header">
          <div className="confirm-dialog-icon">
            <AlertTriangle size={24} />
          </div>
          <h3>Remove Alumni Record</h3>
          <button className="confirm-dialog-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="confirm-dialog-content">
          <p>Are you sure you want to remove <strong>{alumniName}</strong>'s record?</p>
          <p className="confirm-dialog-warning">This action cannot be undone.</p>
        </div>
        <div className="confirm-dialog-actions">
          <button className="confirm-dialog-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-dialog-confirm" onClick={onConfirm}>
            Remove Record
          </button>
        </div>
      </div>
    </div>
  );
};

const AlumniRecords = () => {
  const [alumni, setAlumni] = useState<AlumniRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [batchFilter, setBatchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [uniqueBatches, setUniqueBatches] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    alumniId: '',
    alumniName: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize sample data if empty
    initializeAlumniData();
    
    // Load alumni data
    loadAlumniData();
  }, []);

  const loadAlumniData = () => {
    setLoading(true);
    const allAlumni = getAllAlumni();
    setAlumni(allAlumni);
    
    // Extract unique batch years
    const batches = [...new Set(allAlumni.map(a => a.batch))];
    setUniqueBatches(batches);
    setLoading(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      const results = searchAlumni(query);
      setAlumni(results);
    } else {
      loadAlumniData();
    }
  };

  const openDeleteDialog = (alumni: AlumniRecord) => {
    setDeleteDialog({
      isOpen: true,
      alumniId: alumni.id,
      alumniName: alumni.name
    });
  };
  
  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      alumniId: '',
      alumniName: ''
    });
  };
  
  const confirmDelete = () => {
    deleteAlumni(deleteDialog.alumniId);
    loadAlumniData();
    closeDeleteDialog();
  };

  const applyFilters = () => {
    setLoading(true);
    let filteredAlumni = getAllAlumni();
    
    // Apply batch filter
    if (batchFilter !== 'all') {
      filteredAlumni = filteredAlumni.filter(alumni => alumni.batch === batchFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filteredAlumni = filteredAlumni.filter(alumni => alumni.isActive === isActive);
    }
    
    // Apply search query if it exists
    if (searchQuery.trim()) {
      filteredAlumni = filteredAlumni.filter(alumni => 
        alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alumni.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setAlumni(filteredAlumni);
    setLoading(false);
  };

  useEffect(() => {
    applyFilters();
  }, [batchFilter, statusFilter]);

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <AdminLayout title="Alumni Records">
      <div className="admin-container">
        <div className="alumni-records-header">
          <div className="search-filter-container">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search alumni..."
                className="search-input"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            
            <div className="filter-container">
              <select 
                className="filter-select"
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
              >
                <option value="all">All Batches</option>
                {uniqueBatches.map(batch => (
                  <option key={batch} value={batch}>Batch {batch}</option>
                ))}
              </select>
              
              <select 
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              
              <Link to="/admin/alumni-records/by-batch" className="filter-button">
                <Filter size={18} />
                <span>View By Batch</span>
              </Link>
              
              <Link to="/admin/pending-registrations" className="filter-button pending-button">
                <Check size={18} />
                <span>Pending</span>
              </Link>
            </div>
          </div>
          
          <button 
            className="add-alumni-button"
            onClick={() => navigate('/admin/alumni-records/add')}
          >
            <Plus size={18} />
            <span>Add Alumni</span>
          </button>
        </div>
        
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Alumni List</h2>
            <div className="records-count">{alumni.length} Records Found</div>
          </div>
          
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading alumni records...</p>
            </div>
          ) : alumni.length > 0 ? (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Batch</th>
                    <th>Status</th>
                    <th>Registered</th>
                    <th>Options</th>
                  </tr>
                </thead>
                <tbody>
                  {alumni.map(alum => (
                    <tr key={alum.id}>
                      <td>
                        <div className="alumni-name-cell">
                          {alum.profileImage ? (
                            <img 
                              src={alum.profileImage} 
                              alt={alum.name} 
                              className="alumni-avatar" 
                            />
                          ) : (
                            <div className="alumni-avatar-placeholder">
                              {getInitials(alum.name)}
                            </div>
                          )}
                          <div className="alumni-name-info">
                            <span className="alumni-name">{alum.name}</span>
                            {alum.position && (
                              <span className="alumni-position">{alum.position}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{alum.email}</td>
                      <td>
                        <span className="batch-badge">Batch {alum.batch}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${alum.isActive ? 'status-active' : 'status-inactive'}`}>
                          {alum.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{new Date(alum.dateRegistered).toLocaleDateString()}</td>
                      <td>
                        <div className="alumni-actions">
                          <button 
                            className="alumni-action-btn view"
                            onClick={() => navigate(`/admin/alumni-records/view/${alum.id}`)}
                          >
                            View
                          </button>
                          <button 
                            className="alumni-action-btn edit"
                            onClick={() => navigate(`/admin/alumni-records/edit/${alum.id}`)}
                          >
                            Edit
                          </button>
                          <button 
                            className="alumni-action-btn delete"
                            onClick={() => openDeleteDialog(alum)}
                          >
                            <X size={16} />
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
              <h3>No Alumni Records Found</h3>
              <p>Start by adding a new alumni record or approve pending registrations.</p>
              <button 
                className="primary-btn"
                onClick={() => navigate('/admin/alumni-records/add')}
              >
                Add Alumni
              </button>
            </div>
          )}
        </div>
      </div>
      
      <ConfirmDialog 
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        alumniName={deleteDialog.alumniName}
      />
    </AdminLayout>
  );
};

export default AlumniRecords; 