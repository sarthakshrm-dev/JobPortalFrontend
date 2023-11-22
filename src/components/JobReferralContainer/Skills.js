import React, { useState } from "react";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import css from "./JobReferralContainer.module.css";
import { AiFillCloseCircle } from "react-icons/ai";
import moment from "moment";

export default function Skills({
  formData,
  dispatch,
  setFormData,
  handleFormChange,
  jobData,
  errorMessages,
  setJobData,
  userState,
  recruiterJobReferralState,
  recruiterJobsState,
  showErrorAlert,
  loading,
  onVerifyEmail,
  applicantData,
  onFillFromUser,
}) {
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
  console.log({ applicantData });

  const [formValues, setFormValues] = useState({});
  const [experienced, setexperienced] = useState(true);

  const [validationErrors, setValidationErrors] = useState({});

  const [showValidation, setShowValidation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedErrors = { ...validationErrors };

    switch (name) {
      case "yearOfPassing":
        const currentYear = moment().year();
        const yearValue = moment(value, "YYYY");
        const year = parseInt(value, 10);

        if (!yearValue.isValid() || year < 1980 || year > currentYear) {
          updatedErrors[name] =
            "Invalid year format or year out of range (1980 - current year).";
        } else {
          delete updatedErrors.yearOfPassing;
        }
        break;
      case "degree":
        if (!value) {
          updatedErrors[name] = "Please provide a valid degree name.";
        } else {
          updatedErrors = validationErrors;
          delete updatedErrors.degree;
        }
        break;
      case "institute":
        if (!value) {
          updatedErrors[name] = "Please provide a valid college/university.";
        } else {
          updatedErrors = validationErrors;
          delete updatedErrors.institute;
        }
        break;
      default:
        break;
    }

    setValidationErrors(updatedErrors);
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <Form style={{ padding: "1rem 2.5rem 0", backgroundColor: "white" }}>
      <Col sm={{ span: 10, offset: 0 }}>
        <Row className={`mb-1 mt-1`}>
          <h2 className={css.title}>Skills</h2>
        </Row>
        <Col>
          <Form.Group className="mb-3" controlId="degree">
            <Form.Label className={css.labelChange}>Degree Name :</Form.Label>
            <Form.Control
              type="text"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              isInvalid={showErrorAlert && !formData.degree}
              style={{ borderRadius: "2px" }}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid degree name.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="yearOfPassing">
            <Form.Label className={css.labelChange}>
              Year of Passing :
            </Form.Label>
            <Form.Control
              type="text"
              name="yearOfPassing"
              value={formData.yearOfPassing}
              onChange={handleChange}
              placeholder="yyyy"
              isInvalid={
                showErrorAlert &&
                (!formData.yearOfPassing ||
                  formData.yearOfPassing < 1980 ||
                  formData.yearOfPassing > new Date().getFullYear())
              }
              style={{ borderRadius: "2px" }}
            />
            {validationErrors.yearOfPassing && (
              <Form.Text className="text-danger">
                {validationErrors.yearOfPassing}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="institute">
            <Form.Label className={css.labelChange}>
              College/University :
            </Form.Label>
            <Form.Control
              type="text"
              name="institute"
              value={formData.institute}
              onChange={handleChange}
              isInvalid={showErrorAlert && !formData.institute}
              style={{ borderRadius: "2px" }}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid degree name.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Col>
    </Form>
  );
}
