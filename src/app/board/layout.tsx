'use client';

import Box from '@mui/material/Box';
import BoardSidebar, { DRAWER_WIDTH } from '@/components/layout/BoardSidebar';

export default function BoardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <BoardSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          minHeight: '100vh',
          backgroundColor: 'background.default',
          p: 4,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
