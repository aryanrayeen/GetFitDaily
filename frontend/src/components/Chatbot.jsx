import { useState } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const Chatbot = ({ questions, type = "meal" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: type === 'meal' 
        ? "Hi! I'm your meal planning assistant. I can help you with nutrition questions and meal ideas. Click on any question below to get started!" 
        : "Hi! I'm your workout assistant. I can help you with exercise recommendations and workout tips. Click on any question below to get started!"
    }
  ]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleQuestionClick = (question) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: question.question
    };

    // Add bot response
    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      content: question.answer
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setSelectedQuestion(null);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: type === 'meal' 
          ? "Hi! I'm your meal planning assistant. I can help you with nutrition questions and meal ideas. Click on any question below to get started!" 
          : "Hi! I'm your workout assistant. I can help you with exercise recommendations and workout tips. Click on any question below to get started!"
      }
    ]);
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          type === 'meal' 
            ? 'bg-green-500 hover:bg-green-600 hover:scale-110' 
            : 'bg-blue-500 hover:bg-blue-600 hover:scale-110'
        } text-white border-4 border-white`}
        style={{ zIndex: 9999 }}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col"
          style={{ zIndex: 9998 }}
        >
          {/* Header */}
          <div className={`p-4 rounded-t-lg ${
            type === 'meal' ? 'bg-green-500' : 'bg-blue-500'
          } text-white flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-medium">
                {type === 'meal' ? 'Meal Assistant' : 'Workout Assistant'}
              </span>
            </div>
            <button
              onClick={clearChat}
              className="text-white/80 hover:text-white text-sm"
            >
              Clear
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-gray-100 text-gray-800'
                      : type === 'meal'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.type === 'bot' && <Bot size={16} className="mt-1 flex-shrink-0" />}
                    {message.type === 'user' && <User size={16} className="mt-1 flex-shrink-0" />}
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Questions */}
          <div className="p-4 border-t bg-gray-50">
            <p className="text-xs text-gray-600 mb-2 font-medium">Quick Questions:</p>
            <div className="space-y-1">
              {questions.slice(0, 2).map((q, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionClick(q)}
                  className={`w-full text-left p-2 text-xs rounded transition-colors ${
                    type === 'meal'
                      ? 'bg-green-50 hover:bg-green-100 text-green-700'
                      : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                  }`}
                >
                  {q.question}
                </button>
              ))}
              <details className="text-xs">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                  More questions...
                </summary>
                <div className="mt-1 space-y-1">
                  {questions.slice(2).map((q, index) => (
                    <button
                      key={index + 2}
                      onClick={() => handleQuestionClick(q)}
                      className={`w-full text-left p-2 text-xs rounded transition-colors ${
                        type === 'meal'
                          ? 'bg-green-50 hover:bg-green-100 text-green-700'
                          : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                      }`}
                    >
                      {q.question}
                    </button>
                  ))}
                </div>
              </details>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
