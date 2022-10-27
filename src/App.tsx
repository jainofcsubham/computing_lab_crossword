import React from "react";
import { BrowserRouter as Router, Routes, Route ,Navigate} from "react-router-dom";
import { Header } from "./component/header/Header";
import { Database } from "./context/data.service";
import { AdminCreate } from "./page/admin-create/AdminCreate";
import { AdminList } from "./page/admin-list/AdminList";
import { Crossword } from "./page/crossword/Crossword";
import { Dashboard } from "./page/dashboard/Dashboard";
import { Login } from "./page/login/Login";
import { Profile } from "./page/profile/Profile";
import { Register } from "./page/register/Register";
export const App: React.FC = () => {
  return (
    <Database>
      <React.Fragment>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/create" element={<AdminCreate />} />
            <Route path="/admin/list" element={<AdminList />} />
            <Route path="/crossword/:id" element={<Crossword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      </React.Fragment>
    </Database>
  );
};
