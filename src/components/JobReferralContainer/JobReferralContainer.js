import React, { useEffect, useState } from "react";
import css from "./JobReferralContainer.module.css";
import { useDispatch } from "react-redux";
import {
  setViewJobError,
  setViewJobLoading,
  setViewJobSuccess,
} from "../../state/recruiterJob/recruiterJobSlice";
import axios from "axios";
import Loading from "../Loading/Loading";
import { Navigate } from "react-router-dom";
import { Button, Col, Row } from "react-bootstrap";
import { BiArrowBack } from "react-icons/bi";
import BasicDetails from "./BasicDetails";
import EduAndExpDetails from "./EduAndExpDetails";
import Skills from "./Skills";
import ScreeningQuestions from "./ScreeningQuestions";

import {
  isLoading,
  setVerifyEmailError,
  setVerifyEmailLoading,
  setVerifyEmailSuccess,
} from "../../state/recruiterJobReferral/recruiterJobReferralSlice";
export default function JobReferralContainer({
  authState,
  userState,
  recruiterJobReferralState,
  recruiterJobsState,
  navigate,
  state,
  jobId,
}) {
  const dispatch = useDispatch();
  const { userToken } = authState;
  const { viewJobLoading, viewJobSuccess, viewJobError } = recruiterJobsState;
  const {
    createReferralLoading,
    createReferralSuccess,
    createReferralError,
    verifyEmailLoading,
    verifyEmailSuccess,
    verifyEmailError,
    resumeUploadLoading,
    resumeUploadSuccess,
    resumeUploadError,
    coverLetterUploadLoading,
    coverLetterUploadSuccess,
    coverLetterUploadError,
  } = recruiterJobReferralState;
  const [jobData, setJobData] = useState(null);
  const [formData, setFormData] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const [applicantData, setApplicantData] = useState(null);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const validateFormData = (formData) => {
    setShowErrorAlert(true);
    const errors = {};
    const { name, email, contact, fromDB } = formData;
    setShowErrorAlert(false);
    if (!name) {
      errors.name = "Name is required";
    }
    if (!email) {
      errors.email = "Email is required";
    }
    if (!contact) {
      errors.contact = "Contact is required";
    }
    setErrorMessages((prevState) => ({
      ...prevState,
      ...errors,
    }));
  };
  useEffect(() => {
    validateFormData(formData);
    console.log({ formData });
  }, [formData]);
  console.log({ jobData });
  useEffect(() => {
    dispatch(setViewJobLoading());
    axios
      .get(`/api/recruiter/job/fetch/${jobId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setJobData(res.data.job);
        dispatch(setViewJobSuccess());
      })
      .catch((err) => {
        console.log(err);
        dispatch(setViewJobError(err));
      });
  }, []);
  if (viewJobLoading) {
    return <Loading />;
  }
  if (viewJobError) {
    return (
      <div>
        <p className={css.error}>Failed to fetch the Job</p>
      </div>
    );
  }

  const onVerifyEmail = () => {
    dispatch(setVerifyEmailLoading());
    setApplicantData(null);
    axios
      .get(
        `/api/recruiter/application/get-applicant-by-email/${formData.email}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        const status = res.status;
        const code = res.data.code;
        if (status === 200) {
          if (code === 100) {
            dispatch(
              setVerifyEmailSuccess("User of the email address does not exist")
            );
            setFormData((pValue) => {
              return {
                ...pValue,
                emailValid: "User of the email address does not exist",
                validatedEmail: formData.email,
              };
            });
            return;
          }
          if (code === 101 && res.data.applicant) {
            dispatch(
              setVerifyEmailSuccess(
                "Jobseeker with given email id and referred by you exists"
              )
            );
            setFormData((pValue) => {
              return {
                ...pValue,
                emailValid:
                  "Jobseeker with given email id and referred by you exists",
                validatedEmail: formData.email,
              };
            });
            setApplicantData(res.data.applicant);
            return;
          }
        }
        throw "";
      })
      .catch((err) => {
        const status = err.response.status;
        const code = err.response.data.code;
        console.log({ code, status, err });

        if (status === 403 || status === 500) {
          dispatch(setVerifyEmailError("Something went wrong"));
          return;
        }
        if (status === 400) {
          if (code === 200) {
            dispatch(
              setVerifyEmailError(
                "Email already exists for user other than a jobseeker"
              )
            );
            setErrorMessages((prevState) => ({
              ...prevState,
              emailValid:
                "Email already exists for user other than a jobseeker",
              validatedEmail: formData.email,
            }));
            return;
          }
          if (code === 201) {
            dispatch(
              setVerifyEmailError(
                "Jobseeker of email with different referral ID that yours is already present"
              )
            );
            setErrorMessages((prevState) => ({
              ...prevState,
              validatedEmail: formData.email,
              emailValid:
                "Jobseeker of email with different referral ID that yours is already present",
            }));
            return;
          }
        }

        console.log(err);
        dispatch(setVerifyEmailError("Something went wrong"));
        setErrorMessages((prevState) => ({
          ...prevState,
          emailValid: "Something went wrong",
        }));
      });
  };
  const onFillFromUser = () => {};
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setErrorMessages((prevState) => ({
        ...prevState,
        emailValid: "",
      }));
      setFormData((pValue) => {
        return {
          ...pValue,
          emailValid: "",
        };
      });
    }
    setFormData((pValue) => {
      return {
        ...pValue,
        [name]: value,
      };
    });
  };
  return (
    <div>
      {viewJobSuccess && (
        <div>
          <Col className={css.mainContainer}>
            <Row
              className={`mb-2 mt-5 flex justify-content-start ${css.container}`}
            >
              <BiArrowBack
                className={css.backButton}
                onClick={() => navigate(`/dashboard/jobs`)}
              />
              <h2 className={css.title}>Refer Candidate</h2>
            </Row>
            <BasicDetails
              dispatch={dispatch}
              jobData={jobData}
              setJobData={setJobData}
              userState={userState}
              recruiterJobReferralState={recruiterJobReferralState}
              recruiterJobsState={recruiterJobsState}
              formData={formData}
              setFormData={setFormData}
              handleFormChange={handleFormChange}
              errorMessages={errorMessages}
              loading={isLoading(state)}
              showErrorAlert={showErrorAlert}
              onVerifyEmail={onVerifyEmail}
              onFillFromUser={onFillFromUser}
              applicantData={applicantData}
            />
            <EduAndExpDetails
              dispatch={dispatch}
              jobData={jobData}
              setJobData={setJobData}
              userState={userState}
              recruiterJobReferralState={recruiterJobReferralState}
              recruiterJobsState={recruiterJobsState}
              formData={formData}
              setFormData={setFormData}
              handleFormChange={handleFormChange}
              errorMessages={errorMessages}
              loading={isLoading(state)}
              showErrorAlert={showErrorAlert}
              onVerifyEmail={onVerifyEmail}
              onFillFromUser={onFillFromUser}
              applicantData={applicantData}
            />
            <Skills
              dispatch={dispatch}
              jobData={jobData}
              setJobData={setJobData}
              userState={userState}
              recruiterJobReferralState={recruiterJobReferralState}
              recruiterJobsState={recruiterJobsState}
              formData={formData}
              setFormData={setFormData}
              handleFormChange={handleFormChange}
              errorMessages={errorMessages}
              loading={isLoading(state)}
              showErrorAlert={showErrorAlert}
              onVerifyEmail={onVerifyEmail}
              onFillFromUser={onFillFromUser}
              applicantData={applicantData}
            />
            <ScreeningQuestions
              dispatch={dispatch}
              jobData={jobData}
              setJobData={setJobData}
              userState={userState}
              recruiterJobReferralState={recruiterJobReferralState}
              recruiterJobsState={recruiterJobsState}
              formData={formData}
              setFormData={setFormData}
              handleFormChange={handleFormChange}
              errorMessages={errorMessages}
              loading={isLoading(state)}
              showErrorAlert={showErrorAlert}
              onVerifyEmail={onVerifyEmail}
              onFillFromUser={onFillFromUser}
              applicantData={applicantData}
            />
          </Col>
        </div>
      )}
    </div>
  );
}
