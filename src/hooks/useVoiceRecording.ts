import axios from 'axios';
import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseVoiceRecordingReturn {
  isRecording: boolean;
  isTranscribing: boolean;
  transcript: string;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  cancelRecording: () => void;
  resetTranscript: () => void;
}

export function useVoiceRecording(apiToken: string): UseVoiceRecordingReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const isCancelledRef = useRef(false);
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      isCancelledRef.current = false;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/mp4;codecs=mp4a.40.2'
      });

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (!isCancelledRef.current) {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/mp4' });
          await transcribeAudio(audioBlob);
        }

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);

      toast({
        title: "Recording started",
        description: "Speak clearly for best results.",
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to access microphone';
      setError(errorMessage);
      toast({
        title: "Recording failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      isCancelledRef.current = false;
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsTranscribing(true);

      toast({
        title: "Processing audio",
        description: "AI is transcribing your recording...",
      });
    }
  }, [isRecording, toast]);


const transcribeAudio = useCallback(async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.m4a');
      
      const response = await fetch(
        'https://braindesk-60025565520.development.catalystserverless.in/server/vts-api/transcribe',
        {
          method: 'POST',
          headers: {
            'X-API-TOKEN': apiToken,
          },
          body: formData,
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.transcript) {
        setTranscript(data.transcript);
        toast({
          title: "Transcription complete",
          description: "Your voice has been successfully transcribed.",
        });
      } else {
        throw new Error('No transcript received from API');
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Transcription failed';
      setError(errorMessage);
      toast({
        title: "Transcription failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
    }
  }, [apiToken, toast]);


  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      isCancelledRef.current = true;
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      chunksRef.current = [];
      mediaRecorderRef.current = null;
    }
  }, [isRecording]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isRecording,
    isTranscribing,
    transcript,
    error,
    startRecording,
    stopRecording,
    cancelRecording,
    resetTranscript,
  };
}