import React from "react";
import { Button, TextField, Typography } from "@mui/material";
import { ValidateLogin } from "../../component/validate-login/ValidateLogin";
import { useDatabaseContext } from "../../context/data.service";
import styles from "./Profile.module.scss";

export const Profile: React.FC = () => {
  const { updateProfilePicture, getCurrentUser } = useDatabaseContext();

  const onChange = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const email = getCurrentUser()?.email;
      if (email) {
        updateProfilePicture(email, reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <ValidateLogin>
        <Typography className={styles.container} component={"div"}>
          <Typography className={styles.active_tab} component={"div"}>
            Profile Details
          </Typography>
          <Typography className={styles.section_container} component={"div"}>
            <Typography className={styles.left} component={"div"}>
              {getCurrentUser()?.picture ? (
                <>
                  <img
                    className={styles.big_profile}
                    src={getCurrentUser()?.picture}
                    alt="big_profile"
                  />
                </>
              ) : (
                <>
                  <img
                    className={styles.big_profile}
                    src="/assets/profile.png"
                    alt="big_profile"
                  />
                </>
              )}
              <Typography className={styles.input_container} component={"div"}>
                <label className={styles.input_label} htmlFor="profile_input">
                  <Button
                    disabled
                    className={styles.upload_btn}
                    variant="contained"
                  >
                    Upload
                  </Button>
                </label>
                <input
                  onChange={onChange}
                  className={styles.profile_input}
                  id="profile_input"
                  type="file"
                  accept="image/*"
                />
              </Typography>
            </Typography>
            <Typography className={styles.right} component={"div"}>
              <Typography className={styles.field_wrapper} component={'div'}>
                <TextField className={styles.field} label="Email" type={'text'} value={getCurrentUser()?.email}/>
              </Typography>
              <Typography  className={styles.field_wrapper} component={'div'}>
                <TextField  className={styles.field} label="Name" type={'text'} value={getCurrentUser()?.name}/>
              </Typography>
            </Typography>
          </Typography>
        </Typography>
      </ValidateLogin>
    </>
  );
};
