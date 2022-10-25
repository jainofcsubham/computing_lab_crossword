import React, { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import { LOGGED_IN_KEY, LOGGED_IN_VALUE } from '../../utils/constants'

export const ValidateLogin: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const isLoggedIn = localStorage.getItem(LOGGED_IN_KEY);
        if(isLoggedIn === LOGGED_IN_VALUE){
            navigate('/dashboard');
        }else{
            navigate('/login');
        }
    },[])
    return (
        <></>
    )
}
