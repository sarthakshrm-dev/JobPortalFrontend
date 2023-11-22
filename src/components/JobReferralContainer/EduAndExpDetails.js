import React, { useState } from "react";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import css from "./JobReferralContainer.module.css";
import { AiFillCloseCircle } from "react-icons/ai";
import moment from "moment";

export default function EduAndExpDetails({
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

  const handleEduChange = (e) => {
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
  const handleEduAdd = () => {
    if (
      !formValues.degree ||
      !formValues.yearOfPassing ||
      !formValues.institute ||
      Object.keys(validationErrors).length > 0
    ) {
      setShowValidation(true);
      return;
    }

    const newDegreeData = {
      degree: formValues.degree,
      yearOfPassing: formValues.yearOfPassing,
      institute: formValues.institute,
    };
    const prevEdu =
      formData.education && formData.education.length > 0
        ? [...formData.education]
        : [];

    setFormData((pVal) => {
      return {
        ...pVal,
        education: [...prevEdu, newDegreeData],
      };
    });
    setFormValues({
      degree: "",
      yearOfPassing: "",
      institute: "",
    });
    setShowValidation(false);
  };

  const handleEduRemove = (index) => {
    const updatedData =
      formData.education && formData.education.length > 0
        ? [...formData.education]
        : [];
    updatedData.splice(index, 1);
    setFormData({ ...formData, education: updatedData });
  };

  const handleExpChange = (e) => {
    const { name, value } = e.target;

    let updatedErrors = { ...validationErrors };

    switch (name) {
      case "joiningDate":
        updatedErrors[name] = !moment(value, "MM/YYYY").isValid()
          ? "Invalid year format. MM/YYYY."
          : null;
        if (updatedErrors[name]) {
          break;
        }
        updatedErrors[name] =
          moment().diff(moment(value, "MM/YYYY"), "months") < 1
            ? "Joining date should be less than current date"
            : null;

        if (!updatedErrors.joiningDate) {
          updatedErrors = validationErrors;
          delete updatedErrors.joiningDate;
        }

        break;
      case "relievingDate":
        updatedErrors[name] = !moment(value, "MM/YYYY").isValid()
          ? "Invalid year format. MM/YYYY."
          : moment(value, "MM/YYYY").diff(
              moment(formValues.joiningDate, "MM/YYYY"),
              "months"
            ) < 0
          ? "relieving date is more than joining date"
          : null;
        if (updatedErrors[name]) {
          break;
        }
        updatedErrors[name] =
          moment().diff(moment(value, "MM/YYYY"), "months") < 1
            ? "Releiving date should be less than current date"
            : null;
        if (!updatedErrors.relievingDate) {
          updatedErrors = validationErrors;
          delete updatedErrors.relievingDate;
        }

        break;
      case "organizationName":
        if (!value) {
          updatedErrors[name] = "Please provide organization name";
        } else {
          updatedErrors = validationErrors;
          delete updatedErrors.organizationName;
        }
        break;

      case "isCurrentlyWorking":
        if (value) {
          setFormValues({ ...formValues, [name]: value, relievingDate: "" });

          return;
        }
        break;

      case "designation":
        if (!value) {
          updatedErrors[name] = "Please provide your designation";
        } else {
          updatedErrors = validationErrors;
          delete updatedErrors[name];
        }
        break;
      case "responsibilities":
        if (!value) {
          updatedErrors[name] = "Please describe responsibilities";
        } else {
          updatedErrors = validationErrors;
          delete updatedErrors.name;
        }
        break;
      default:
        break;
    }

    setValidationErrors(updatedErrors);
    setFormValues({ ...formValues, [name]: value });
  };

  const handleExpRemove = (index) => {
    const updatedData =
      formData.experience && formData.experience.length > 0
        ? [...formData.experience]
        : [];
    updatedData.splice(index, 1);

    setFormData({ ...formData, experience: updatedData });
  };
  console.log({ formValues });
  const handleExpAdd = () => {
    if (
      !formValues.organizationName ||
      !formValues.designation ||
      !formValues.responsibilities ||
      !formValues.joiningDate ||
      Object.keys(validationErrors).length > 0
    ) {
      setShowValidation(true);
      return;
    }
    if (!formValues.isCurrentlyWorking && !formValues.relievingDate) {
      setShowValidation(true);
      return;
    }
    // Check if the number of rows is already 5
    if (formData?.experience?.length >= 4) {
      alert("You can only add up to 4 entries.");
      return;
    }

    const newEntry = {
      organizationName: formValues.organizationName,
      designation: formValues.designation, // Add the designation field
      responsibilities: formValues.responsibilities,
      joiningDate: formValues.joiningDate,
      isCurrentlyWorking: formValues.isCurrentlyWorking,
      relievingDate: formValues.isCurrentlyWorking
        ? ""
        : formValues.relievingDate,
      //   totalExperienceValue: totalExperienceValue, // Use the calculated totalExperienceValue from the state
    };

    const oldExp =
      formData.experience && formData.experience.length > 0
        ? [...formData.experience]
        : [];

    setFormData({ ...formData, experience: [...oldExp, newEntry] });

    setFormValues({
      ...formValues,
      organizationName: "",
      designation: "", // Reset the designation field
      responsibilities: "",
      joiningDate: "",
      isCurrentlyWorking: false,
      relievingDate: "",
    });
    setShowValidation(false);
  };
  const handleExperience = (event) => {
    if (event.target.name === "experienceNo") {
      setexperienced(false);
      setFormData({ ...formData, experience: [], isExperienced: false });
      setFormValues({});
      setValidationErrors({});
    } else {
      setexperienced(true);
      setFormData({ ...formData, experience: [], isExperienced: true });
      setFormValues({});
      setValidationErrors({});
    }
  };
  return (
    <Form style={{ padding: "1rem 2.5rem 0", backgroundColor: "white" }}>
      <Col sm={{ span: 10, offset: 0 }}>
        <Row className={`mb-1 mt-1`}>
          <h2 className={css.title}>Professional Qualifications</h2>
        </Row>
        <Col>
          <Form.Group className="mb-3" controlId="degree">
            <Form.Label className={css.labelChange}>Degree Name :</Form.Label>
            <Form.Control
              type="text"
              name="degree"
              value={formData.degree}
              onChange={handleEduChange}
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
              onChange={handleEduChange}
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
              onChange={handleEduChange}
              isInvalid={showErrorAlert && !formData.institute}
              style={{ borderRadius: "2px" }}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid degree name.
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            className={`${css.customButton} mb-5`}
            variant="primary"
            onClick={handleEduAdd}
            disabled={loading}
          >
            + Add New
          </Button>
        </Col>
        <Row>
          <Col>
            <Table striped bordered hover>
              <thead className={css.table}>
                <tr>
                  <th>Degree Name</th>
                  <th>Year of Passing</th>
                  <th>College /University</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody className={css.tableBody}>
                {formData?.education?.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.degree}</td>
                    <td>{entry.yearOfPassing}</td>
                    <td>{entry.institute}</td>
                    <td>
                      <Button
                        type="button"
                        className={css.removeButton}
                        onClick={() => handleEduRemove(index)}
                        disabled={loading}
                      >
                        <AiFillCloseCircle className={css.close} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Col>
      <Col sm={{ span: 10, offset: 0 }}>
        <Row className={`mb-1 mt-1`}>
          <h2 className={css.title}>Experiences</h2>
        </Row>
        <Col sm={{ span: 11, offset: 0 }}>
          <Form.Group className="mb-3" controlId="experience">
            <div className="d-flex justify-content-start">
              <Form.Label className={css.labelChange}>
                Is Experienced :
              </Form.Label>
              <Form.Check
                type="radio"
                id="experienceYes"
                className={`${css.labelChange} mx-3`}
                label="Yes"
                name="role"
                value={true}
                checked={experienced}
                onChange={handleExperience}
              />

              <Form.Check
                type="radio"
                id="experience"
                className={`${css.labelChange} mx-3`}
                label="No"
                name="experienceNo"
                value={false}
                checked={!experienced}
                onChange={handleExperience}
              />
            </div>
          </Form.Group>
          {
            <>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="organizationName">
                    <Form.Label className={css.labelChange}>
                      Organization Name :
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleExpChange}
                      isInvalid={showErrorAlert && !formData.organizationName}
                      required
                      disabled={!experienced}
                      style={{ borderRadius: "2px" }}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide organization name.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="designation">
                    <Form.Label className={css.labelChange}>
                      Designation :
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleExpChange}
                      isInvalid={showErrorAlert && !formData.designation}
                      disabled={!experienced}
                      required
                      style={{ borderRadius: "2px" }}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide designation.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="responsibilities">
                <Form.Label className={css.labelChange}>
                  Responsibilities :
                </Form.Label>
                <Form.Control
                  type="text"
                  name="responsibilities"
                  as="textarea"
                  rows={3}
                  value={formData.responsibilities}
                  onChange={handleExpChange}
                  isInvalid={showErrorAlert && !formData.responsibilities}
                  disabled={!experienced}
                  required
                  style={{ borderRadius: "2px", resize: "none" }}
                />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="relievingDate">
                    <Form.Label className={css.labelChange}>
                      Is Currently Working
                    </Form.Label>

                    <Form.Select
                      name="isCurrentlyWorking"
                      value={formData.isCurrentlyWorking}
                      onChange={handleExpChange}
                      disabled={!experienced}
                      style={{ borderRadius: "2px" }}
                    >
                      <option value={false}>No</option>
                      <option value={true}>Yes</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="joiningDate">
                    <Form.Label className={css.labelChange}>
                      Joining Date(mm/yyyy)
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="mm/yyyy"
                      value={formData.joiningDate}
                      name="joiningDate"
                      onChange={handleExpChange}
                      //isInvalid={}  Apply isInvalid class based on dobIsValid state
                      disabled={!experienced}
                      required
                      style={{ borderRadius: "2px" }}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide date of Joining.
                    </Form.Control.Feedback>
                    {validationErrors.joiningDate && (
                      <Form.Text className="text-danger">
                        {validationErrors.joiningDate}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="mb-3" controlId="relievingDate">
                    <Form.Label className={css.labelChange}>
                      Relieving Date(mm/yyyy)
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="mm/yyyy"
                      value={formData.relievingDate}
                      name="relievingDate"
                      onChange={handleExpChange}
                      //isInvalid={}  Apply isInvalid class based on dobIsValid state
                      disabled={!experienced || formData.isCurrentlyWorking}
                      required
                      style={{ borderRadius: "2px" }}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide relieving date.
                    </Form.Control.Feedback>
                    {validationErrors.relievingDate && (
                      <Form.Text className="text-danger">
                        {validationErrors.relievingDate}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Button
                className={`${css.customButton} mb-5`}
                variant="primary"
                onClick={handleExpAdd}
                disabled={!experienced}
              >
                + Add New
              </Button>

              <Row>
                <Col>
                  <Table striped bordered hover>
                    <thead className={css.table}>
                      <tr>
                        <th>Degree Name</th>
                        <th>Year of Passing</th>
                        <th>College /University</th>
                        <th>Total Experience</th>
                        <th>Remove</th>
                      </tr>
                    </thead>
                    <tbody className={css.tableBody}>
                      {formData?.experience?.map((entry, index) => (
                        <tr key={index}>
                          <td>{entry.organizationName}</td>
                          <td>{entry.designation}</td>
                          <td>
                            {entry.responsibilities.length > 150
                              ? `${entry.responsibilities.substring(0, 150)}...`
                              : entry.responsibilities}
                          </td>
                          <td>
                            {entry.joiningDate} - {entry.relievingDate}
                          </td>
                          <td>
                            <Button
                              type="button"
                              className={css.removeButton}
                              onClick={() => handleExpRemove(index)}
                            >
                              <AiFillCloseCircle className={css.close} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </>
          }
        </Col>
      </Col>
    </Form>
  );
}
