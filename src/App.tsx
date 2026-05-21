import { useState, useEffect, useRef } from 'react';

function App() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Update word count when transcript changes
    const count = transcript.trim() === '' ? 0 : transcript.split(/\s+/).length;
    setWordCount(count);
  }, [transcript]);

  useEffect(() => {
    // Check for SpeechRecognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const results = event.results;
      for (let i = event.resultIndex; i < results.length; ++i) {
        if (results[i].isFinal) {
          setTranscript(prev => prev + results[i][0].transcript);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 transition-colors">
      <header className="bg-gray-800/50 backdrop-blur-sm p-4 sticky top-0 z-20 border-b border-gray-700">
        <div className="max-w-4xl mx-auto flex flex-col items-start gap-4">
          <h1 className="text-3xl font-bold">Flynn Clan Dashboard</h1>
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => document.documentElement.classList.toggle('dark')}
              className="px-3 py-1 rounded text-sm hover:bg-gray-700/50"
            >
              Toggle Dark Mode
            </button>
            <span className="text-xs text-gray-400">
              Live • {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {!isSupported && (
          <div className="bg-red-900/50 border border-red-800 rounded-lg p-6">
            <h2 className="text-red-400 font-semibold mb-4">Speech Recognition Not Supported</h2>
            <p className="text-gray-400">
              Your browser does not support the Web Speech API. Please use Chrome,
              Edge, or Safari for this feature.
            </p>
          </div>
        )}

        <div className="mt-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Live Ear Transcription</h2>
            <p className="text-gray-400 mb-4">
              Click to start/stop. Your speech will be transcribed in real-time.
            </p>
            <div className="whitespace-pre-wrap break-words bg-gray-800 p-4 rounded-lg min-h-[100px] mb-4">
              {transcript || <em className="text-gray-500 italic">Listening...</em>}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isListening
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                }`}
              >
                {isListening ? 'Stop Listening' : 'Start Listening'}
              </button>
              <button
                onClick={clearTranscript}
                className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-700/50 text-gray-300"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Statistics</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Word Count</p>
                <p className="font-medium text-gray-100">{wordCount}</p>
              </div>
              <div>
                <p className="text-gray-400">Character Count</p>
                <p className="font-medium text-gray-100">{transcript.length}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800/50 backdrop-blur-sm p-4 sticky bottom-0 z-20 border-t border-gray-700">
        <div className="max-w-4xl mx-auto text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Flynn Clan. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
