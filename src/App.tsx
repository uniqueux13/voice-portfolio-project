// src/App.tsx
import React, { useState } from 'react'; // Keep the import
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import SpeechRecognitionComponent from './components/SpeechRecognitionComponent';
import Presentation from './pages/Presentation';
import About from './pages/About';
import Contact from './pages/Contact';
import './App.css';

interface Slide { // Define Slide interface here too (or in a separate file)
  title: string;
  content: string;
  imageUrl?: string;
}

const slides: Slide[] = [ // Define slides here
  { title: 'Slide 1', content: 'This is the content of slide 1.', imageUrl: 'https://via.placeholder.com/800x400?text=Slide+1' },
  { title: 'Slide 2', content: 'This is the content of slide 2.', imageUrl: 'https://via.placeholder.com/800x400?text=Slide+2' },
  { title: 'Slide 3', content: 'This is the content of slide 3.', imageUrl: 'https://via.placeholder.com/800x400?text=Slide+3' },
];

const App: React.FC = () => { // Use React.FC here
    const [lastCommand, setLastCommand] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0); // State is now HERE
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
            goToNextSlide(); // Check for "next slide" first
        } else if (lowerCaseCommand.startsWith('previous slide')) {
            goToPreviousSlide(); // Check for "previous slide" next
        }  else if (lowerCaseCommand.startsWith('go to slide')) {
            const slideNumberMatch = lowerCaseCommand.match(/slide (\d+)/);
            if (slideNumberMatch) {
                const slideNumber = parseInt(slideNumberMatch[1], 10) - 1;
                goToSlide(slideNumber);
            }
        }else if (lowerCaseCommand.startsWith('go to')) {
            const page = lowerCaseCommand.split('go to ')[1];
            switch (page) {
                // REMOVE the 'presentation' case:
                // case 'presentation':
                //     navigate('/');
                //     break;
                case 'about':
                    navigate('/about');
                    break;
                case 'contact':
                    navigate('/contact');
                    break;
                default:
                    console.log('Unknown page:', page);
            }
        }else if (lowerCaseCommand.includes('reset')) {
            document.body.style.backgroundColor = 'white';
        }  else {
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
            <Routes>
                {/* Pass props to Presentation */}
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