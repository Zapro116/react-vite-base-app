import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  Group,
  ThemeIcon,
} from '@mantine/core';
import {
  IconHome,
  IconArrowLeft,
  IconExclamationMark,
} from '@tabler/icons-react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { env } from '@/config/env';
import { ROUTES } from '@/constants';

export function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(ROUTES.HOME);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | {env.APP_NAME}</title>
        <meta
          name='description'
          content="The page you're looking for doesn't exist."
        />
        <meta name='robots' content='noindex, nofollow' />
      </Helmet>

      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'>
        <Container size='sm'>
          <div className='text-center'>
            <div className='mb-8'>
              <ThemeIcon
                size={120}
                radius='xl'
                variant='light'
                color='red'
                className='mx-auto mb-6 animate-bounce'
              >
                <IconExclamationMark size={60} />
              </ThemeIcon>

              <Title
                order={1}
                size='6rem'
                fw={900}
                c='red'
                className='mb-4 animate-fade-in'
                style={{ lineHeight: 1 }}
              >
                404
              </Title>

              <Title
                order={2}
                size='2rem'
                mb='md'
                className='animate-slide-up'
                style={{ animationDelay: '0.1s' }}
              >
                Page Not Found
              </Title>

              <Text
                size='lg'
                c='dimmed'
                mb='xl'
                maw={500}
                mx='auto'
                className='animate-slide-up'
                style={{ animationDelay: '0.2s' }}
              >
                Oops! The page you're looking for doesn't exist. It might have
                been moved, deleted, or you entered the wrong URL.
              </Text>
            </div>

            <Stack
              gap='md'
              className='animate-slide-up'
              style={{ animationDelay: '0.3s' }}
            >
              <Group justify='center' gap='md'>
                <Button
                  size='lg'
                  leftSection={<IconHome size={16} />}
                  onClick={handleGoHome}
                  className='shadow-lg transition-shadow hover:shadow-xl'
                >
                  Go to Homepage
                </Button>

                <Button
                  size='lg'
                  variant='light'
                  leftSection={<IconArrowLeft size={16} />}
                  onClick={handleGoBack}
                  className='shadow-lg transition-shadow hover:shadow-xl'
                >
                  Go Back
                </Button>
              </Group>

              <Text size='sm' c='dimmed' mt='lg'>
                If you believe this is an error, please contact our support
                team.
              </Text>
            </Stack>

            {/* Decorative elements */}
            <div className='mt-16 opacity-20'>
              <div className='flex justify-center space-x-8'>
                <div className='h-2 w-2 animate-ping rounded-full bg-blue-500'></div>
                <div
                  className='h-2 w-2 animate-ping rounded-full bg-purple-500'
                  style={{ animationDelay: '0.2s' }}
                ></div>
                <div
                  className='h-2 w-2 animate-ping rounded-full bg-pink-500'
                  style={{ animationDelay: '0.4s' }}
                ></div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
