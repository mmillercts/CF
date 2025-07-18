import React from 'react';
import useStore from '../store';
import '../styles/Team_section_styles.css';

const TeamSection = ({ userRole, openModal }) => {
  const { teamContent } = useStore();

  // Define hierarchy levels in order
  const hierarchyLevels = [
    'owner',
    'executive', 
    'global',
    'operations',
    'director',
    'manager',
    'teamLeader'
  ];

  // Level display names
  const levelNames = {
    owner: 'Owner/Operator',
    executive: 'Executive Director',
    global: 'Globals',
    operations: 'Operations Director',
    director: 'Directors',
    manager: 'Managers',
    teamLeader: 'Team Leaders'
  };

  // Group team members by level and store
  const getTeamByLevel = (level) => {
    return teamContent.filter(member => member.level === level);
  };

  const getTeamByLevelAndStore = (level, store) => {
    return teamContent.filter(member => member.level === level && member.store === store);
  };

  // Render team member card
  const renderTeamMember = (member) => (
    <div key={member.id} className="team-member-card">
      {userRole === 'admin' && (
        <div className="admin-controls">
          <button className="edit-btn" onClick={() => openModal('TeamModal', { ...member, section: 'team' })}>Edit</button>
          <button className="delete-btn" onClick={() => openModal('DeleteModal', { id: member.id, section: 'team' })}>Delete</button>
          <button className="photo-btn" onClick={() => openModal('TeamModal', { ...member, section: 'team', action: 'uploadPhoto' })}>📷</button>
        </div>
      )}
      <div className="team-photo-container">
        {member.headshot ? (
          <img src={member.headshot} alt={`${member.name}`} className="team-headshot" />
        ) : (
          <div className="team-avatar">{member.name.split(' ').map(n => n[0]).join('')}</div>
        )}
      </div>
      <div className="team-member-info">
        <h4 className="member-name">{member.name}</h4>
        <p className="position">{member.position}</p>
        {member.description && <p className="description">{member.description}</p>}
      </div>
    </div>
  );

  return (
    <div className="team-section">
      <div className="page-title">
        <h2>Our Team - Organizational Chart</h2>
        {userRole === 'admin' && (
          <button className="btn add-team-btn" onClick={() => openModal('TeamModal', { section: 'team' })}>
            <span className="btn-icon">👤</span>
            Add Team Member
          </button>
        )}
      </div>
      
      <div className="org-chart">
        {hierarchyLevels.map(level => {
          const corporateTeam = getTeamByLevel(level).filter(member => member.store === 'corporate');
          const southMainTeam = getTeamByLevelAndStore(level, 'southMain');
          const unionCrossTeam = getTeamByLevelAndStore(level, 'unionCross');
          
          // Skip if no team members at this level
          if (corporateTeam.length === 0 && southMainTeam.length === 0 && unionCrossTeam.length === 0) {
            return null;
          }

          return (
            <div key={level} className="hierarchy-level">
              <h3 className="level-title">{levelNames[level]}</h3>
              
              {/* Corporate level (before split) */}
              {corporateTeam.length > 0 && (
                <div className="corporate-level">
                  <div className="team-row">
                    {corporateTeam.map(renderTeamMember)}
                  </div>
                </div>
              )}
              
              {/* Store-specific levels (after globals) */}
              {(southMainTeam.length > 0 || unionCrossTeam.length > 0) && (
                <div className="store-split">
                  {southMainTeam.length > 0 && (
                    <div className="store-column">
                      <h4 className="store-title" data-store="southMain">South Main</h4>
                      <div className="team-row">
                        {southMainTeam.map(renderTeamMember)}
                      </div>
                    </div>
                  )}
                  
                  {unionCrossTeam.length > 0 && (
                    <div className="store-column">
                      <h4 className="store-title" data-store="unionCross">Union Cross</h4>
                      <div className="team-row">
                        {unionCrossTeam.map(renderTeamMember)}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Connection line to next level */}
              {level !== 'teamLeader' && (
                <div className="connection-line"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamSection;
