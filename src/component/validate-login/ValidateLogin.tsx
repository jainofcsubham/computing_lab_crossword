import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ValidateLogin: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [show, setShow] = useState<boolean>(false);
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("crossword_logged_in");
    if (!isLoggedIn) {
      navigate("/login");
    }
    setShow(true);
  }, []);
  return <>{show && children}</>;
};
