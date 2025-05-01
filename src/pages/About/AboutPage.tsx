import { useState, useEffect } from 'react';
import { Info, FileText, Users, MapPin, Mail, Phone, Globe } from 'lucide-react';
import ImagePlaceholder from '../../components/ImagePlaceholder';
import './About.css';

type TabType = 'history' | 'vision' | 'organization' | 'contact';

interface AboutPageProps {
  initialTab?: TabType;
}

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface MissionItem {
  title: string;
  description: string;
}

interface OrgPosition {
  title: string;
  name: string;
  batch: string;
}

interface ContactItem {
  type: 'address' | 'email' | 'phone' | 'social';
  icon: React.ReactNode;
  title: string;
  details: string[];
}

const AboutPage = ({ initialTab = 'history' }: AboutPageProps) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  
  // Update active tab when initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  
  // These state variables would be populated from backend in a real app
  const [historyItems, setHistoryItems] = useState<TimelineItem[]>([]);
  const [visionText, setVisionText] = useState<string[]>([]);
  const [missionItems, setMissionItems] = useState<MissionItem[]>([]);
  const [orgPositions, setOrgPositions] = useState<{
    president: OrgPosition | null;
    vicePresident: OrgPosition | null;
    executives: OrgPosition[];
    officers: OrgPosition[];
  }>({
    president: null,
    vicePresident: null,
    executives: [],
    officers: []
  });
  const [contactItems, setContactItems] = useState<ContactItem[]>([]);
  
  return (
    <div className="about-container">
      <div className="about-header">
        <div className="about-title">
          <Info size={24} />
          <h1>About Us</h1>
        </div>
      </div>
      
      <div className="about-tabs">
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <FileText size={18} />
          <span>History</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'vision' ? 'active' : ''}`}
          onClick={() => setActiveTab('vision')}
        >
          <Globe size={18} />
          <span>Vision &amp; Mission</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'organization' ? 'active' : ''}`}
          onClick={() => setActiveTab('organization')}
        >
          <Users size={18} />
          <span>Organizational Chart</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          <Mail size={18} />
          <span>Contact Us</span>
        </button>
      </div>
      
      <div className="about-content">
        {activeTab === 'history' && (
          <div className="history-section">
            <h2>Our History</h2>
            <div className="history-image">
              <ImagePlaceholder
                shape="rectangle"
                height="300px"
                color="#3498db"
                recommendedSize="1200x400px"
                text="Alumni History"
              />
            </div>
            
            {historyItems.length > 0 ? (
              <div className="history-timeline">
                {historyItems.map((item, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-year">{item.year}</div>
                    <div className="timeline-content">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-timeline">
                <div className="placeholder-timeline">
                  {[2010, 2015, 2020, 2023].map((year, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-year">{year}</div>
                      <div className="timeline-content">
                        <ImagePlaceholder
                          shape="rectangle"
                          width="100%"
                          height="120px"
                          color={index % 2 === 0 ? "#e74c3c" : "#2ecc71"}
                          recommendedSize="800x300px"
                        />
                        <h3>History Milestone {index + 1}</h3>
                        <p>Historical information will be available here. This section will show the important events and milestones in our alumni association's timeline.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'vision' && (
          <div className="vision-section">
            <div className="vision-block">
              <h2>Our Vision</h2>
              {visionText.length > 0 ? (
                <div className="vision-content">
                  {visionText.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>Our vision statement will be available soon.</p>
                </div>
              )}
            </div>
            
            <div className="mission-block">
              <h2>Our Mission</h2>
              {missionItems.length > 0 ? (
                <div className="mission-content">
                  {missionItems.map((item, index) => (
                    <div key={index} className="mission-item">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>Our mission details will be available soon.</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'organization' && (
          <div className="organization-section">
            <h2>Organizational Structure</h2>
            <p className="org-intro">Our alumni association is structured to ensure efficient operations and comprehensive representation of all batches and interest groups.</p>
            
            {orgPositions.president || orgPositions.vicePresident || orgPositions.executives.length > 0 || orgPositions.officers.length > 0 ? (
              <div className="org-chart">
                {orgPositions.president && (
                  <div className="org-level">
                    <div className="org-position president">
                      <h3>{orgPositions.president.title}</h3>
                      <p>{orgPositions.president.name} (Batch {orgPositions.president.batch})</p>
                    </div>
                  </div>
                )}
                
                {orgPositions.vicePresident && (
                  <div className="org-level">
                    <div className="org-position">
                      <h3>{orgPositions.vicePresident.title}</h3>
                      <p>{orgPositions.vicePresident.name} (Batch {orgPositions.vicePresident.batch})</p>
                    </div>
                  </div>
                )}
                
                {orgPositions.executives.length > 0 && (
                  <div className="org-level three-columns">
                    {orgPositions.executives.map((exec, index) => (
                      <div key={index} className="org-position">
                        <h3>{exec.title}</h3>
                        <p>{exec.name} (Batch {exec.batch})</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {orgPositions.officers.length > 0 && (
                  <div className="org-level four-columns">
                    {orgPositions.officers.map((officer, index) => (
                      <div key={index} className="org-position">
                        <h3>{officer.title}</h3>
                        <p>{officer.name} (Batch {officer.batch})</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <p>Organization chart information will be available soon.</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'contact' && (
          <div className="contact-section">
            <h2>Contact Us</h2>
            <p className="contact-intro">We'd love to hear from you! Get in touch with the Alumni Association through any of the channels below.</p>
            
            {contactItems.length > 0 ? (
              <div className="contact-grid">
                {contactItems.map((item, index) => (
                  <div key={index} className="contact-card">
                    <div className="contact-icon">
                      {item.icon}
                    </div>
                    <h3>{item.title}</h3>
                    {item.details.map((detail, i) => (
                      <p key={i}>{detail}</p>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Contact information will be available soon.</p>
              </div>
            )}
            
            <div className="contact-form-section">
              <h3>Send us a Message</h3>
              <form className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" placeholder="Your name" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" placeholder="Your email" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input type="text" id="subject" name="subject" placeholder="Message subject" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows={5} placeholder="Your message" required></textarea>
                </div>
                
                <button type="submit" className="send-message-btn">Send Message</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutPage; 