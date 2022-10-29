import React from "react";
import {Typography} from "@mui/material"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Header } from "./component/header/Header";
import { Database } from "./context/data.service";
import { AdminCreate } from "./page/admin-create/AdminCreate";
import { AdminList } from "./page/admin-list/AdminList";
import { Crossword } from "./page/crossword/Crossword";
import { Dashboard } from "./page/dashboard/Dashboard";
import { Home } from "./page/home/Home";
import { Login } from "./page/login/Login";
import { Profile } from "./page/profile/Profile";
import { Register } from "./page/register/Register";
import styles from "./App.module.scss"
import { GetStarted } from "./page/get-started/GetStarted";
 
export const App: React.FC = () => {
  return (
    <Typography className={styles.root} component={'div'}>
      <Router>
        <Database>
          <React.Fragment>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/admin/create" element={<AdminCreate />} />
              <Route path="/admin/list" element={<AdminList />} />
              <Route path="/crossword/:id" element={<Crossword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </React.Fragment>
        </Database>
      </Router>
    </Typography>
  );
};
