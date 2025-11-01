
import React, { useState, useEffect, useRef } from 'react';
import { DocumentFile, ChatMessage, MessageAuthor } from '../types';
import { streamChatResponse } from '../services/geminiService';
import SendIcon from './icons/SendIcon';
import SparklesIcon from './icons/SparklesIcon';

interface DocumentChatProps {
  selectedFile: DocumentFile;
}

const PromptButton: React.FC<{ text: string, onClick: () => void }> = ({ text, onClick }) => (
    <button
        onClick={onClick}
        className="px-3 py-1.5 bg-gray-700/80 hover:bg-gray-600/80 transition-colors duration-200 rounded-lg text-sm text-gray-200"
    >
        {text}
    </button>
);


const DocumentChat: React.FC<DocumentChatProps> = ({ selectedFile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: 'initial',
        author: MessageAuthor.BOT,
        text: `Hello! I'm ready to help you with "${selectedFile.name}". Ask me anything or use one of the prompts below.`,
      },
    ]);
  }, [selectedFile]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (prompt?: string) => {
    const messageText = prompt || currentMessage;
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      author: MessageAuthor.USER,
      text: messageText,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    const botMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: botMessageId, author: MessageAuthor.BOT, text: '' }]);

    const documentContext = selectedFile.type.startsWith('text/') ? selectedFile.content : selectedFile.name;

    await streamChatResponse(
      messageText,
      documentContext,
      (chunk) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: msg.text + chunk } : msg
          )
        );
      }
    );

    setIsLoading(false);
  };
  
  const handlePromptClick = (promptTemplate: string) => {
    const prompt = `${promptTemplate} the document "${selectedFile.name}"`;
    handleSendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-full bg-gray-800/50 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white truncate">Chat with: {selectedFile.name}</h2>
      </div>

      <div ref={chatContainerRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.author === MessageAuthor.USER ? 'justify-end' : ''
            }`}
          >
            {message.author === MessageAuthor.BOT && <SparklesIcon className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />}
            <div
              className={`max-w-xl p-3 rounded-lg ${
                message.author === MessageAuthor.USER
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-200'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text || '...'}</p>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length-1].author === MessageAuthor.BOT && messages[messages.length-1].text === '' && (
             <div className="flex gap-3">
                 <SparklesIcon className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                 <div className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
                    </div>
                 </div>
             </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex gap-2 mb-3">
            <PromptButton text="Summarize this file" onClick={() => handlePromptClick("Create a concise summary of")} />
            <PromptButton text="Explain it simply" onClick={() => handlePromptClick("Explain the key concepts in this file like I'm a beginner")} />
            <PromptButton text="Create a test" onClick={() => handlePromptClick("Create a multiple choice test based on this file")} />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask a question about the document..."
            className="w-full bg-gray-700 text-gray-200 placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !currentMessage.trim()}
            className="p-2 bg-indigo-600 rounded-lg text-white disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors duration-200"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentChat;
