// src/store.js
import { create } from 'zustand';

const useStore = create((set) => ({
  // Set all data from backend
  setAllData: (allData) => set((state) => ({
    // Only update keys that exist in the store
    ...Object.fromEntries(
      Object.entries(allData).filter(([key]) => key in state)
    )
  })),
  userRole: null,
  setUserRole: (role) => set({ userRole: role }),
  
  // Content state for different sections
  homeContent: {
    welcomeContent: {
      title: 'Welcome to Your Employee Portal',
      message: 'Your gateway to company resources, updates, and team connections'
    },
    heroVideo: '/June2025_Summer25_GM_FoodLove_SummerOfSauce_06_OLV_McCann_Video_File_1_video-preview_1080p.mp4',
    quickLinks: [
      { id: 1, label: 'Team', link: 'team', icon: '👥' },
      { id: 2, label: 'Calendar', link: 'calendar', icon: '📅' },
      { id: 3, label: 'Benefits', link: 'benefits', icon: '🏥' },
      { id: 4, label: 'Documents', link: 'documents', icon: '📄' }
    ],
    announcements: [
      { id: 1, title: 'New Training Program', date: '2025-01-15', message: 'We are launching a new customer service training program next month.' },
      { id: 2, title: 'Holiday Schedule', date: '2025-01-10', message: 'Please check the updated holiday schedule for February.' },
      { id: 3, title: 'Team Meeting', date: '2025-01-08', message: 'Monthly team meeting scheduled for January 20th at 3 PM.' }
    ]
  },
  aboutContent: [
    {
      id: 1,
      title: 'Our Mission',
      description: 'To glorify God by being a faithful steward of all that is entrusted to us and to have a positive influence on all who come into contact with Chick-fil-A.'
    },
    {
      id: 2,
      title: 'Our Vision',
      description: 'To be America\'s best quick-service restaurant at getting better.'
    },
    {
      id: 3,
      title: 'Our Values',
      description: 'Service: We exist to serve others with excellence. Teamwork: We collaborate to achieve our goals. Growth: We continuously improve ourselves.'
    }
  ],


  benefitsContent: {
    fullTime: [
      { id: 1, title: 'Health Insurance', description: 'Comprehensive medical, dental, and vision coverage' },
      { id: 2, title: 'Retirement Plan', description: '401(k) with company matching up to 6%' },
      { id: 3, title: 'Paid Time Off', description: 'Vacation days, sick leave, and personal days' },
      { id: 4, title: 'Employee Discounts', description: 'Discounts on food and merchandise' }
    ],
    partTime: [
      { id: 5, title: 'Flexible Scheduling', description: 'Work schedules that fit your lifestyle' },
      { id: 6, title: 'Employee Discounts', description: 'Discounts on food and merchandise' },
      { id: 7, title: 'Scholarship Program', description: 'Educational assistance for students' }
    ],
    manager: [
      { id: 8, title: 'Leadership Development', description: 'Advanced training and development programs' },
      { id: 9, title: 'Performance Bonuses', description: 'Quarterly and annual performance incentives' },
      { id: 10, title: 'Stock Options', description: 'Equity participation in company success' }
    ]
  },

  teamContent: [],
  setTeamContent: (teamMembers) => set({ teamContent: teamMembers }),

  developmentContent: [
    {
      id: 1,
      title: 'Customer Service Excellence',
      description: 'Learn advanced customer service techniques to provide exceptional dining experiences',
      type: 'course',
      duration: '2 hours',
      completed: false,
      progress: 0
    },
    {
      id: 2,
      title: 'Food Safety and Hygiene',
      description: 'Essential food safety practices and hygiene standards for restaurant operations',
      type: 'certification',
      duration: '3 hours',
      completed: true,
      progress: 100
    },
    {
      id: 3,
      title: 'Leadership Development',
      description: 'Develop leadership skills for team management and restaurant operations',
      type: 'course',
      duration: '4 hours',
      completed: false,
      progress: 45
    }
  ],

  documentsContent: {
    forms: [
      { id: 1, title: 'Time Off Request Form', type: 'PDF', size: '2.1 MB', uploadDate: '2025-01-01', url: '#' },
      { id: 2, title: 'Employee Information Update', type: 'PDF', size: '1.8 MB', uploadDate: '2025-01-02', url: '#' }
    ],
    policy: [
      { id: 3, title: 'Employee Handbook 2025', type: 'PDF', size: '5.2 MB', uploadDate: '2025-01-01', url: '#' },
      { id: 4, title: 'Code of Conduct', type: 'PDF', size: '3.1 MB', uploadDate: '2025-01-01', url: '#' }
    ],
    tools: [
      { id: 5, title: 'POS System Manual', type: 'PDF', size: '4.3 MB', uploadDate: '2025-01-01', url: '#' },
      { id: 6, title: 'Kitchen Equipment Guide', type: 'PDF', size: '3.7 MB', uploadDate: '2025-01-01', url: '#' }
    ],
    handbook: [
      { id: 7, title: 'New Employee Orientation', type: 'PDF', size: '6.1 MB', uploadDate: '2025-01-01', url: '#' },
      { id: 8, title: 'Training Manual', type: 'PDF', size: '4.9 MB', uploadDate: '2025-01-01', url: '#' }
    ],
    training: [
      { id: 9, title: 'Customer Service Training', type: 'PDF', size: '3.5 MB', uploadDate: '2025-01-01', url: '#' },
      { id: 10, title: 'Food Safety Certification', type: 'PDF', size: '2.8 MB', uploadDate: '2025-01-01', url: '#' }
    ]
  },

  videosContent: {
    teamEvents: [
      { id: 1, title: 'Team Holiday Party 2024', videoUrl: '', thumbnail: '', uploadDate: '2024-12-20', description: 'Annual holiday celebration highlights', date: '2024-12-20' },
      { id: 2, title: 'Staff Appreciation Day', videoUrl: '', thumbnail: '', uploadDate: '2024-11-15', description: 'Celebrating our amazing team members', date: '2024-11-15' }
    ],
    training: [
      { id: 3, title: 'Customer Service Excellence', videoUrl: '', thumbnail: '', uploadDate: '2024-10-01', description: 'Training on exceptional customer service', date: '2024-10-01' },
      { id: 4, title: 'Food Safety Protocol', videoUrl: '', thumbnail: '', uploadDate: '2024-09-15', description: 'Important food safety procedures', date: '2024-09-15' }
    ],
    southMain: [
      { id: 5, title: 'Grand Opening Ceremony', videoUrl: '', thumbnail: '', uploadDate: '2024-09-01', description: 'South Main location grand opening ceremony', date: '2024-09-01' },
      { id: 6, title: 'Community Event Highlights', videoUrl: '', thumbnail: '', uploadDate: '2024-08-15', description: 'Local community outreach highlights', date: '2024-08-15' }
    ],
    unionCross: [
      { id: 7, title: 'Store Opening Celebration', videoUrl: '', thumbnail: '', uploadDate: '2024-06-01', description: 'Union Cross location opening celebration', date: '2024-06-01' },
      { id: 8, title: 'Customer Service Week', videoUrl: '', thumbnail: '', uploadDate: '2024-05-10', description: 'Celebrating excellent customer service', date: '2024-05-10' }
    ]
  },

  photosContent: {
    teamEvents: [
      { id: 1, title: 'Team Holiday Party 2024', url: '/public/IMG_3606.JPG', uploadDate: '2024-12-20', description: 'Annual holiday celebration' },
      { id: 2, title: 'Staff Appreciation Day', url: '/public/IMG_3606.JPG', uploadDate: '2024-11-15', description: 'Celebrating our amazing team' }
    ],
    southMain: [
      { id: 3, title: 'Grand Opening', url: '/public/IMG_3606.JPG', uploadDate: '2024-09-01', description: 'South Main location grand opening' },
      { id: 4, title: 'Community Event', url: '/public/IMG_3606.JPG', uploadDate: '2024-08-15', description: 'Local community outreach' }
    ],
    unionCross: [
      { id: 5, title: 'Store Opening', url: '/public/IMG_3606.JPG', uploadDate: '2024-06-01', description: 'Union Cross location opening' },
      { id: 6, title: 'Customer Service Week', url: '/public/IMG_3606.JPG', uploadDate: '2024-05-10', description: 'Celebrating excellent service' }
    ]
  },

  calendarContent: {
    marketing: [
      { id: 1, title: 'Marketing Meeting', date: '07/15/2025', time: '10:00 AM', description: 'Monthly marketing strategy meeting' },
      { id: 2, title: 'Social Media Campaign', date: '07/20/2025', time: '2:00 PM', description: 'Launch new social media campaign' }
    ],
    southMain: [
      { id: 3, title: 'Staff Training', date: '07/17/2025', time: '9:00 AM', description: 'Monthly staff training session' },
      { id: 4, title: 'Equipment Maintenance', date: '07/18/2025', time: '3:00 PM', description: 'Monthly equipment maintenance check' }
    ],
    unionCross: [
      { id: 5, title: 'Store Opening', date: '07/17/2025', time: '8:00 AM', description: 'Store opening preparations' },
      { id: 6, title: 'Inventory Check', date: '07/22/2025', time: '4:00 PM', description: 'Monthly inventory check' }
    ]
  },
  
  // Action to add content to about section
  addAboutContent: (newContent) => set((state) => ({
    aboutContent: [...state.aboutContent, { ...newContent, id: Date.now() }]
  })),
  
  // Action to update content in about section
  updateAboutContent: (id, updatedContent) => set((state) => ({
    aboutContent: state.aboutContent.map(item => 
      item.id === id ? { ...item, ...updatedContent } : item
    )
  })),
  
  // Action to delete content from about section
  deleteAboutContent: (id) => set((state) => ({
    aboutContent: state.aboutContent.filter(item => item.id !== id)
  })),

  // Home section actions
  updateHomeWelcome: (updatedContent) => set((state) => ({
    homeContent: { ...state.homeContent, welcomeContent: { ...state.homeContent.welcomeContent, ...updatedContent } }
  })),
  
  updateHeroVideo: (videoUrl) => set((state) => ({
    homeContent: { ...state.homeContent, heroVideo: videoUrl }
  })),
  
  addHomeQuickLink: (newLink) => set((state) => ({
    homeContent: { ...state.homeContent, quickLinks: [...state.homeContent.quickLinks, { ...newLink, id: Date.now() }] }
  })),
  
  updateHomeQuickLink: (id, updatedLink) => set((state) => ({
    homeContent: { ...state.homeContent, quickLinks: state.homeContent.quickLinks.map(item => 
      item.id === id ? { ...item, ...updatedLink } : item
    )}
  })),
  
  deleteHomeQuickLink: (id) => set((state) => ({
    homeContent: { ...state.homeContent, quickLinks: state.homeContent.quickLinks.filter(item => item.id !== id) }
  })),

  addHomeAnnouncement: (newAnnouncement) => set((state) => ({
    homeContent: { ...state.homeContent, announcements: [...state.homeContent.announcements, { ...newAnnouncement, id: Date.now() }] }
  })),
  
  updateHomeAnnouncement: (id, updatedAnnouncement) => set((state) => ({
    homeContent: { ...state.homeContent, announcements: state.homeContent.announcements.map(item => 
      item.id === id ? { ...item, ...updatedAnnouncement } : item
    )}
  })),
  
  deleteHomeAnnouncement: (id) => set((state) => ({
    homeContent: { ...state.homeContent, announcements: state.homeContent.announcements.filter(item => item.id !== id) }
  })),

  // Benefits section actions
  addBenefitsContent: (category, newBenefit) => set((state) => ({
    benefitsContent: { ...state.benefitsContent, [category]: [...state.benefitsContent[category], { ...newBenefit, id: Date.now() }] }
  })),
  
  updateBenefitsContent: (category, id, updatedBenefit) => set((state) => ({
    benefitsContent: { ...state.benefitsContent, [category]: state.benefitsContent[category].map(item => 
      item.id === id ? { ...item, ...updatedBenefit } : item
    )}
  })),
  
  deleteBenefitsContent: (category, id) => set((state) => ({
    benefitsContent: { ...state.benefitsContent, [category]: state.benefitsContent[category].filter(item => item.id !== id) }
  })),

  // Team section actions
  addTeamContent: (newTeamMember) => set((state) => ({
    teamContent: [...state.teamContent, { ...newTeamMember, id: Date.now() }]
  })),
  
  updateTeamContent: (id, updatedTeamMember) => set((state) => ({
    teamContent: state.teamContent.map(item => 
      item.id === id ? { ...item, ...updatedTeamMember } : item
    )
  })),
  
  deleteTeamContent: (id) => set((state) => ({
    teamContent: state.teamContent.filter(item => item.id !== id)
  })),

  // Development section actions
  addDevelopmentContent: (newContent) => set((state) => ({
    developmentContent: [...state.developmentContent, { ...newContent, id: Date.now() }]
  })),
  
  updateDevelopmentContent: (id, updatedContent) => set((state) => ({
    developmentContent: state.developmentContent.map(item => 
      item.id === id ? { ...item, ...updatedContent } : item
    )
  })),
  
  deleteDevelopmentContent: (id) => set((state) => ({
    developmentContent: state.developmentContent.filter(item => item.id !== id)
  })),

  // Documents section actions
  addDocumentsContent: (category, newDocument) => set((state) => ({
    documentsContent: { ...state.documentsContent, [category]: [...state.documentsContent[category], { ...newDocument, id: Date.now() }] }
  })),
  
  updateDocumentsContent: (category, id, updatedDocument) => set((state) => ({
    documentsContent: { ...state.documentsContent, [category]: state.documentsContent[category].map(item => 
      item.id === id ? { ...item, ...updatedDocument } : item
    )}
  })),
  
  deleteDocumentsContent: (category, id) => set((state) => ({
    documentsContent: { ...state.documentsContent, [category]: state.documentsContent[category].filter(item => item.id !== id) }
  })),

  // Photos section actions
  addPhotosContent: (category, newPhoto) => set((state) => ({
    photosContent: { ...state.photosContent, [category]: [...state.photosContent[category], { ...newPhoto, id: Date.now() }] }
  })),
  
  updatePhotosContent: (category, id, updatedPhoto) => set((state) => ({
    photosContent: { ...state.photosContent, [category]: state.photosContent[category].map(item => 
      item.id === id ? { ...item, ...updatedPhoto } : item
    )}
  })),
  
  deletePhotosContent: (category, id) => set((state) => ({
    photosContent: { ...state.photosContent, [category]: state.photosContent[category].filter(item => item.id !== id) }
  })),

  // Videos section actions
  addVideosContent: (category, newVideo) => set((state) => ({
    videosContent: { ...state.videosContent, [category]: [...state.videosContent[category], { ...newVideo, id: Date.now() }] }
  })),
  
  updateVideosContent: (category, id, updatedVideo) => set((state) => ({
    videosContent: { ...state.videosContent, [category]: state.videosContent[category].map(item => 
      item.id === id ? { ...item, ...updatedVideo } : item
    )}
  })),
  
  deleteVideosContent: (category, id) => set((state) => ({
    videosContent: { ...state.videosContent, [category]: state.videosContent[category].filter(item => item.id !== id) }
  })),

  // Calendar section actions
  addCalendarContent: (category, newEvent) => set((state) => ({
    calendarContent: { ...state.calendarContent, [category]: [...state.calendarContent[category], { ...newEvent, id: Date.now() }] }
  })),
  
  updateCalendarContent: (category, id, updatedEvent) => set((state) => ({
    calendarContent: { ...state.calendarContent, [category]: state.calendarContent[category].map(item => 
      item.id === id ? { ...item, ...updatedEvent } : item
    )}
  })),
  
  deleteCalendarContent: (category, id) => set((state) => ({
    calendarContent: { ...state.calendarContent, [category]: state.calendarContent[category].filter(item => item.id !== id) }
  })),
  
  modals: {
    EditModal: false,
    DeleteModal: false,
    TeamModal: false,
    DocumentModal: false,
    PhotoModal: false,
    EventModal: false,
    QuickModal: false,
    AnnouncementModal: false,
    BenefitsModal: false,
    PhotoViewerModal: false,
  },
  modalData: null,
  openModal: (modalName, data = null) => set((state) => ({
    modals: { ...state.modals, [modalName]: true },
    modalData: data,
  })),
  closeModal: (modalName) => set((state) => ({
    modals: { ...state.modals, [modalName]: false },
    modalData: null,
  })),
}));

export default useStore;
