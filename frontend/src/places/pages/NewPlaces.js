import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validator";
import { useForm } from "../../shared/hooks/form-hook";
import axios from "axios";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import "./FormPlaces.css";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const NewPlaces = () => {
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [formState, InputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
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

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", formState.inputs.title.value);
    formData.append("description", formState.inputs.description.value);
    formData.append("address", formState.inputs.address.value);
    formData.append("image", formState.inputs.image.value);
    formData.append("creator", auth.userId);
    try {
      setIsLoading(true);
      await axios.post(`http://localhost:5000/api/places`, formData, {
        headers: { Authorization: "Bearer " + auth.token },
      });
      setIsLoading(false);
      navigate(`/${auth.userId}/places`);
    } catch (error) {
      setError(error.response.data.msg || "Something wrong i can feel it");
      setIsLoading(false);
    }
  };

  const errorHandler = (e) => {
    e.preventDefault();
    setError(null);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      <form className="place-form" onSubmit={handleSubmit}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input id="title" element="input" type="text" label="Title" errorText="Please Enter a Valid Title" validator={[VALIDATOR_REQUIRE()]} onInput={InputHandler} />

        <Input id="address" element="input" label="Address" errorText="Please Enter a Valid Addres (at least 5 characters)" validator={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]} onInput={InputHandler} />

        <Input id="description" label="Description" errorText="Please Enter a Valid Description (at least 5 characters)" validator={[VALIDATOR_MINLENGTH(5)]} onInput={InputHandler} />
        <ImageUpload id="image" onInput={InputHandler} errorText="please provide an image" />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACES
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlaces;
