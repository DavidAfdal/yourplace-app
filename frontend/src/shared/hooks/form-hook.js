import { useReducer, useCallback } from "react";

const formReducer = (state, action) => {
  const { type, inputId, value, isValid, inputs } = action;
  switch (type) {
    case "INPUT_CHANGE":
      let formIsValid = true;
      for (const currentId in state.inputs) {
        if (!state.inputs[currentId]) {
          continue;
        }
        if (currentId === inputId) {
          formIsValid = formIsValid && isValid;
        } else {
          formIsValid = formIsValid && state.inputs[currentId].isValid;
        }
      }
      return {
        inputs: {
          ...state.inputs,
          [inputId]: { value, isValid },
        },
        isValid: formIsValid,
      };
    case "SET_DATA":
      return {
        inputs,
        isValid,
      };
    default:
      return state;
  }
};
export const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity,
  });

  const InputHandler = useCallback((inputId, value, isValid) => {
    dispatch({ type: "INPUT_CHANGE", inputId, value, isValid });
  }, []);

  const setFormData = useCallback((inputs, isValid) => {
    dispatch({ type: "SET_DATA", inputs, isValid });
  }, []);
  return [formState, InputHandler, setFormData];
};
