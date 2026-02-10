'use client';

import { useState, useEffect, useRef } from 'react';
import { Fab, Tooltip, Box, Typography, Zoom } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import CircularProgress from '@mui/material/CircularProgress';

type CallStatus = 'idle' | 'connecting' | 'active' | 'ended';

export default function VapiWidget() {
  const [status, setStatus] = useState<CallStatus>('idle');
  const [showLabel, setShowLabel] = useState(true);
  const vapiRef = useRef<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowLabel(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const startCall = async () => {
    if (status === 'active' || status === 'connecting') {
      if (vapiRef.current) {
        vapiRef.current.stop();
        setStatus('ended');
        setTimeout(() => setStatus('idle'), 2000);
      }
      return;
    }

    try {
      setStatus('connecting');
      const { default: Vapi } = await import('@vapi-ai/web');
      const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!);
      vapiRef.current = vapi;

      vapi.on('call-start', () => setStatus('active'));
      vapi.on('call-end', () => {
        setStatus('ended');
        setTimeout(() => setStatus('idle'), 2000);
      });
      vapi.on('error', () => {
        setStatus('idle');
      });

      await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!);
    } catch {
      setStatus('idle');
    }
  };

  const getColor = () => {
    switch (status) {
      case 'connecting': return 'warning.main';
      case 'active': return 'error.main';
      case 'ended': return 'text.secondary';
      default: return 'primary.main';
    }
  };

  const getTooltip = () => {
    switch (status) {
      case 'connecting': return 'Connecting...';
      case 'active': return 'Tap to end call';
      case 'ended': return 'Call ended';
      default: return 'Talk to HOA Assistant';
    }
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1300, display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Zoom in={showLabel || status === 'active'}>
        <Box sx={{
          bgcolor: 'background.paper',
          px: 2,
          py: 1,
          borderRadius: 2,
          boxShadow: 3,
        }}>
          <Typography variant="body2" fontWeight={500}>
            {status === 'active' ? 'Call in progress...' : 'Need help? Talk to us!'}
          </Typography>
        </Box>
      </Zoom>

      <Tooltip title={getTooltip()} placement="left">
        <Fab
          onClick={startCall}
          sx={{
            bgcolor: getColor(),
            color: 'white',
            '&:hover': { bgcolor: getColor(), opacity: 0.9 },
            width: 64,
            height: 64,
            animation: status === 'active' ? 'pulse 2s infinite' : 'none',
            '@keyframes pulse': {
              '0%': { boxShadow: '0 0 0 0 rgba(229, 57, 53, 0.4)' },
              '70%': { boxShadow: '0 0 0 15px rgba(229, 57, 53, 0)' },
              '100%': { boxShadow: '0 0 0 0 rgba(229, 57, 53, 0)' },
            },
          }}
        >
          {status === 'connecting' ? (
            <CircularProgress size={28} sx={{ color: 'white' }} />
          ) : status === 'active' ? (
            <PhoneDisabledIcon sx={{ fontSize: 28 }} />
          ) : (
            <PhoneIcon sx={{ fontSize: 28 }} />
          )}
        </Fab>
      </Tooltip>
    </Box>
  );
}
