import React, { useEffect, useState } from "react";

import ProfileCard from "../../components/ProfileCard/ProfileCard";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Alert, Tab, Tabs, Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Loading from "../../components/Loading/Loading";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import EmployerCompanyAbout from "../../components/EmployerCompanyAbout/EmployerCompanyAbout";
import EmployerCompanyContact from "../../components/EmployerCompanyContact/EmployerCompanyContact";
import EmployerCompanyLegalInfo from "../../components/EmployerCompanyLegalInfo/EmployerCompanyLegalInfo";
import EmployerCompanyOffices from "../../components/EmployerCompanyOffices/EmployerCompanyOffices";
import { clearForm } from "../../state/employerCompany/employerCompanySlice";
import {
  employerCompanyFetch,
  employerCompanyCreate,
  employerCompanyUpdate,
} from "../../state/employerCompany/employerCompanyActions";
import css from "./EditCompanyScreen.module.css";

const EditCompanyScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tab } = useParams();
  const { loading, error } = useSelector((state) => state.auth);
  const { user, userLoading } = useSelector((state) => state.user);

  const employerCompanyState = useSelector((state) => state.employerCompany);
  const tabsArray = ["about", "contact-details", "legal-info", "offices"];
  const dispatch = useDispatch();
  const [key, setKey] = useState("");

  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 800);
  const [removeEmpty, setRemoveEmpty] = React.useState(window.innerWidth <= 1200);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      setRemoveEmpty(window.innerWidth <= 1200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  React.useEffect(() => {
    if (!tabsArray.includes(tab)) {
      return navigate("/dashboard/company/about");
    }
    dispatch(clearForm());
    setKey(tab);
  }, [tab]);
  React.useEffect(() => {
    dispatch(employerCompanyFetch());
  }, [dispatch]);
  const nextTab = () => {
    const idx = tabsArray.indexOf(key);
    if (idx > -1) {
      const nextTabVal = tabsArray[idx + 1];
      if (nextTabVal && !isMobile) {
        navigate(`/dashboard/company/${nextTabVal}`);
      }
    }
  };
  if (
    location.pathname === "/dashboard/company" ||
    location.pathname === "/dashboard/company/"
  ) {
    return <Navigate to="/dashboard/company/about" />;
  }
  if (loading || userLoading) {
    return <Loading />;
  }
  if (!user.user) {
    return <Navigate to="/register" />;
  }
  console.log({ user });
  if (user.user.userType !== "employer") {
    return <Navigate to="/dashboard" />;
  }

  const showLoading =
    employerCompanyState.companyFetchLoading ||
    employerCompanyState.companySaveLoading ||
    employerCompanyState.companyUpdateLoading;
  const companyData = employerCompanyState?.data?.company;

  const createEmployerCompany = async (data) => {
    await dispatch(employerCompanyCreate(data));
  };
  const updateEmployerCompany = async (data) => {
    await dispatch(employerCompanyUpdate(data));
  };
  return (
    <>
      <style>
        {`
       @media (max-width: 800px) {
            .tabs-container .nav-tabs {
              display: none; /* Hide the tab headers */
            }
            
            .tabs-container .tab-content {
              margin-top: 0; /* Adjust the margin if needed */
            }
          }
      `}
      </style>
      <Container style={{ marginTop: '1rem' }}>
        {error && (
          <Alert variant="danger">Error occurred while loading data.</Alert>
        )}
        {!error && user?.user ? (
          <Row>
            {!isMobile &&
              <Col md={4} lg={3}>
                <ProfileCard user={user} location={location} />
              </Col>}
            <Col className="">
              {showLoading ? (
                <Loading />
              ) : employerCompanyState.companyFetchError ? (
                <Alert variant="danger">
                  Error occurred while fetching company data.
                </Alert>
              ) : (
                <div className="tabs-container">
                  <Tabs
                    id="controlled-tab"
                    activeKey={key}
                    onSelect={(k) => {
                      navigate(`/dashboard/company/${k}`);
                    }}
                    className="mb-3"
                  >
                    <Tab eventKey="about" className="mb-2 tab-content" title="About">
                      <div>
                        <EmployerCompanyAbout
                          dispatch={dispatch}
                          companyData={companyData}
                          createEmployerCompany={createEmployerCompany}
                          employerCompanyState={employerCompanyState}
                          updateEmployerCompany={updateEmployerCompany}
                          clearForm={clearForm}
                          nextTab={nextTab}
                          isMobile={isMobile}
                        />
                      </div>
                    </Tab>
                    <Tab
                      eventKey="contact-details"
                      className=" tab-content"
                      title="Contact Details"
                    >
                      <div>
                        <EmployerCompanyContact
                          dispatch={dispatch}
                          companyData={companyData}
                          employerCompanyState={employerCompanyState}
                          clearForm={clearForm}
                          createEmployerCompany={createEmployerCompany}
                          updateEmployerCompany={updateEmployerCompany}
                          nextTab={nextTab}
                        />
                      </div>
                    </Tab>
                    <Tab eventKey="legal-info" className="tab-content" title="Legal Information">
                      <div>
                        <EmployerCompanyLegalInfo
                          dispatch={dispatch}
                          companyData={companyData}
                          employerCompanyState={employerCompanyState}
                          clearForm={clearForm}
                          createEmployerCompany={createEmployerCompany}
                          updateEmployerCompany={updateEmployerCompany}
                          nextTab={nextTab}
                        />
                      </div>
                    </Tab>
                    <Tab eventKey="offices" className="tab-content" title="Offices">
                      <div>
                        <EmployerCompanyOffices
                          dispatch={dispatch}
                          companyData={companyData}
                          employerCompanyState={employerCompanyState}
                          clearForm={clearForm}
                          createEmployerCompany={createEmployerCompany}
                          updateEmployerCompany={updateEmployerCompany}
                          nextTab={nextTab}
                        />
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              )}
            </Col>
            {!removeEmpty && <Col lg={3} >
              <EmptyCard />
            </Col>}
          </Row>
        ) : null}
      </Container>
    </>
  );
};

export default EditCompanyScreen;
