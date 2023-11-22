import React, { useState } from "react";

import ProfileCard from "../ProfileCard/ProfileCard";
import {
  Navigate,
  useLocation,
  useParams,
  useNavigate,
} from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import { Alert, Container } from "react-bootstrap";
import EmptyCard from "../EmptyCard/EmptyCard";
import { Row, Col } from "react-bootstrap";
import Loading from "../Loading/Loading";
import RecruiterViewJobs from "../RecruiterViewJobs/RecruiterViewJobs";
import RecruiterViewJobDetails from "../RecruiterViewJobs/RecruiterViewJobDetails";
import ViewReferredJob from "../RecruiterViewJobs/ViewReferredJob";
import ViewMarkedJob from "../RecruiterViewJobs/ViewMarkedJob";
import RecruiterClosedJob from "../RecruiterViewJobs/ViewClosedJob";

const RecruiterJobs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const status = searchParams.get("status");
  const page = searchParams.get("page");
  const search = searchParams.get("search");
  const city = searchParams.get("city");
  const sort = searchParams.get("sort");
  const state = useSelector((state) => state);
  const { id } = useParams();
  const { loading, error, userToken } = useSelector((state) => state.auth);
  const { user, profileLoading, profileError } = useSelector(
    (state) => state.user
  );
  const [data, setData] = useState();
  const dispatch = useDispatch();

  var renderedComponent = null
  if (loading || profileLoading) {
    return <Loading />;
  }
  if (!user) {
    return <Navigate to="/register" />;
  }
  if (user.user.userType !== 'recruiter') {
    navigate('/dashboard')
    return;
  }
  if (!id) {
    if (location.pathname === "/dashboard/jobs/marked") {
      renderedComponent = (
        <ViewMarkedJob
          dispatch={dispatch}
          data={data}
          setData={setData}
          state={state}
          status={status}
          user={user}
          page={page}
          userToken={userToken}
        />
      );
    } else if (location.pathname === "/dashboard/jobs/referred") {
      renderedComponent = (
        <ViewReferredJob
          dispatch={dispatch}
          data={data}
          setData={setData}
          state={state}
          status={status}
          user={user}
          page={page}
          userToken={userToken}
        />
      );
    } else if (location.pathname === "/dashboard/jobs/closed") {
      renderedComponent = (
        <RecruiterClosedJob
          dispatch={dispatch}
          data={data}
          setData={setData}
          state={state}
          status={status}
          user={user}
          page={page}
          userToken={userToken}
        />
      );
    } else if (location.pathname === "/dashboard/jobs") {
      renderedComponent = (
        <RecruiterViewJobs
          sort={sort}
          page={page}
          search={search}
          city={city}
          user={user}
          dispatch={dispatch}
          data={data}
          setData={setData}
          state={state}
          userToken={userToken}
        />
      );
    }
  } else if (id) {
    renderedComponent = (
      <RecruiterViewJobDetails
        dispatch={dispatch}
        data={data}
        setData={setData}
        state={state}
        id={id}
        user={user}
        userToken={userToken}
      />
    );
  }



  return (
    <>
      <Container>
        {(error, profileError) && (
          <Alert variant="danger">Error occurred while loading data.</Alert>
        )}
        {!error && user?.user ? (
          <Row>
            <Col xs={4} md={3}>
              <ProfileCard user={user} location={location} />
            </Col>
            <Col xs={12} md={6}>
              {renderedComponent}
            </Col>
            <Col xs={4} md={3}>
              <EmptyCard />
            </Col>
          </Row>
        ) : null}
      </Container>
    </>
  );
};

export default RecruiterJobs;
