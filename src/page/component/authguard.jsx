// การนำเข้าและประกาศ Object เมื่อนำมาใช้งานของ Framework สำหรับ React
import { useEffect, useState } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthGuard = (item) => {
    // ทำ middleware
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(null);
    let token = localStorage.getItem(import.meta.env.VITE_TOKEN);
    useEffect(() => {
        if (!token) {
            if (item.role !== 'login') {
                setIsAuthorized(false);
            } else {
                setIsAuthorized(true);
            }
        } else {
            if (item.role) {
                const decoded = jwtDecode(token);
                item.role === 'admin' && decoded.EmployeeUserType === 'admin' ? setIsAuthorized(true) : item.role === 'user' && decoded.EmployeeUserType === 'user' ? setIsAuthorized(true) : decoded.EmployeeUserType === 'admin' ? navigate('/manageuser') : decoded.EmployeeUserType === 'user' ? navigate('/home') : navigate(-1);
            }
        }
    }, [token, item.role, navigate]);
    if (isAuthorized === null) { return null; }

    return isAuthorized ? <Outlet /> : <Navigate to='/' />;
}

export default AuthGuard;