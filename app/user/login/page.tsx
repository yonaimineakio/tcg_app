import LoginForm from '@/components/login-form';
import { Suspense } from 'react';

export default async function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm/>
        </Suspense>


    )
  }