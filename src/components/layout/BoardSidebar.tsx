'use client';

import { usePathname, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import CampaignOutlined from '@mui/icons-material/CampaignOutlined';
import PhoneCallbackOutlined from '@mui/icons-material/PhoneCallbackOutlined';
import NotificationsOutlined from '@mui/icons-material/NotificationsOutlined';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import PaymentOutlined from '@mui/icons-material/PaymentOutlined';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import AssignmentOutlined from '@mui/icons-material/AssignmentOutlined';
import LogoutOutlined from '@mui/icons-material/LogoutOutlined';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

export const DRAWER_WIDTH = 260;

const navItems = [
  { label: 'Overview', href: '/board', icon: <DashboardOutlined /> },
  { label: 'Announcements', href: '/board/announcements', icon: <CampaignOutlined /> },
  { label: 'Call Notes', href: '/board/call-notes', icon: <PhoneCallbackOutlined /> },
  { label: 'Notifications', href: '/board/notifications', icon: <NotificationsOutlined /> },
  { label: 'Residents', href: '/board/residents', icon: <PeopleOutlined /> },
  { label: 'Payments', href: '/board/payments', icon: <PaymentOutlined /> },
  { label: 'Documents', href: '/board/documents', icon: <DescriptionOutlined /> },
  { label: 'Form Submissions', href: '/board/form-submissions', icon: <AssignmentOutlined /> },
];

export default function BoardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const isActive = (href: string) => {
    if (href === '/board') return pathname === '/board';
    return pathname.startsWith(href);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid rgba(0,0,0,0.08)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2.5,
          py: 2.5,
        }}
      >
        <Image
          src="/logo.svg"
          alt="O'Hara Village Logo"
          width={36}
          height={36}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            fontSize: '1.05rem',
          }}
        >
          O&apos;Hara Village
        </Typography>
      </Box>

      <Divider />

      <List sx={{ px: 1.5, py: 1.5, flexGrow: 1 }}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <ListItemButton
              key={item.href}
              onClick={() => router.push(item.href)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                backgroundColor: active ? 'rgba(46, 125, 50, 0.1)' : 'transparent',
                color: active ? 'primary.main' : 'text.primary',
                '&:hover': {
                  backgroundColor: active
                    ? 'rgba(46, 125, 50, 0.15)'
                    : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: active ? 'primary.main' : 'text.secondary',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: active ? 600 : 400,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          startIcon={<LogoutOutlined />}
          onClick={handleLogout}
          sx={{
            justifyContent: 'flex-start',
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              color: 'error.main',
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
}
