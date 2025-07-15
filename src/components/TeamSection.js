
import React, { useState, useEffect } from 'react';
import apiRequest from '../utils/api_request';
import '../styles/Team_section_styles.css';

const TeamSection = ({ userRole, openModal }) => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiRequest('team', 'GET');
        setTeamMembers(data || []);
      } catch (err) {
        console.error('Error fetching team data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="team-section">
      <h2>Our Team</h2>
      {userRole === 'admin' && (
        <button className="btn add-team" onClick={() => openModal('teamModal')}>
          Add Team Member
        </button>
      )}
      <div className="team-grid">
        {teamMembers.map((member) => (
          <div key={member.id} className="team-member">
            {userRole === 'admin' && (
              <div className="team-actions">
                <button onClick={() => openModal('teamModal', member)}>Edit</button>
                <button onClick={() => openModal('deleteModal', { id: member.id, section: 'team', type: 'member' })}>Delete</button>
              </div>
            )}
            <div className="member-initials">{member.name.split(' ').map(n => n[0]).join('')}</div>
            <h3>{member.name}</h3>
            <p>{member.position}</p>
            <p>{member.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamSection;
