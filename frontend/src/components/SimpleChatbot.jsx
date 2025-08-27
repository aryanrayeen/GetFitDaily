import { MessageCircle } from 'lucide-react';

const SimpleChatbot = () => {
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        backgroundColor: 'red',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        cursor: 'pointer',
        zIndex: 10000,
        border: '3px solid white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }}
      onClick={() => alert('Chatbot clicked!')}
    >
      <MessageCircle size={30} />
    </div>
  );
};

export default SimpleChatbot;
