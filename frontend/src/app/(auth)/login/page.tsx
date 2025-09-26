'use client'

import {
  Card,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Divider,
} from '@mantine/core'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginDto, loginSchema } from './schemas/login'
import { useLogin } from './api/login'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/auth/auth-provider'
import { toast } from '@/app/libs/toast'

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    mode: 'all',
  })

  const router = useRouter()
  const { mutate, isPending: isLoading } = useLogin();
  const { login: onLogin } = useAuth();


  const onSubmit = handleSubmit(async (data) => {
    try {
      const loginPayload = { ...data };

      mutate(loginPayload, {
        onSuccess: (response) => {
          const user = response.user;
          
          console.log('Login successful, user:', user); 

          onLogin(user);
          toast.success({
            message: 'Login Successful!',
          });
          
          setTimeout(() => {
            router.replace('/home');
          }, 100);
        },
        onError: (error) => {
          console.error('Login error:', error);
          toast.error({
            message: 'Login failed. Please check your credentials.',
          });
        },
      });
    } catch (error) {
      console.error('Error during login', error);
      toast.error({
        message: 'An unexpected error occurred.',
      });
    }
  });

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center">
      <Card withBorder className="w-[50%]">
        <Stack gap="sm">
          <Title order={2} className="text-center">
            Login
          </Title>
          <Text c="dimmed" ta="center" size="sm">
            Welcome back! Please enter your details.
          </Text>

          <form onSubmit={onSubmit}>
            <TextInput
              label="Email"
              placeholder="Enter your email"
              size="md"
              radius="md"
              {...register('email')}
              error={errors.email?.message}
            />

            <div className='mt-5'>
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                size="md"
                radius="md"
                {...register('password')}
                error={errors.password?.message}
                style={{ marginTop:16 }}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              size="md"
              radius="md"
              color="dark"
              variant="filled"
              loading={isLoading}
              style={{ marginTop: 20 }}
            >
              Sign in
            </Button>
          </form>

          <Divider my="xs" />
          <Text size="xs" c="dimmed" ta="center">
            Don&apos;t have an account? <a href="/register" className="underline">Register</a>
          </Text>
        </Stack>
      </Card>
    </div>
  )
}