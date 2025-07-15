
import React, { useState, useEffect } from 'react';
import apiRequest from '../utils/api_request';
import '../styles/Benefits_section_styles.css';

const BenefitsSection = ({ userRole, openModal }) => {
  const [benefits, setBenefits] = useState({ fullTime: [], partTime: [], manager: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiRequest('benefits', 'GET');
        setBenefits(data || { fullTime: [], partTime: [], manager: [] });
      } catch (err) {
        console.error('Error fetching benefits data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="benefits-section">
      <h2>My Benefits</h2>
      {['fullTime', 'partTime', 'manager'].map((category) => (
        <div key={category} className="benefits-category">
          <h3>{category === 'fullTime' ? 'Full-Time Benefits' : category === 'partTime' ? 'Part-Time Benefits' : 'Manager Benefits'}</h3>
          {userRole === 'admin' && (
            <button className="btn add-benefit" onClick={() => openModal('benefitsModal', { section: 'benefits', type: category })}>
              Add Benefit
            </button>
          )}
          <div className="benefits-list">
            {benefits[category].map((benefit) => (
              <div key={benefit.id} className="benefit-item">
                {userRole === 'admin' && (
                  <div className="benefit-actions">
                    <button onClick={() => openModal('benefitsModal', { ...benefit, section: 'benefits', type: category })}>Edit</button>
                    <button onClick={() => openModal('deleteModal', { id: benefit.id, section: 'benefits', type: category })}>Delete</button>
                  </div>
                )}
                <h4>{benefit.title}</h4>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BenefitsSection;
