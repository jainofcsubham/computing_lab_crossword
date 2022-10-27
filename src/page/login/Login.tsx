import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../../utils/constant";
import { LoginForm } from "../../utils/interface";
import { useDatabaseContext } from "../../context/data.service";

export const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({});
  
  const {loginUser,getCurrentUser} = useDatabaseContext()
  const navigate = useNavigate();
  const [error,setError] = useState<string>('');

  useEffect(() => {
    const user = getCurrentUser()
    if(user){
        navigate('/dashboard');
    }
  },[])

  const onSubmit: SubmitHandler<LoginForm> = (data): number => {
    const response = loginUser(data);
    if(response.status === -1){
      setError(response.message);
      return 0;
    }
    localStorage.setItem("crossword_logged_in","true");
    navigate("/dashboard");
    return 0;
  };

  return (
    <>
      <div>
        <div>Login</div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <input
                placeholder="Email"
                {...register("email", { required: true, pattern: EMAIL_REGEX })}
              />
              {errors.email && (
                <>
                {errors.email?.type === "required" && (
                  <div className="error">Email is required.</div>
                )}
                {errors.email?.type === "pattern" && (
                  <div className="error">Invalid Email.</div>
                )}
              </>
              )}
            </div>
            <div>
              <input
                placeholder="Password"
                {...register("password", {
                  required: true,
                  pattern: PASSWORD_REGEX,
                })}
              />
              {errors.password && (
                <>
                  {errors.password?.type === "required" && (
                    <div className="error">Password is required.</div>
                  )}
                  {errors.password?.type === "pattern" && (
                    <div className="error">Password should be alphanumeric with at least 8 characters having at least one special character.</div>
                  )}
                </>
              )}
            </div>
            <div>
              <button type="submit">Submit</button>
            </div>
          </form>
          {
            error && (<div>{error}</div>)
          }
        </div>
      </div>
    </>
  );
};
