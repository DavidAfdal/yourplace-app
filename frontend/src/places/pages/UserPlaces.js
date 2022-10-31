import React, { useCallback, useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import PlaceList from "../components/PlaceList";
import axios from "axios";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UserPlaces = () => {
  const userId = useParams().userId;
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [places, setPlaces] = useState([]);

  const getPlaceByUserId = useCallback(async () => {
    setIsLoading(true);
    try {
      const placesData = await axios.get(`http://localhost:5000/api/places/user/${userId}`);
      setPlaces(placesData.data.places);
    } catch (error) {
      setError(error.response.data.msg);
    }
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    getPlaceByUserId();
  }, [getPlaceByUserId]);

  const errorHandler = (e) => {
    e.preventDefault();
    setError(null);
  };

  const placeDeleteHandler = (deletPlaceId) => {
    setPlaces((prevPlaces) => {
      prevPlaces.filter((place) => place.id !== deletPlaceId);
    });
    console.log(places.length);
  };

  return (
    <React.Fragment>
      {auth.isLoggedIn && <ErrorModal error={error} onClear={errorHandler} />}
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && places && <PlaceList items={places} onDeletPlace={placeDeleteHandler} />}
      {!isLoading && places.length < 1 && (
        <div className="place-list center">
          <Card>
            {auth.userId !== userId && <h2>No places found</h2>}
            {auth.userId === userId && <h2>No places found. maybe create one?</h2>}
            {auth.userId === userId && <Button to={"/places/new"}>Share Place</Button>}
          </Card>
        </div>
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
