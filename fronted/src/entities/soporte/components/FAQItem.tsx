import React, { useState } from 'react';

interface FAQItemProps {
  id: string;
  question: string;
  answer: string;
}

export const FAQItem: React.FC<FAQItemProps> = ({ id, question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <div className="border border-white/8 bg-[#140e0e] rounded-xl my-2 overflow-hidden" aria-expanded={isOpen}>
      <button
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className="w-full text-left grid grid-cols-[1fr_22px] gap-3 items-center px-4 py-3 text-[#efe4e4] bg-transparent border-none cursor-pointer hover:bg-white/4 outline-none focus:outline-2 focus:outline-[#f7a940]/45 focus:outline-offset-2 focus:rounded-lg transition-all"
        aria-controls={id}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <svg
          className={`transition-transform duration-180 opacity-90 ${isOpen ? 'transform rotate-180' : ''}`}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 9l6 6 6-6" stroke="#e9dede" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div
        id={id}
        className={`transition-all duration-220 overflow-hidden border-t ${
          isOpen
            ? 'max-h-[500px] border-white/8 px-4 pt-3 pb-4'
            : 'max-h-0 border-transparent px-4'
        }`}
      >
        <div className="text-[#e8dcdc]" dangerouslySetInnerHTML={{ __html: answer }} />
      </div>
    </div>
  );
};

