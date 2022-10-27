import React, { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import { useDataBase } from '../../hook/useDataBase';

export const ValidateLogin: React.FC = () => {
    const navigate = useNavigate();
    const {getCurrentUser}  = useDataBase()
    useEffect(() => {
        const user = getCurrentUser()
        if(!user){
            navigate('/login');
        }else{
            navigate('/dashboard');
        }
    },[])
    return (
        <></>
    )
}
