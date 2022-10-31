import React, { useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import UserList from "../components/UserList";
import axios from "axios";

const Users = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [users, setUsers] = useState();

  useEffect(() => {
    getAllUser();
  }, []);

  const getAllUser = async () => {
    setIsLoading(true);
    try {
      const usersData = await axios.get("http://localhost:5000/api/users");
      setUsers(usersData.data);
    } catch (error) {
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
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && users && <UserList items={users} />}
    </React.Fragment>
  );
};

export default Users;
