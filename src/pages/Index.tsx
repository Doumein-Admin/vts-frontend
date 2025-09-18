import { useState, useEffect } from 'react';
import { RecordingBubble } from '@/components/RecordingBubble';
import { TranscriptView } from '@/components/TranscriptView';
import { ApiTokenDialog } from '@/components/ApiTokenDialog';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';

const Index = () => {
  const [apiToken, setApiToken] = useState<string>('');
  const [showTokenDialog, setShowTokenDialog] = useState(true);
  
  const {
    isRecording,
    isTranscribing,
    transcript,
    error,
    startRecording,
    stopRecording,
    resetTranscript,
  } = useVoiceRecording(apiToken);

  const hasTranscript = transcript.length > 0;

  useEffect(() => {
    // Check if token exists in localStorage
    const savedToken = localStorage.getItem('voiceApiToken');
    if (savedToken) {
      setApiToken(savedToken);
      setShowTokenDialog(false);
    }
  }, []);

  const handleTokenSubmit = (token: string) => {
    setApiToken(token);
    localStorage.setItem('voiceApiToken', token);
    setShowTokenDialog(false);
  };

  const handleNewRecording = () => {
    resetTranscript();
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-ai-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-ai-secondary/10 rounded-full blur-3xl animate-pulse animation-delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-ai-accent/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        {!hasTranscript && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-center z-20 ai-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-ai-primary via-ai-secondary to-ai-accent bg-clip-text text-transparent">
                AI Voice
              </span>
              <br />
              <span className="text-foreground">Transcription</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Transform your voice into text with precision AI technology
            </p>
          </div>
        )}

        {/* Recording Bubble */}
        <RecordingBubble
          isRecording={isRecording}
          isTranscribing={isTranscribing}
          isMinimized={hasTranscript}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
        />

        {/* Transcript View */}
        <TranscriptView
          transcript={transcript}
          isVisible={hasTranscript}
          onNewRecording={handleNewRecording}
        />

        {/* Footer */}
        {!hasTranscript && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center ai-fade-in">
            <p className="text-sm text-muted-foreground">
              Powered by advanced AI • Secure & Private
            </p>
          </div>
        )}
      </div>

      {/* API Token Dialog */}
      <ApiTokenDialog
        open={showTokenDialog}
        onTokenSubmit={handleTokenSubmit}
      />

      {/* Error toast will be handled by the useVoiceRecording hook */}
    </div>
  );
};

export default Index;
