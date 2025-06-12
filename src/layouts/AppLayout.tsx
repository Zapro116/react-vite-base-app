import React, { ReactNode } from 'react';
import { AppShell, Burger, Group, Text, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconHome, IconSettings, IconUser } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { env } from '@/config/env';
import { ROUTES } from '@/constants';

interface AppLayoutProps {
  children: ReactNode;
}

interface NavItem {
  icon: React.ComponentType<{ size?: number | string }>;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: IconHome, label: 'Home', path: ROUTES.HOME },
  { icon: IconUser, label: 'Profile', path: ROUTES.PROFILE },
  { icon: IconSettings, label: 'Settings', path: ROUTES.SETTINGS },
];

export function AppLayout({ children }: AppLayoutProps) {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (opened) {
      toggle(); // Close mobile menu after navigation
    }
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding='md'
    >
      <AppShell.Header>
        <Group h='100%' px='md' justify='space-between'>
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom='sm'
              size='sm'
            />
            <Text
              size='xl'
              fw={700}
              c='blue'
              style={{ cursor: 'pointer' }}
              onClick={() => handleNavigation(ROUTES.HOME)}
            >
              {env.APP_NAME}
            </Text>
          </Group>

          <Group visibleFrom='sm'>
            <Text size='sm' c='dimmed'>
              v{env.APP_VERSION}
            </Text>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p='md'>
        <AppShell.Section grow>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <UnstyledButton
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                style={theme => ({
                  display: 'block',
                  width: '100%',
                  padding: theme.spacing.xs,
                  borderRadius: theme.radius.sm,
                  color: isActive
                    ? 'var(--mantine-color-blue-6)'
                    : 'var(--mantine-color-text)',
                  backgroundColor: isActive
                    ? 'var(--mantine-color-blue-light)'
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: 'var(--mantine-color-gray-light-hover)',
                  },
                })}
              >
                <Group gap='sm'>
                  <Icon size={16} />
                  <Text size='sm'>{item.label}</Text>
                </Group>
              </UnstyledButton>
            );
          })}
        </AppShell.Section>

        <AppShell.Section>
          <Text size='xs' c='dimmed' ta='center'>
            {env.APP_DESCRIPTION}
          </Text>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
