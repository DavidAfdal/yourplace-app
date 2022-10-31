import React, { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validator";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import axios from "axios";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import "./FormPlaces.css";

const UpdatePlaces = () => {
  const placeId = useParams().placeId;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [place, setPlace] = useState();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [formState, InputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const getPlaceById = useCallback(async () => {
    setIsLoading(true);
    try {
      const responseData = await axios.get(`http://localhost:5000/api/places/${placeId}`);
      setPlace(responseData.data.place);
      setFormData(
        {
          title: {
            value: responseData.data.place.title,
            isValid: true,
          },
          description: {
            value: responseData.data.place.description,
            isValid: true,
          },
        },
        true
      );
    } catch (error) {
      setError(error.response.data.msg);
    }
    setIsLoading(false);
  }, [placeId, setFormData]);

  useEffect(() => {
    getPlaceById();
  }, [getPlaceById]);

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!place && !error) {
    return (
      <div className="center">
        <h2>Could not find place</h2>
      </div>
    );
  }

  const updateHandler = async (e) => {
    const data = {
      title: formState.inputs.title.value,
      description: formState.inputs.description.value,
    };
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios.patch(`http://localhost:5000/api/places/${placeId}`, data, { headers: { Authorization: "Bearer " + auth.token } });
      setIsLoading(false);
      navigate("/" + auth.userId + "/places");
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
      {!isLoading && place && (
        <form className="place-form" onSubmit={updateHandler}>
          <Input id="title" element="input" type="text" label="Title" errorText="Please Enter a Valid Title" validator={[VALIDATOR_REQUIRE()]} initialValue={place.title} initialValid={true} onInput={InputHandler} />
          <Input id="description" label="Description" errorText="Please Enter a Valid Description (at least 5 characters)" validator={[VALIDATOR_MINLENGTH(5)]} initialValue={place.description} initialValid={true} onInput={InputHandler} />
          <Button type="submit" disabled={!formState.isValid}>
            Update Place
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlaces;
