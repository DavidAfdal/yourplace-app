import React, { useReducer, useEffect } from "react";

import { validate } from "../../util//validator";

import "./Input.css";

const inputReducer = (state, action) => {
  const { type, val, validators } = action;
  switch (type) {
    case "CHANGE":
      return {
        ...state,
        value: val,
        isValid: validate(val, validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};
const Input = (props) => {
  const [inputState, dispacth] = useReducer(inputReducer, { value: props.initialValue || "", isValid: props.initialValid || false, isTouched: false });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    dispacth({ type: "CHANGE", val: event.target.value, validators: props.validator });
  };
  const touchHandler = () => {
    dispacth({ type: "TOUCH" });
  };

  const element =
    props.element === "input" ? (
      <input id={props.id} type={props.type} placeholder={props.placeholder} onChange={changeHandler} value={inputState.value} onBlur={touchHandler} />
    ) : (
      <textarea id={props.id} rows={props.rows || 3} onChange={changeHandler} value={inputState.value} onBlur={touchHandler} />
    );

  return (
    <div className={`form-control ${!inputState.isValid && inputState.isTouched && "form-control--invalid"}`}>
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
