'use client'

import { useAuth } from '../../auth/auth-provider'
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
import { toast } from '../../libs/toast'
import { useRouter, useSearchParams } from 'next/navigation'


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
  const { mutate,isPending: isLoading } = useLogin();
  const { login: onLogin } = useAuth();

  const searchParams = useSearchParams();
const next = searchParams.get('next') || '/home';

  const onSubmit = handleSubmit(async (data) => {
    try {

      const loginPayload = { ...data };

      mutate(loginPayload, {
        onSuccess: (data) => {
          onLogin(data);
          toast.success({
            message: ('Login Successful!'),
          });
          router.replace(next); 
        },
      });
    } catch (error) {
      console.error('Error during login and token fetch', error);
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
            Don’t have an account? <a href="/register" className="underline">Register</a>
          </Text>
        </Stack>
      </Card>
    </div>
  )
}
