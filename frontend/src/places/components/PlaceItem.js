import axios from "axios";
import React, { useContext, useState } from "react";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Map from "../../shared/components/UIElements/Maps";
import Modal from "../../shared/components/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";

import "./PlaceItem.css";

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);

  const [showMap, setShowMap] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const openmapHandler = () => setShowMap(true);
  const closemapHandler = () => setShowMap(false);

  const openDeleteHandler = () => setShowDelete(true);
  const closeDeleteHandler = () => setShowDelete(false);

  const confirmDelete = async () => {
    setShowDelete(false);
    try {
      setIsLoading(true);
      await axios.delete(`http://localhost:5000/api/places/${props.id}`, { headers: { Authorization: "Bearer " + auth.token } });
      props.onDelete(props.id);
    } catch (error) {
      console.log(error);
      setError(error.response.data.msg);
    }
    setIsLoading(false);
  };

  const errorHandler = (e) => {
    e.preventDefault();
    setError(null);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      <Modal show={showMap} onCancel={closemapHandler} header={props.address} contentClass="place-item__modal-content" footerClass="place-item__modal-action" footer={<Button onClick={closemapHandler}>Close</Button>}>
        <div className="map-container">
          <Map center={props.coordinates} zoom={16}></Map>
        </div>
      </Modal>

      <Modal
        show={showDelete}
        onCancel={closeDeleteHandler}
        header="are you sure ?"
        footerClass="place-item__modal-action"
        footer={
          <React.Fragment>
            <Button onClick={closeDeleteHandler}>Close</Button>
            <Button danger onClick={confirmDelete}>
              Delete
            </Button>
          </React.Fragment>
        }
      >
        <p>Do you want delete this place? </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img src={`http://localhost:5000/${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openmapHandler}>
              View On Map
            </Button>
            {auth.userId === props.creatorId && <Button to={`/places/${props.id}`}>Edit</Button>}
            {auth.userId === props.creatorId && (
              <Button danger onClick={openDeleteHandler}>
                Delete
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
