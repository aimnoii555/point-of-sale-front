import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { UseAuth } from '../hooks/UseAuth'

const ProtectedRoute = ({ redirectPath = "/login" }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [checking, setChecking] = useState(true)

    useEffect(() => {

        const token = localStorage.getItem("user_token");
        setIsLoggedIn(!!token);
        setChecking(false) // เมื่อเช็คเสร็จ ให้ปิด loading
    }, []);

    if (checking) return null; // spinner or loading


    if (!isLoggedIn) {
        return <Navigate to={redirectPath} replace />
    } else {
        return <Outlet />
    }

}

export default ProtectedRoute

