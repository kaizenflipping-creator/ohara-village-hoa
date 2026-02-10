'use client';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Pay Dues', href: '/pay' },
  { label: 'Documents', href: '/documents' },
  { label: 'News', href: '/news' },
  { label: 'Board Login', href: '/login' },
];

export default function PublicNavbar() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'inherit' }}>
          <Box
            component="img"
            src="/logo.svg"
            alt="O'Hara Village HOA Logo"
            sx={{ width: 40, height: 40 }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            O&apos;Hara Village HOA
          </Typography>
        </Link>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                sx={{
                  color: 'text.primary',
                  fontSize: '0.875rem',
                  px: { xs: 1, sm: 2 },
                  '&:hover': {
                    backgroundColor: 'rgba(46, 125, 50, 0.08)',
                    color: 'primary.main',
                  },
                }}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
