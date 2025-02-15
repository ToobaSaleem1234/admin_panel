'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const AdminLogin = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    const router = useRouter ()
    const handleLogin = (e : React.FormEvent) => {
        e.preventDefault()
    }
    if (email === 'saleemtooba365@gmail.com')
  return (
    <div>AdminLogin</div>
  )
}

export default AdminLogin