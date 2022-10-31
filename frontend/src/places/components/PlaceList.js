import React from "react";
import PlaceItem from "./PlaceItem";

import "./PlaceList.css";

const PlaceList = (props) => {
  return (
    <ul className="place-list">
      {props.items.map((place) => {
        return <PlaceItem key={place.id} id={place.id} image={place.image} title={place.title} description={place.description} address={place.address} creatorId={place.creator} coordinates={place.location} onDelete={props.onDeletPlace} />;
      })}
    </ul>
  );
};

export default PlaceList;
