import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  Grid,
  Card,
  Group,
  Badge,
  ThemeIcon,
  SimpleGrid,
} from '@mantine/core';
import {
  IconRocket,
  IconShield,
  IconCode,
  IconPalette,
  IconBrandReact,
  IconBrandTypescript,
  IconArrowRight,
} from '@tabler/icons-react';
import { Helmet } from 'react-helmet-async';
import { env } from '@/config/env';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

function FeatureCard({ icon, title, description, badge }: FeatureCardProps) {
  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder className='h-full'>
      <Stack gap='md'>
        <Group justify='space-between'>
          <ThemeIcon size='xl' radius='md' variant='light'>
            {icon}
          </ThemeIcon>
          {badge && (
            <Badge variant='light' size='sm'>
              {badge}
            </Badge>
          )}
        </Group>
        <div>
          <Title order={3} size='h4' mb='xs'>
            {title}
          </Title>
          <Text size='sm' c='dimmed'>
            {description}
          </Text>
        </div>
      </Stack>
    </Card>
  );
}

export function HomePage() {
  const features = [
    {
      icon: <IconBrandReact size={24} />,
      title: 'React 19',
      description:
        'Built with the latest React features including concurrent rendering and automatic batching.',
      badge: 'Latest',
    },
    {
      icon: <IconBrandTypescript size={24} />,
      title: 'TypeScript',
      description:
        'Full type safety with strict TypeScript configuration for better developer experience.',
      badge: 'Type Safe',
    },
    {
      icon: <IconPalette size={24} />,
      title: 'Mantine UI',
      description:
        'Beautiful and accessible components with built-in dark mode support.',
    },
    {
      icon: <IconCode size={24} />,
      title: 'TailwindCSS',
      description:
        'Utility-first CSS framework for rapid UI development with custom design system.',
    },
    {
      icon: <IconRocket size={24} />,
      title: 'Vite Build',
      description:
        'Lightning-fast development server and optimized production builds.',
      badge: 'Fast',
    },
    {
      icon: <IconShield size={24} />,
      title: 'Enterprise Ready',
      description:
        'Production-ready setup with ESLint, Prettier, Husky, and comprehensive error handling.',
      badge: 'Production',
    },
  ];

  return (
    <>
      <Helmet>
        <title>{env.APP_NAME} - Enterprise React Application</title>
        <meta name='description' content={env.APP_DESCRIPTION} />
        <meta
          name='keywords'
          content='React, TypeScript, Mantine, TailwindCSS, Vite, Enterprise'
        />
        <meta
          property='og:title'
          content={`${env.APP_NAME} - Enterprise React Application`}
        />
        <meta property='og:description' content={env.APP_DESCRIPTION} />
        <meta property='og:type' content='website' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta
          name='twitter:title'
          content={`${env.APP_NAME} - Enterprise React Application`}
        />
        <meta name='twitter:description' content={env.APP_DESCRIPTION} />
      </Helmet>

      <div className='min-h-screen'>
        {/* Hero Section */}
        <section className='bg-gradient-to-br from-blue-50 to-indigo-100 py-20 dark:from-gray-900 dark:to-gray-800'>
          <Container size='lg'>
            <div className='text-center'>
              <Badge
                size='lg'
                variant='light'
                mb='xl'
                className='animate-fade-in'
              >
                v{env.APP_VERSION} • Enterprise Ready
              </Badge>

              <Title
                order={1}
                size='3.5rem'
                fw={900}
                mb='xl'
                className='animate-slide-up bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
              >
                {env.APP_NAME}
              </Title>

              <Text
                size='xl'
                c='dimmed'
                mb='xl'
                maw={600}
                mx='auto'
                className='animate-slide-up'
                style={{ animationDelay: '0.1s' }}
              >
                {env.APP_DESCRIPTION}. Built with modern technologies and best
                practices for scalable enterprise applications.
              </Text>

              <Group
                justify='center'
                gap='md'
                className='animate-slide-up'
                style={{ animationDelay: '0.2s' }}
              >
                <Button
                  size='lg'
                  rightSection={<IconArrowRight size={16} />}
                  className='shadow-lg transition-shadow hover:shadow-xl'
                >
                  Get Started
                </Button>
                <Button
                  size='lg'
                  variant='light'
                  component='a'
                  href='https://github.com'
                  target='_blank'
                  className='shadow-lg transition-shadow hover:shadow-xl'
                >
                  View on GitHub
                </Button>
              </Group>
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <section className='py-20'>
          <Container size='lg'>
            <div className='mb-16 text-center'>
              <Title order={2} size='2.5rem' mb='md'>
                Built for Modern Development
              </Title>
              <Text size='lg' c='dimmed' maw={600} mx='auto'>
                Everything you need to build scalable, maintainable, and
                performant React applications.
              </Text>
            </div>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing='lg'>
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className='animate-slide-up'
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <FeatureCard {...feature} />
                </div>
              ))}
            </SimpleGrid>
          </Container>
        </section>

        {/* Tech Stack Section */}
        <section className='bg-gray-50 py-20 dark:bg-gray-900'>
          <Container size='lg'>
            <div className='mb-16 text-center'>
              <Title order={2} size='2rem' mb='md'>
                Modern Tech Stack
              </Title>
              <Text size='lg' c='dimmed'>
                Carefully selected technologies for optimal developer experience
                and performance.
              </Text>
            </div>

            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card
                  shadow='sm'
                  padding='xl'
                  radius='md'
                  withBorder
                  className='h-full'
                >
                  <Stack gap='md'>
                    <Title order={3} size='h4'>
                      Frontend Technologies
                    </Title>
                    <Stack gap='xs'>
                      <Text size='sm'>• React 19 with TypeScript</Text>
                      <Text size='sm'>• Mantine UI Components</Text>
                      <Text size='sm'>• TailwindCSS for Styling</Text>
                      <Text size='sm'>• React Router for Navigation</Text>
                      <Text size='sm'>• React Helmet for SEO</Text>
                    </Stack>
                  </Stack>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card
                  shadow='sm'
                  padding='xl'
                  radius='md'
                  withBorder
                  className='h-full'
                >
                  <Stack gap='md'>
                    <Title order={3} size='h4'>
                      Development Tools
                    </Title>
                    <Stack gap='xs'>
                      <Text size='sm'>• Vite for Fast Development</Text>
                      <Text size='sm'>• ESLint + Prettier</Text>
                      <Text size='sm'>• Husky Git Hooks</Text>
                      <Text size='sm'>• TypeScript Strict Mode</Text>
                      <Text size='sm'>• Path Mapping & Aliases</Text>
                    </Stack>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Container>
        </section>

        {/* CTA Section */}
        <section className='py-20'>
          <Container size='sm'>
            <Card
              shadow='lg'
              padding='xl'
              radius='lg'
              className='bg-gradient-to-r from-blue-500 to-purple-600 text-center text-white'
            >
              <Stack gap='lg'>
                <Title order={2} c='white'>
                  Ready to Build Something Amazing?
                </Title>
                <Text size='lg' c='white' opacity={0.9}>
                  Start building your next enterprise application with this
                  production-ready setup.
                </Text>
                <Group justify='center'>
                  <Button
                    size='lg'
                    variant='white'
                    color='blue'
                    rightSection={<IconArrowRight size={16} />}
                  >
                    Start Building
                  </Button>
                </Group>
              </Stack>
            </Card>
          </Container>
        </section>
      </div>
    </>
  );
}
