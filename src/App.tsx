// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import SpeechRecognitionComponent from './components/SpeechRecognitionComponent';
import Presentation from './pages/Presentation';
import About from './pages/About';
import Contact from './pages/Contact';
import CommandModal from './components/CommandModal'; // Import
import './App.css';

interface Slide {
  title: string;
  content: string;
  imagePath?: string;
}

const slides: Slide[] = [
  { title: 'Welcome to VUI!', content: 'A minimal voice-activated user interface built with React, TypeScript, Vite, and the Web Speech API.', imagePath: '/slide1.jpg' },
  { title: 'Project Setup', content: 'We used Vite to create a React + TypeScript project: `npm create vite@latest voice-activated-website --template react-ts`', imagePath: '/slide2.png' },
  { title: 'Web Speech API', content: 'The Web Speech API provides speech recognition capabilities. We defined TypeScript interfaces for type safety.', imagePath: '/slide3.svg' },
  { title: 'Component Structure', content: 'The `SpeechRecognitionComponent` handles speech recognition.  `App.tsx` manages state and routing.', imagePath: '' },
  { title: 'Command Parsing', content: 'The `processCommand` function uses string matching and regular expressions to interpret voice commands.', imagePath: '/slide5.jpg' },
  { title: 'React Router', content: 'React Router Dom enables navigation between pages', imagePath: '/slide6.jpg' },
];

const commands = [
    { command: 'next slide', description: 'Go to the next slide.' },
    { command: 'previous slide', description: 'Go to the previous slide.' },
    { command: 'go to slide [number]', description: 'Go to a specific slide (e.g., "go to slide 2").' },
    { command: 'change background color to [color]', description: 'Change the background color (e.g., "change background color to blue").' },
    { command: 'reset', description: 'Resets the background color' },
    { command: 'go to about', description: 'Navigate to the About page.' },
    { command: 'go to contact', description: 'Navigate to the Contact page.' },
    { command: 'show commands', description: 'Display the available voice commands.' }, // Add this
];

const App: React.FC = () => {
    const [lastCommand, setLastCommand] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const navigate = useNavigate();

    const goToNextSlide = () => {
        setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const goToPreviousSlide = () => {
        setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index: number) => {
        if (index >= 0 && index < slides.length) {
            setCurrentSlideIndex(index);
        }
    };

    const processCommand = (command: string) => {
        setIsProcessing(true);
        const lowerCaseCommand = command.toLowerCase().trim();

        if (lowerCaseCommand.includes('change background color to')) {
            const color = lowerCaseCommand.split('change background color to ')[1];
            document.body.style.backgroundColor = color;
        } else if (lowerCaseCommand.startsWith('next slide')) {
            goToNextSlide();
        } else if (lowerCaseCommand.startsWith('previous slide')) {
            goToPreviousSlide();
        }  else if (lowerCaseCommand.startsWith('go to slide')) {
            const slideNumberMatch = lowerCaseCommand.match(/slide (\d+)/);
            if (slideNumberMatch) {
                const slideNumber = parseInt(slideNumberMatch[1], 10) - 1;
                goToSlide(slideNumber);
            }
        }else if (lowerCaseCommand.startsWith('go to')) {
            const page = lowerCaseCommand.split('go to ')[1];
            switch (page) {
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
        } else if (lowerCaseCommand === 'show commands') { // Handle "show commands"
            setIsModalOpen(true);
        } else {
            console.log('Unknown command:', command);
        }

        setLastCommand(command);

        setTimeout(() => {
            setIsProcessing(false);
        }, 500);
    };

    return (
        <div className="App">
            <h1>Voice-Activated Website</h1>
            <SpeechRecognitionComponent onResult={processCommand} />
            <p>Last Command: {lastCommand}</p>
            {isProcessing && <p>Processing...</p>}

            <button onClick={() => setIsModalOpen(true)}>Show Commands</button> {/* Button to open modal */}

            <CommandModal
                commands={commands}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)} // Function to close the modal
            />

            <Routes>
                <Route path="/" element={<Presentation slides={slides} currentSlideIndex={currentSlideIndex} />} />
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