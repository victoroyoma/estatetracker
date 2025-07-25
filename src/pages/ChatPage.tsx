import React, { useState } from 'react';
import ChatSystem from '../components/chat/ChatSystem';

const ChatPage: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <ChatSystem 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  );
};

export default ChatPage;
