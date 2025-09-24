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
import { useRouter } from 'next/navigation'
import { RegisterDto, registerSchema } from './schemas/register'
import { useRegister } from './api/register'
import { toast } from '@/app/libs/toast'
import { useAuth } from '@/app/auth/auth-provider'


export default function RegisterPage() {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterDto>({
        resolver: zodResolver(registerSchema),
        mode: 'all',
    })

    const router = useRouter()
    const { mutate, isPending: isLoading } = useRegister();
    const { login: onLogin } = useAuth();

    const onSubmit = handleSubmit(async (data) => {
        try {

            const registerPayload = { ...data };

            mutate(registerPayload, {
                onSuccess: (data) => {
                    onLogin(data);
                    toast.success({
                        message: ('Register Successful! Redirecting to Home Page'),
                    });
                    router.push('/');
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
                        Register
                    </Title>
                    <Text c="dimmed" ta="center" size="sm">
                        Hello, welcome to our platform! Please register to continue.
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
                                style={{ marginTop: 16 }}


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
                            Register
                        </Button>
                    </form>

                    <Divider my="xs" />
                    <Text size="xs" c="dimmed" ta="center">
                        Already have an account? <a href="/login" className="underline">Login</a>
                    </Text>
                </Stack>
            </Card>
        </div>
    )
}
