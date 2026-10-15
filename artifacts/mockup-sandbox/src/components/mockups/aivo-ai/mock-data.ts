const sampleConversation = [
  {
    id: 'sys-1',
    sender: 'system',
    text: 'Demo conversation: AIVO AI is ready to help — try asking about the app design, voice input, or features.',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
  {
    id: 'u-1',
    sender: 'user',
    text: 'Can you suggest a crisp tagline for AIVO AI that fits a monochrome design?',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
  {
    id: 'a-1',
    sender: 'assistant',
    text: 'AIVO AI — Hear. Ask. Answer. Simplified for the modern editorial flow.',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

export default sampleConversation;
