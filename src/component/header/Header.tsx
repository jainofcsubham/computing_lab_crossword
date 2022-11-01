import React, { useState } from "react";
import { Typography, Popover } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDatabaseContext } from "../../context/data.service";
import styles from "./Header.module.scss";

export const Header: React.FC = () => {
  const { getCurrentUser ,logoutUser} = useDatabaseContext();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const onNavigation = (path: string) => {
    handleClose()
    if (pathname !== path) {
      navigate(path);
    }
  };

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };


  const onLogout = (_e:any) => {
    handleClose()
    logoutUser()
    localStorage.removeItem("crossword_logged_in")
    navigate("/")
  }

  const onHistory = () => {
    handleClose()
    navigate("/history")
  }

  return (
    <>
      <Typography className={styles.container} component={"div"}>
        <Typography
          onClick={() => {
            getCurrentUser() ?  onNavigation("/dashboard") : onNavigation("/");
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
                      onNavigation("/admin");
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
                    src="/assets/profile.png"
                    alt="profile"
                  />
                )}
              </Typography>
            </>
          ) : (
            <></>
          )}
        </Typography>
      </Typography>

      <Popover
        id="pop-over"
        open={anchorEl ? true : false}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Typography className={styles.popover_container} component={"div"}>
          <>
            <Typography onClick={() =>{onNavigation("/profile")}} className={styles.popover_item} component={"div"}>
              {getCurrentUser()?.picture ? (
                <img
                  className={styles.popover_item_img}
                  src={getCurrentUser()?.picture}
                  alt="profile"
                />
              ) : (
                <img
                  className={styles.popover_item_img}
                  src="/assets/profile.png"
                  alt="profile"
                />
              )}{" "}
              <Typography style={{ fontSize: "16px" }} component={"div"}>
                {getCurrentUser() ? getCurrentUser()?.name : "Profile"}
              </Typography>
            </Typography>
          </>
          {getCurrentUser()?.isAdmin && (
            <>
              <Typography onClick={() =>{onNavigation("/admin")}} className={styles.popover_item} component={"div"}>
                <img
                  alt="logout"
                  className={styles.popover_item_img}
                  src="/assets/settings.png"
                />
                <Typography style={{ fontSize: "16px" }} component={"div"}>
                  Manage Puzzles
                </Typography>
              </Typography>
            </>
          )}
          <>
            <Typography onClick={onHistory} className={styles.popover_item} component={"div"}>
              <img
                alt="history"
                className={styles.popover_item_img}
                src="/assets/history.png"
              />
              <Typography style={{ fontSize: "16px" }} component={"div"}>
                History
              </Typography>
            </Typography>
          </>
          <>
            <Typography onClick={onLogout} className={styles.popover_item} component={"div"}>
              <img
                alt="logout"
                className={styles.popover_item_img}
                src="/assets/logout.png"
              />
              <Typography style={{ fontSize: "16px" }} component={"div"}>
                Logout
              </Typography>
            </Typography>
          </>
        </Typography>
      </Popover>
    </>
  );
};
