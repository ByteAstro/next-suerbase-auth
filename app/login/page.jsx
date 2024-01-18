"use client"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const supabase = createClientComponentClient();

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        }
        getUser();
    }, [])

    const handleSignup = async () => {
        const res = await supabase.auth.signUp({
            email, password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`
            }
        })
        setUser(res.data.user)
        router.refresh();
        setEmail('');
        setPassword('');
    }

    const handleSignin = async () => {
        const res = await supabase.auth.signInWithPassword({
            email, password
        })
        setUser(res.data.user)
        router.refresh();
        setEmail('');
        setPassword('');
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        setUser(null);
    }


    if (loading) {
        return <h1>Loading...</h1>
    }

    if (user) {
        return (
            <div className='h-screen flex flex-col justify-center items-center bg-gray-100'>
                <div className='bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-96 text-center'>
                    <h1 className='mb-4 text-xl font-bold text-gray-700 dark:text-gray-300'>You've already LoggedIn</h1>
                    <button className='w-full p-3 rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none'
                        onClick={handleLogout}
                    >Logout
                    </button>
                </div>
            </div>
        )
    }


    return (
        <main className='h-screen flex items-center justify-center bg-gray-800 p-6'>
            <div className='bg-gray-900 p-8 rounded-lg shadow-md w-96'>
                <input className='mb-4 w-full p-3 rounded-md border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500'
                    placeholder='Enter Email'
                    type="email" name='email' value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input className='mb-4 w-full p-3 rounded-md border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500'
                    placeholder='Enter Password'
                    type="password" name='password' value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className='w-full mb-2 p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none'
                    onClick={handleSignup}
                >Sign Up</button>
                <button
                    className='w-full mb-2 p-3 rounded-md bg-gray-700 text-white hover:bg-gray-600 focus:outline-none'
                    onClick={handleSignin}
                >Sign In</button>
            </div>
        </main>
    )
}