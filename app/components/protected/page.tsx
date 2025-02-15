'use client';
import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface  ProtectedRouteProps {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
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
