import React, { useState, useEffect, useRef } from 'react';

// --- ADD THESE INTERFACES ---
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult; // Make it indexable
}

interface SpeechRecognitionResult extends Array<SpeechRecognitionAlternative> {
    isFinal: boolean;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
}
//This needs to be an interface, not a type, to be able to properly be extended.
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onstart: ((this: SpeechRecognition) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onend: ((this: SpeechRecognition) => any) | null;
    // Add other event handlers as needed (onspeechstart, onspeechend, etc.)
}


interface Props {
    onResult: (result: string) => void; // Callback to pass the result to the parent
}

function getSpeechRecognitionConstructor(): { new(): SpeechRecognition } | null { // Changed return type
    const w = window as any;

    if ('SpeechRecognition' in w) {
        return w.SpeechRecognition;
    } else if ('webkitSpeechRecognition' in w) {
        return w.webkitSpeechRecognition;
    } else {
        return null;
    }
}

const SpeechRecognitionComponent: React.FC<Props> = ({ onResult }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState('');
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        const SpeechRecognitionConstructor = getSpeechRecognitionConstructor(); // Get the constructor

        if (!SpeechRecognitionConstructor) {
            setError('Web Speech API is not supported in this browser.');
            return;
        }

        recognitionRef.current = new SpeechRecognitionConstructor(); // Use the constructor!
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = function (this: SpeechRecognition) {
            setIsListening(true);
        };

        recognitionRef.current.onresult = function (this: SpeechRecognition, event: SpeechRecognitionEvent) {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    setTranscript((prevTranscript) => prevTranscript + event.results[i][0].transcript);
                    onResult(event.results[i][0].transcript);
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
        };

      recognitionRef.current.onerror = function (this: SpeechRecognition, event: SpeechRecognitionErrorEvent) {
          let errorMessage = 'Speech recognition error: ';
          switch (event.error) {
              case 'no-speech':
                  errorMessage += 'No speech detected.';
                  break;
              case 'audio-capture':
                  errorMessage += 'Microphone not found or audio capture failed.';
                  break;
              case 'network':
                  errorMessage += 'Network error. Please check your connection.';
                  break;
              case 'not-allowed':
                  errorMessage += 'Permission to use the microphone was denied.';
                  break;
              case 'service-not-allowed':
                  errorMessage += 'Speech recognition service is not allowed.';
                  break;
              case 'bad-grammar':
                  errorMessage += 'Grammar or language error.';
                  break;
              case 'language-not-supported':
                  errorMessage += 'Language is not supported.';
                  break;
              default:
                  errorMessage += event.error; // Fallback to the original error code
          }
          setError(errorMessage);
          setIsListening(false);
      };

        recognitionRef.current.onend = function (this: SpeechRecognition) {
            setIsListening(false);
        };

        return () => {
            recognitionRef.current?.stop();
        };
    }, [onResult, error]);


    const startListening = () => {
        // More consistent null checks:
        if (recognitionRef.current && !isListening) {
            setTranscript('');
            setError('');
            try {
                recognitionRef.current.start();
            } catch (e) {
                setError("Error Starting recognition: " + e);
            }
        }
    };

    const stopListening = () => {
        // More consistent null checks:
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    };
    return (
        <div>
            <button
                onClick={isListening ? stopListening : startListening}
                className={isListening ? 'listening' : ''} // Add the class conditionally
            >
                {isListening ? 'Listening...' : 'Start Listening'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>Transcript: {transcript}</p>
             {/*<p>Interim Transcript: {interimTranscript}</p> */}
        </div>
    );
};

export default SpeechRecognitionComponent;