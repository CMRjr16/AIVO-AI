import React, { useEffect } from 'react';

export default function Canvas() {
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      // Listen for suggested actions from the parent window
      if (e.data?.type === 'aivo:requestSuggested') {
        const suggested = [
          { id: 'ask_followup', label: 'Ask AIVO AI' },
          { id: 'summarize', label: 'Summarize' },
          { id: 'continue', label: 'Continue' },
        ];
        window.parent.postMessage({ type: 'aivo:canvasSuggested', suggested }, '*');
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // The iframe element that hosts this canvas should be named "aivo-ai-chat" from the parent
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#111827' }}>
        <div style={{ fontSize: 18, fontWeight: 600 }}>AIVO AI — Canvas</div>
        <div style={{ marginTop: 8, color: '#6b7280' }}>This iframe listens for suggested actions and renders a clean monochrome mockup.</div>
      </div>
    </div>
  );
}
