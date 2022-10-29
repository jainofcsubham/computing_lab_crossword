import React from 'react'
import {Typography} from '@mui/material'
import { ValidateLogin } from '../../component/validate-login/ValidateLogin'

export const AdminCreate: React.FC = () => {
  return (
    <>
    <ValidateLogin>
        <Typography component="div">AdminCreate</Typography>
    </ValidateLogin>
    </>
  )

}
