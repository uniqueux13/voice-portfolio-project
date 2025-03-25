// src/components/CommandModal.tsx
import React from 'react';

interface Props {
  commands: { command: string; description: string }[];
  isOpen: boolean;
  onClose: () => void;
}

const CommandModal: React.FC<Props> = ({ commands, isOpen, onClose }) => {
  if (!isOpen) {
    return null; // Don't render anything if not open
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Available Voice Commands</h2>
        <ul>
          {commands.map((item, index) => (
            <li key={index} className="command-item"> {/* Add a class here */}
              <strong>{item.command}</strong>: {item.description}
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CommandModal;