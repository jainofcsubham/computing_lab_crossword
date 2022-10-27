import React from 'react'
import { ValidateLogin } from '../../component/validate-login/ValidateLogin'
import { useDatabaseContext } from '../../context/data.service'
import styles from "./Profile.module.css"

export const Profile: React.FC = () => {

  const {updateProfilePicture,getCurrentUser} = useDatabaseContext()

  const onChange = (e:any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const email = getCurrentUser()?.email;
      if(email){
        updateProfilePicture(email,reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
    <ValidateLogin>
        <div>
          <div>
            {
              getCurrentUser()?.picture ? <><img src={getCurrentUser()?.picture} alt="big_profile" /></> : <><img src="/assets/profile.jpg" alt="big_profile" /></>
            }
            
            <label htmlFor="profile_input">Upload</label>
            <input onChange={onChange} className={styles.profile_input} id="profile_input"  type="file" accept="image/*"/>
          </div>
          <div></div>
        </div>
    </ValidateLogin>
    </>
  )
}

