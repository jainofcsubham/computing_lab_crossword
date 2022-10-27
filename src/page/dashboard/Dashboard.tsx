import React from "react";
import { ValidateLogin } from "../../component/validate-login/ValidateLogin";

export const Dashboard: React.FC = () => {
  return (
    <>
    <ValidateLogin>
      <div>Dashboard</div>
    </ValidateLogin>
    </>
  );
};
