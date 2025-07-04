import { useState, useEffect } from 'react';

import './index.css'

function EmailApp() {
  const [showCompose, setShowCompose] = useState(false);
  const [showInclude, setShowInclude] = useState(false);
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    body: ''
  });

  // Handle hash changes
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      setShowCompose(hash.includes('compose'));
      setShowInclude(hash.includes('include'));
      
      // Parse compose data if needed
      if (hash.includes('compose')) {
        const params = new URLSearchParams(hash.split('?')[1]);
        // You could parse initial data here if needed
      }
    };

    // Initial check
    checkHash();
    
    // Listen for hash changes
    window.addEventListener('hashchange', checkHash);
    
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleComposeClick = () => {
    // Set hash to show compose window
    window.location.hash = 'compose';
  };
  const handleIncludeClick = () => {
    // Set hash to show compose window
    window.location.hash = 'include';
  };

  const closeCompose = () => {
    // Reset hash
    window.location.hash = '';
    // Clear compose data
    setComposeData({ to: '', subject: '', body: '' });
  };

    const handleComposeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle email sending logic here
    console.log('Sending email:', composeData);
    closeCompose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setComposeData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="email-app">
      {/* Header */}
      <header className="app-header">
        <h1>My Mail App</h1>
      </header>
      
      {/* Main Content */}
      <div className="app-content">
        {/* Sidebar */}
        <nav className="sidebar">
          <button 
            onClick={handleComposeClick}
            className="compose-button"
          >
            Compose
          </button>
          <button 
            onClick={handleIncludeClick}
            className="compose-button"
          >
            Include
          </button>
          <ul>
            <li className="active">Inbox</li>
            <li>Starred</li>
            <li>Sent</li>
            <li>Drafts</li>
            <li>Trash</li>
          </ul>
        </nav>
        
        {/* Email List */}
        <div className="email-list">
          {/* List of emails would go here */}
          <div className="email-item">
            <h3>Sample Email</h3>
            <p>This is a preview of the email content...</p>
          </div>
        </div>
      </div>
      
      {/* Compose Window */}
      {showCompose && (
        <div className="compose-modal">
          <div className="compose-window">
            <div className="compose-header">
              <h3>New Message</h3>
              <button onClick={closeCompose} className="close-button">×</button>
            </div>
            <form onSubmit={handleComposeSubmit}>
              <input
                type="email"
                name="to"
                placeholder="To"
                value={composeData.to}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={composeData.subject}
                onChange={handleInputChange}
              />
              <textarea
                name="body"
                placeholder="Compose your email here..."
                value={composeData.body}
                onChange={handleInputChange}
              />
              <div className="compose-actions">
                <button type="submit" className="send-button">Send</button>
                <button type="button" onClick={closeCompose}>Discard</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showInclude && (
        <div className='absolute z-100'>
            include...
        </div>
      )}
    </div>
  );
}

export default EmailApp;