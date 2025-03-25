// src/components/Instructions.tsx
import React from 'react';

interface Props {
  commands: { command: string; description: string }[];
}

const Instructions: React.FC<Props> = ({ commands }) => {
  return (
    <div className="instructions">
      <h3>Available Voice Commands:</h3>
      <ul>
        {commands.map((item, index) => (
          <li key={index}>
            <strong>{item.command}</strong>: {item.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Instructions;