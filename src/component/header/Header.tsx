import React, { useState } from "react";
import { Typography, Button, Popover } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDatabaseContext } from "../../context/data.service";
import styles from "./Header.module.scss";

export const Header: React.FC = () => {
  const { getCurrentUser } = useDatabaseContext();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);


  const onNavigation = (path: string) => {
    if (pathname !== path) {
      navigate(path);
    }
  };

  const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Typography className={styles.container} component={"div"}>
        <Typography
          onClick={() => {
            onNavigation("/");
          }}
          className={styles.left}
          component={"div"}
        >
          <img className={styles.logo} src="/assets/logo.png" alt="logo" />
          <Typography className={styles.brand} component="div">
            CrossWord
          </Typography>
        </Typography>
        <Typography className={styles.right} component={"div"}>
          {getCurrentUser() ? (
            <>
              {/* {getCurrentUser()?.isAdmin && (
                <Typography component={"div"}>
                  <Button
                    className={styles.manage_puzzle}
                    onClick={() => {
                      onNavigation("/admin/list");
                    }}
                  >
                    Manage Puzzles
                  </Button>
                </Typography>
              )} */}
              <Typography
                className={styles.profile_container}
                component={"div"}
                onClick={handleClick}
              >
                {getCurrentUser()?.picture ? (
                  <img
                    className={styles.profile_pic}
                    src={getCurrentUser()?.picture}
                    alt="profile"
                  />
                ) : (
                  <img
                    className={styles.profile_pic}
                    src="/assets/profile.jpg"
                    alt="profile"
                  />
                )}
              </Typography>
            </>
          ) : (
            <Typography component={"div"}>
              <Typography component={"div"}>
                <Button
                  className={styles.get_started}
                  variant="contained"
                  onClick={() => {
                    onNavigation("/get-started");
                  }}
                >
                  Get Started
                </Button>
              </Typography>
            </Typography>
          )}
        </Typography>
      </Typography>

      <Popover
        id="pop-over"
        open={anchorEl ? true : false}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >Subham  Jain</Popover>
    </>
  );
};
