import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDatabaseContext } from "../../context/data.service";

export const Header: React.FC = () => {
  const { getCurrentUser } = useDatabaseContext();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onLogin = () => {
    const to  = "/login";
    if(pathname !== to){
      navigate(to);
    }
  };
  const onSignUp = () => {
    const to  = "/register";
    if(pathname !== to){
      navigate(to);
    }
  };

  const onManage = () => {
    const to  = "/admin/list";
    if(pathname !== to){
      navigate(to);
    }
  };

  const onProfile = () => {
    const to  = "/profile";
    if(pathname !== to){
      navigate(to);
    }
  };

  return (
    <>
      <div>
        <div>
          <img src="/assets/logo.png" alt="logo" /> CROSSWORD
        </div>
        <div>
          {getCurrentUser() ? (
            <div>
              {getCurrentUser()?.isAdmin && (
                <div>
                  <button onClick={onManage}>Manage Puzzles</button>
                </div>
              )}
              <div onClick={onProfile}>
                {
                  getCurrentUser()?.picture ? <img src={getCurrentUser()?.picture} alt="profile"/>  : <img src="/assets/profile.jpg" alt="profile" />
                }
                
              </div>
            </div>
          ) : (
            <div>
              <div>
                <button onClick={onLogin}>Log In</button>
              </div>
              <div>
                <button onClick={onSignUp}>Sign up</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
