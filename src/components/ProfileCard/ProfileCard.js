import React from "react";
import { useDispatch } from "react-redux";
import { logoutAndClearUser } from "../../state/auth/authSlice";
import EmployerProfileCard from "./EmployerProfileCard";
import JobseekerProfileCard from "./JobseekerProfileCard";
import RecruiterPofileCard from "./RecruiterPofileCard";

const ProfileCard = ({ location, user }) => {
  const dispatch = useDispatch();

  const handleLinkClick = () => {
    dispatch(logoutAndClearUser());
  };


  let detailsArray = [];

  switch (user.user.userType) {
    case "recruiter":
      detailsArray = <RecruiterPofileCard handleLinkClick={handleLinkClick} location={location} user={user} />;
      break;
    case "jobseeker":
      detailsArray = <JobseekerProfileCard handleLinkClick={handleLinkClick} location={location} user={user} />;
      break;

    case "employer":
      detailsArray = <EmployerProfileCard handleLinkClick={handleLinkClick} location={location} user={user} />
      break;
  }

  return (<> {detailsArray}</>);
};

export default ProfileCard;
