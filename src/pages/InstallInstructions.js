import React from 'react';
import { FaChrome, FaEdge, FaSafari, FaDownload, FaDesktop } from 'react-icons/fa';

const InstallInstructions = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#6e42ff' }}>Install Audit Editor App</h1>
      
      <div style={{ backgroundColor: '#f0f2f5', padding: '20px', borderRadius: '10px', margin: '20px 0' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaDesktop /> Install as Desktop App
        </h2>
        
        <h3>For Chrome/Edge:</h3>
        <ol style={{ lineHeight: '1.8' }}>
          <li>Click the <strong>Install icon (📥)</strong> in the address bar</li>
          <li>Or go to <strong>Menu → More tools → Create shortcut</strong></li>
          <li>Check "Open as window" for app-like experience</li>
          <li>Click "Install" or "Create"</li>
        </ol>
        
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaChrome /> Chrome
            </h3>
            <img 
              src="https://storage.googleapis.com/support-kms-prod/ZAl1gIwyUsvfwxoW9ns47iJFioHXODBbIkrK" 
              alt="Chrome install"
              style={{ width: '100%', borderRadius: '5px', marginTop: '10px' }}
            />
          </div>
          
          <div style={{ flex: 1, minWidth: '250px', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaEdge /> Edge
            </h3>
            <img 
              src="https://support.microsoft.com/en-us/windows/microsoft-edge-features-and-benefits-4c3c5f7b-7c2f-4b9a-8b5a-5f5b5b5b5b5b" 
              alt="Edge install"
              style={{ width: '100%', borderRadius: '5px', marginTop: '10px' }}
            />
          </div>
        </div>
      </div>
      
      <div style={{ backgroundColor: '#e6f4ea', padding: '20px', borderRadius: '10px', margin: '20px 0' }}>
        <h2>Benefits of Installing:</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li>✅ Works offline - No internet required</li>
          <li>✅ Fast loading - Cached for instant startup</li>
          <li>✅ App-like experience - No browser UI clutter</li>
          <li>✅ Desktop icon - Easy access from Start Menu</li>
          <li>✅ Automatic updates - Always get the latest version</li>
          <li>✅ Background sync - Data syncs when online</li>
        </ul>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button
          onClick={() => {
            // Trigger install prompt
            const event = new Event('beforeinstallprompt');
            window.dispatchEvent(event);
          }}
          style={{
            padding: '12px 30px',
            backgroundColor: '#6e42ff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <FaDownload /> Install Now
        </button>
        
        <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
          Or look for the install icon <span style={{ fontSize: '20px' }}>📥</span> in your browser's address bar
        </p>
      </div>
    </div>
  );
};

export default InstallInstructions;