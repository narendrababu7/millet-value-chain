import React, { useEffect } from 'react';

const Chatbot = () => {
  useEffect(() => {
    // Alan AI SDK
    const script = document.createElement('script');
    script.src = 'https://studio.alan.app/web/lib/alan_lib.min.js';
    script.async = true;
    
    script.onload = () => {
      if (window.Alan) {
        window.Alan({
          key: 'your-alan-key-here', // Replace with actual Alan AI key
          onCommand: (commandData) => {
            if (commandData.command === 'navigate') {
              // Handle navigation commands
              window.location.href = commandData.url;
            } else if (commandData.command === 'search_products') {
              // Handle product search
              window.location.href = `/marketplace?search=${commandData.query}`;
            } else if (commandData.command === 'show_price') {
              // Handle price queries
              window.location.href = `/market-prices?millet=${commandData.millet}`;
            } else if (commandData.command === 'show_schemes') {
              // Handle scheme queries
              window.location.href = '/schemes';
            }
          }
        });
      }
    };
    
    document.head.appendChild(script);
    
    return () => {
      // Cleanup
      if (window.Alan) {
        window.Alan.close();
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default Chatbot;
