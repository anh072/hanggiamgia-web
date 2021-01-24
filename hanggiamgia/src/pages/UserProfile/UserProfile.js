import React from "react";

import { useAuth0 } from "@auth0/auth0-react";

function UserProfile() {
  const { user } = useAuth0();
  console.log(user);

  return (
    <div>
      <div className="row align-items-center profile-header">
        <div className="col-md-2 mb-3">
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </div>
        <div className="col-md text-center text-md-left">
          <h2>{user.name}</h2>
          <p className="lead text-muted">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;