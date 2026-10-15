import React, { useEffect, useRef, useState } from 'react';
import sampleConversation from './mock-data';

export type Message = {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  time: string;
};

const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(sampleConversation);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Post the suggested actions to the canvas iframe named "aivo-ai-chat"
    const iframe = document.querySelector<HTMLIFrameElement>('iframe[name="aivo-ai-chat"]');
    if (iframe?.contentWindow) {
      const suggested = [
        { id: 'ask_followup', label: 'Ask AIVO AI', description: 'Follow up on the last answer' },
        { id: 'summarize', label: 'Summarize', description: 'Get a short summary' },
        { id: 'continue', label: 'Continue', description: 'Continue the conversation' },
      ];
      iframe.contentWindow.postMessage({ type: 'aivo:suggestedActions', suggested }, '*');
    }
  }, []);

  const sendMessage = (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: content,
      time: nowTime(),
    };

    setMessages((m) => [...m, userMsg]);
    setInput('');

    // Simulate brief assistant response
    setTimeout(() => {
      const assistantMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: generateAssistantReply(content),
        time: nowTime(),
      };
      setMessages((m) => [...m, assistantMsg]);
    }, 450); // brief typing delay
  };

  const generateAssistantReply = (prompt: string) => {
    // Simple believable placeholder response; in the real app this connects to the LLM.
    if (prompt.length < 20) {
      return `Right away — here's a concise answer to "${prompt}".`;
    }
    return `Thanks — I read that. Briefly: ${prompt.slice(0, 140)}${prompt.length > 140 ? '…' : ''}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const newConversation = () => {
    setMessages([
      {
        id: 'system-' + Date.now(),
        sender: 'system',
        text: 'New conversation. Ask AIVO AI anything.',
        time: nowTime(),
      },
    ]);
    inputRef.current?.focus();
  };

  const restoreConversation = () => {
    setMessages(sampleConversation);
    inputRef.current?.focus();
  };

  const askAivoFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen flex bg-neutral-50 text-gray-900">
      {/* Conversation rail */}
      <aside className="w-80 max-w-[22rem] bg-black text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="text-sm font-semibold tracking-wide">AIVO AI</div>
          <div className="text-xs text-white/70 mt-1">Crisp · Monochrome · Command panel</div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Example conversation list */}
          <div className="py-2 px-3 rounded-md bg-white/3">
            <div className="text-sm font-medium">Alex</div>
            <div className="text-xs text-white/60">Can you draft a short intro for our app?</div>
            <div className="text-[11px] text-white/50 mt-1">11:04</div>
          </div>

          <div className="py-2 px-3 rounded-md bg-white/2 opacity-80">
            <div className="text-sm font-medium">Design Notes</div>
            <div className="text-xs text-white/60">Monochrome, editorial spacing, mobile-friendly.</div>
            <div className="text-[11px] text-white/50 mt-1">09:27</div>
          </div>

          <div className="py-2 px-3 rounded-md bg-transparent border border-white/6">
            <div className="text-sm font-medium">Demo Conversation</div>
            <div className="text-xs text-white/60">Live mockup for AIVO AI</div>
            <div className="text-[11px] text-white/50 mt-1">Now</div>
          </div>
        </div>
        <div className="p-4 border-t border-white/6">
          <button onClick={newConversation} className="w-full py-2 px-3 bg-white text-black rounded-md text-sm font-medium">New</button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden w-full border-b border-gray-200 bg-white/80 p-3 flex items-center justify-between">
        <div className="font-semibold">AIVO AI</div>
        <div>
          <button
            onClick={() => setMobileMenuOpen((s) => !s)}
            className="rounded-md p-2 bg-black text-white"
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Main canvas */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-hidden p-6 md:p-8">
          <div className="max-w-3xl mx-auto h-full flex flex-col rounded-lg shadow-sm bg-white">
            {/* Canvas header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">AIVO AI — Demo Chat</h2>
                <p className="text-sm text-gray-500 mt-1">Ink-black commands, editorial spacing, and a responsive layout.</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={restoreConversation} className="text-sm text-gray-700 hover:underline">Restore</button>
                <button onClick={askAivoFocus} className="bg-black text-white px-3 py-1 rounded-md text-sm">Ask AIVO AI</button>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-auto p-6 bg-neutral-50">
              <div className="space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className={`max-w-[85%] ${m.sender === 'user' ? 'ml-auto text-right' : 'mr-auto text-left'}`}>
                    <div
                      className={`inline-block px-4 py-2 rounded-lg ${
                        m.sender === 'user' ? 'bg-black text-white' : m.sender === 'assistant' ? 'bg-white border border-gray-200 text-gray-900' : 'text-gray-600 italic text-sm'
                      }`}
                    >
                      {m.text}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">{m.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Composer */}
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="flex items-start gap-3">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message and press Enter to send — Ask AIVO AI"
                  className="flex-1 min-h-[44px] max-h-40 resize-none border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => sendMessage()}
                    className="bg-black text-white px-4 py-2 rounded-md text-sm"
                    aria-label="Send message"
                  >
                    Send
                  </button>
                  <button onClick={() => newConversation()} className="text-xs text-gray-500">Restore</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Mobile slide-over menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-black text-white p-4"> 
            <div className="text-lg font-semibold">AIVO AI</div>
            <div className="mt-4 space-y-3">
              <button onClick={newConversation} className="w-full py-2 px-3 bg-white text-black rounded-md">New</button>
              <button onClick={() => { restoreConversation(); setMobileMenuOpen(false); }} className="w-full py-2 px-3 border border-white/10 rounded-md">Restore</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
