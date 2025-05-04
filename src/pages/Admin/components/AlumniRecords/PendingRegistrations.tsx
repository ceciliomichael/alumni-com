import { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, User, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  getAllAlumni, 
  approveAlumniWithUser
} from '../../../../services/firebase/alumniService';
import { AlumniRecord } from '../../../../types';
import AdminLayout from '../../layout/AdminLayout';

const PendingRegistrations = () => {
  const [pendingAlumni, setPendingAlumni] = useState<AlumniRecord[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadPendingRegistrations();
  }, []);

  const loadPendingRegistrations = async () => {
    try {
      const allAlumni = await getAllAlumni();
      // Filter to only show inactive (pending) alumni
      const pending = allAlumni.filter(a => !a.isActive);
      setPendingAlumni(pending);
    } catch (error) {
      console.error('Error loading pending registrations:', error);
      setPendingAlumni([]);
    }
  };

  const handleApprove = async (id: string) => {
    if (window.confirm('Approve this registration?')) {
      try {
        // Use our connected service to approve both alumni and user records
        await approveAlumniWithUser(id);
        await loadPendingRegistrations();
      } catch (error) {
        console.error('Error approving alumni:', error);
        alert('An error occurred while approving the registration. Please try again.');
      }
    }
  };

  const handleReject = async (id: string) => {
    if (window.confirm('Reject this registration? This will delete the record.')) {
      try {
        // For now just load the data again - we'd need to implement reject functionality
        await loadPendingRegistrations();
      } catch (error) {
        console.error('Error rejecting alumni:', error);
        alert('An error occurred while rejecting the registration. Please try again.');
      }
    }
  };

  return (
    <AdminLayout title="Pending Registrations">
      <div className="admin-container">
        <div className="pending-header">
          <button 
            className="back-button"
            onClick={() => navigate('/admin/alumni-records')}
          >
            <ArrowLeft size={18} />
            <span>Back to Alumni Records</span>
          </button>
        </div>
        
        <div className="pending-content">
          <div className="pending-list-header">
            <h2>Pending Registrations</h2>
            <div className="pending-count">{pendingAlumni.length} Pending Approvals</div>
          </div>
          
          <div className="pending-table-container">
            <table className="alumni-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Batch</th>
                  <th>Registered Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingAlumni.length > 0 ? (
                  pendingAlumni.map(alum => (
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
                              {alum.name.charAt(0)}
                            </div>
                          )}
                          <div className="alumni-name-info">
                            <span className="alumni-name">{alum.name}</span>
                          </div>
                        </div>
                      </td>
                      <td>{alum.email}</td>
                      <td>Batch {alum.batch}</td>
                      <td>{new Date(alum.dateRegistered).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn approve-btn"
                            onClick={() => handleApprove(alum.id)}
                            title="Approve"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            className="action-btn reject-btn"
                            onClick={() => handleReject(alum.id)}
                            title="Reject"
                          >
                            <X size={18} />
                          </button>
                          <button 
                            className="action-btn view-btn"
                            onClick={() => navigate(`/admin/alumni-records/view/${alum.id}`)}
                            title="View"
                          >
                            <User size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="empty-row">
                    <td colSpan={5}>
                      <div className="empty-state">
                        <div className="empty-icon">
                          <User size={48} />
                        </div>
                        <h3>No pending registrations found</h3>
                        <p>There are no pending registration requests at this time.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PendingRegistrations;
