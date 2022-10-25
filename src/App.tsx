import React from 'react'
import {BrowserRouter as Router, Routes,Route} from 'react-router-dom'
import { ValidateLogin } from './component/validate-login/ValidateLogin'
import { AdminCreate } from './page/admin-create/AdminCreate'
import { AdminList } from './page/admin-list/AdminList'
import { Crossword } from './page/crossword/Crossword'
import { Dashboard } from './page/dashboard/Dashboard'
import { Login } from './page/login/Login'
import { Profile } from './page/profile/Profile'
import { Register } from './page/register/Register'
export const App: React.FC = () => {
  

  return (
    <React.Fragment>
      {/* <img src="assets/logo.png"  alt='Logo'/> */}
      <Router>
        <Routes>
          <Route path='/' element={<ValidateLogin />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/admin/create' element={<AdminCreate />}/>
          <Route path='/admin/list' element={<AdminList />}/>
          <Route path='/crossword/:id' element={<Crossword />}/>
          <Route path='/dashboard' element={<Dashboard />}/>
          <Route path='/profile' element={<Profile />}/>
          <Route path='/register' element={<Register />}/>
        </Routes>
      </Router>
    </React.Fragment>
  )
}