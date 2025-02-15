'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ProtectedRoute = ({ children }: {children : React.ReactNode}) => {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  return <div>{children}</div>;
};

export default ProtectedRoute;
