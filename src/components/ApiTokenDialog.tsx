import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, Sparkles } from 'lucide-react';

interface ApiTokenDialogProps {
  open: boolean;
  onTokenSubmit: (token: string) => void;
}

export function ApiTokenDialog({ open, onTokenSubmit }: ApiTokenDialogProps) {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onTokenSubmit(token.trim());
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="glass-intense border-ai-glass/30 max-w-md">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-ai-primary to-ai-secondary flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-ai-primary to-ai-secondary bg-clip-text text-transparent">
            AI Voice Transcription
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter your API token to start transcribing your voice with AI precision
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="token" className="text-foreground font-medium">
              API Token
            </Label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="token"
                type="password"
                placeholder="Enter your API token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="pl-10 glass border-ai-glass/30 focus:border-ai-primary"
                required
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-ai-primary to-ai-secondary hover:from-ai-primary/90 hover:to-ai-secondary/90"
            disabled={!token.trim()}
          >
            Start Transcribing
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}