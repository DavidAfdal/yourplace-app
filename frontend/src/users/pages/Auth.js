import React, { useState } from "react";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validator";
import { useForm } from "../../shared/hooks/form-hook";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import axios from "axios";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import "./Auth.css";
import { Navigate } from "react-router-dom";

const Auth = () => {
  // const auth = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isVerify, setIsVerify] = useState(false);
  const [id, setId] = useState("");
  const [formState, InputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const switchModeHandler = () => {
    if (!isLogin) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLogin((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const data = {
        email: formState.inputs.email.value,
        password: formState.inputs.password.value,
      };
      try {
        setIsLoading(true);
        const responseData = await axios.post(`http://localhost:5000/api/users/login`, data);
        setIsLoading(false);
        setIsVerify(responseData.data.msg);
        setId(responseData.data.user._id);
      } catch (error) {
        console.log(error);
        setError(error.response.data.msg || "Something wrong i can feel it");
        setIsLoading(false);
      }
    } else {
      const formData = new FormData();
      formData.append("name", formState.inputs.name.value);
      formData.append("email", formState.inputs.email.value);
      formData.append("password", formState.inputs.password.value);
      formData.append("image", formState.inputs.image.value);
      try {
        setIsLoading(true);
        await axios.post("http://localhost:5000/api/users/signup", formData);
        setIsLoading(false);
        setIsLogin(true);
      } catch (error) {
        setError(error.response.data.msg || "Something wrong i can feel it");
        setIsLoading(false);
      }
    }
  };

  const errorHandler = (e) => {
    e.preventDefault();
    setError(null);
  };

  const verifyhandler = (e) => {
    e.preventDefault();
    setIsVerify(null);
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      <ErrorModal error={isVerify} onClear={verifyhandler} />
      {isVerify === "succes" && <Navigate to={`/otp/${id}`} />}
      <Card className="authentication ">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLogin && <Input id="name" element="input" type="text" label="Name" errorText="Please Enter a Valid Name" validator={[VALIDATOR_REQUIRE()]} onInput={InputHandler} />}
          {!isLogin && <ImageUpload id="image" center onInput={InputHandler} />}
          <Input id="email" element="input" type="email" label="Email" errorText="Please Enter a Valid Email" validator={[VALIDATOR_EMAIL()]} onInput={InputHandler} />
          <Input id="password" element="input" type="password" label="Password" errorText="Please Enter a password, at least 6 chracter" validator={[VALIDATOR_MINLENGTH(6)]} onInput={InputHandler} />
          <Button type="submit" disabled={!formState.isValid}>
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          Switch to {isLogin ? "Signup" : "Login"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
