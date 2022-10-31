import axios from "axios";
import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Card from "../../shared/components/UIElements/Card";

import { AuthContext } from "../../shared/context/auth-context";

import "./otp.css";

const Otp = () => {
  const auth = useContext(AuthContext);
  const [data, setData] = useState();
  const [err, setErr] = useState(false);
  const userId = useParams().id;
  const submitHandler = async (e) => {
    e.preventDefault();
    const dataOtp = {
      otp: data,
    };
    console.log(data);
    try {
      const responseData = await axios.post(`http://localhost:5000/api/users/login/otp/${userId}`, dataOtp);
      setErr(false);
      console.log(responseData);
      auth.login(responseData.data.data._id, responseData.data.token);
    } catch (error) {
      console.log(error);
      setErr(true);
    }
  };
  return (
    <Card className="otp">
      <div>
        <h1>Masukan Otp Anda</h1>
        <form onSubmit={submitHandler} className="otp_input">
          <input type="String" value={data} placeholder="masukan otp anda" onChange={(e) => setData(e.target.value)} />
          {err && <p>Your otp is wrong, please check again</p>}
          <button type="submit">submit</button>
        </form>
      </div>
    </Card>
  );
};

export default Otp;
