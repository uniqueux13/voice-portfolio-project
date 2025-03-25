// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import SpeechRecognitionComponent from './components/SpeechRecognitionComponent';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import './App.css';

function App() {
    const [lastCommand, setLastCommand] = useState('');
    const [isProcessing, setIsProcessing] = useState(false); // Add processing state
    const navigate = useNavigate(); // Hook for navigation

    const processCommand = (command: string) => {
        setIsProcessing(true); // Set processing to true
        const lowerCaseCommand = command.toLowerCase().trim();

        if (lowerCaseCommand.includes('change background color to')) {
            const color = lowerCaseCommand.split('change background color to ')[1];
            document.body.style.backgroundColor = color;
        } else if (lowerCaseCommand.startsWith('go to')) {
            const page = lowerCaseCommand.split('go to ')[1];
            switch (page) {
                case 'home':
                    navigate('/');
                    break;
                case 'about':
                    navigate('/about');
                    break;
                case 'contact':
                    navigate('/contact');
                    break;
                default:
                    console.log('Unknown page:', page);
            }
        } else if (lowerCaseCommand.includes('reset')) {
            document.body.style.backgroundColor = 'white';
        }
        else {
            console.log('Unknown command:', command);
        }

         setLastCommand(command); //set last command after processing

        // Simulate processing time (remove in production) and reset processing state
        setTimeout(() => {
            setIsProcessing(false);
        }, 500); // 0.5 second delay
    };



    return (
            <div className="App">
                <h1>Voice-Activated Website</h1>
                <SpeechRecognitionComponent onResult={processCommand} />
                <p>Last Command: {lastCommand}</p>
                {isProcessing && <p>Processing...</p>} {/* Display processing message */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </div>
    );
}



function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  )
}
export default AppWithRouter;