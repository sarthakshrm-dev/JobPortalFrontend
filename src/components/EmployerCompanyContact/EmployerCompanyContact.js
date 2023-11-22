import React, { useState } from "react";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import css from "./EmployerCompanyContact.module.css";
import { useNavigate } from "react-router-dom";
import SuccessAlert from "../SuccessAlert/SuccessAlert";
import ErrorAlert from "../ErrorAlert/ErrorAlert";
import { cloneDeep, isEqual } from "lodash";
import moment from "moment";
import { AiFillCloseCircle } from "react-icons/ai";
const EmployerCompanyContact = ({
  dispatch,
  companyData,
  createEmployerCompany,
  updateEmployerCompany,
  employerCompanyState,
  clearForm,
  nextTab,
}) => {
  const [initialValues, setInitialValues] = useState({});
  const [formValues, setFormValues] = useState({});
  const [contactArray, setContactArray] = useState([]);

  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormChanged, setIsFromChanged] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  React.useEffect(() => {
    if (
      employerCompanyState.companySaveError ||
      employerCompanyState.companyUpdateError
    ) {
      setFormValues({});
    }
  }, [
    employerCompanyState.companyUpdateError,
    employerCompanyState.companySaveError,
    initialValues,
  ]);
  React.useEffect(() => {
    if (
      employerCompanyState.companySaveSuccess ||
      employerCompanyState.companyUpdateSuccess
    ) {
      nextTab();
      return;
    }
  }, [
    employerCompanyState.companyUpdateSuccess,
    employerCompanyState.companySaveSuccess,
    navigate,
    nextTab,
  ]);
  React.useEffect(() => {
    const values = companyData?.contactDetails || [];
    const copiedValues = cloneDeep(values);
    setInitialValues(copiedValues);
    setFormValues({});
    setContactArray(copiedValues);
  }, [companyData]);

  React.useEffect(() => {
    setIsFromChanged(!isEqual(contactArray, initialValues));
  }, [contactArray, initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(clearForm());
    setShowErrorAlert(false);

    let updatedErrors = { ...errors };

    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(value);

        updatedErrors = {
          ...errors,
          ...{ email: isValidEmail ? null : "Invalid email format" },
        };

        if (isValidEmail) {
          delete errors.email;
        }
        break;
      case "number":
        const contactRegex = /^\d{10,14}$/;
        const isValidContact = contactRegex.test(value);

        updatedErrors = {
          ...errors,
          ...{ number: isValidContact ? null : "Invalid number format" },
        };
        if (isValidContact) {
          delete errors.contact;
        }
        break;

      case "title":
        if (!value) {
          updatedErrors[name] = "Please provide a valid title name.";
        } else {
          updatedErrors = errors;
          delete updatedErrors.title;
        }
        break;
      case "designation":
        if (!value) {
          updatedErrors[name] = "Please provide designation";
        } else {
          updatedErrors = errors;
          delete updatedErrors.designation;
        }
        break;
      case "name":
        if (!value) {
          updatedErrors[name] = "Please provide name";
        } else {
          updatedErrors = errors;
          delete updatedErrors.name;
        }
        break;
      default:
        break;
    }

    setErrors(updatedErrors);
    setFormValues({ ...formValues, [name]: value });
  };
  const handleAdd = () => {
    if (
      !formValues.title ||
      !formValues.name ||
      !formValues.number ||
      !formValues.email ||
      !formValues.designation
    ) {
      setErrorMessage(true);
      return;
    }
    if (Object.values(errors).some((error) => error !== null)) {
      setShowErrorAlert(true);
      setErrorMessage("Please fill in all the required fields correctly.");
      return;
    }
    const newArr = {
      title: formValues.title,
      name: formValues.name,
      number: formValues.number,
      email: formValues.email,
      designation: formValues.designation,
    };
    setContactArray([...contactArray, newArr]);
    setFormValues({
      title: "",
      name: "",
      number: "",
      email: "",
      designation: "",
    });
    setErrorMessage(false);
    setErrors({});
  };
  const handleRemove = (index) => {
    const updatedData = [...contactArray];
    updatedData.splice(index, 1);
    setContactArray(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      contactDetails: contactArray,
    };

    if (companyData) {
      updateEmployerCompany(formData);
    } else {
      createEmployerCompany(formData);
    }
  };

  const navigateToDashboard = () => {
    navigate("/dashboard");
  };
  return (
    <>
      <Form
        style={{ backgroundColor: "white" }}
        onSubmit={handleSubmit}
      >
        {(employerCompanyState.companyUpdateSuccess ||
          employerCompanyState.companySaveSuccess) && (
            <SuccessAlert message="Data saved successfully!" />
          )}
        {showErrorAlert && <ErrorAlert message={errorMessage} />}
        {(employerCompanyState.companyUpdateError ||
          employerCompanyState.companySaveError) && (
            <ErrorAlert message={"Something went wrong"} />
          )}
        <Col sm={{ span: 10, offset: 0 }}>
          <Col sm={8}>
            <Form.Group controlId="title">
              <Form.Label className={css.labelChange}>Title :</Form.Label>
              <Form.Select
                name="title"
                value={formValues.title}
                onChange={handleChange}
                className="custom-select"
                style={{ borderRadius: "2px" }}
                required
              >
                <option key={1} value="">
                  Select
                </option>
                <option key={2} value="mr">
                  Mr.
                </option>
                <option key={3} value="mrs">
                  Mrs.
                </option>
                <option key={4} value="miss">
                  Miss
                </option>
                <option key={5} value="ms">
                  Ms.
                </option>
              </Form.Select>
              {errors.companyType && (
                <Form.Text className="text-danger">
                  {errors.companyType}
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label className={css.labelChange}>
                Contact Person Name :
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                isInvalid={showErrorAlert && !formValues.name}
                style={{ borderRadius: "2px" }}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid name.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="number">
              <Form.Label className={css.labelChange}>
                Contact Number:
              </Form.Label>
              <Form.Control
                type="text"
                name="number"
                value={formValues.number}
                onChange={handleChange}
                isInvalid={showErrorAlert && !formValues.number}
                style={{ borderRadius: "2px" }}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid number.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label className={css.labelChange}>
                Email Address :
              </Form.Label>
              <Form.Control
                type="text"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                isInvalid={showErrorAlert && !formValues.email}
                style={{ borderRadius: "2px" }}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="designation">
              <Form.Label className={css.labelChange}>Designation :</Form.Label>
              <Form.Control
                type="text"
                name="designation"
                value={formValues.designation}
                onChange={handleChange}
                isInvalid={showErrorAlert && !formValues.designation}
                style={{ borderRadius: "2px" }}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid designation name.
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              className={`${css.customButton} mb-5`}
              variant="primary"
              onClick={handleAdd}
              disabled={
                employerCompanyState.companyUpdateLoading ||
                employerCompanyState.companySaveLoading
              }
            >
              + Add New
            </Button>
          </Col>
          <Row>
            <Col sm={11}>
              <Table striped bordered hover>
                <thead className={css.table}>
                  <tr>
                    <th>Contact Person</th>
                    <th>Contact No.</th>
                    <th>Email</th>
                    <th>Designation</th>

                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody className={css.tableBody}>
                  {contactArray.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.name}</td>
                      <td>{entry.number}</td>
                      <td>{entry.email}</td>
                      <td>{entry.designation}</td>
                      <td>
                        <Button
                          type="button"
                          className={css.removeButton}
                          onClick={() => handleRemove(index)}
                          disabled={
                            employerCompanyState.companyUpdateLoading ||
                            employerCompanyState.companySaveLoading
                          }
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
        <div className="d-flex justify-content-end  mt-5">
          <Button
            variant="secondary"
            className="mx-3"
            type="button"
            onClick={navigateToDashboard}
            disabled={
              employerCompanyState.companyUpdateLoading ||
              employerCompanyState.companySaveLoading
            }
          >
            Cancel
          </Button>

          <Button
            variant="secondary"
            className="mx-3"
            type="button"
            disabled={
              !isFormChanged ||
              employerCompanyState.companyUpdateLoading ||
              employerCompanyState.companySaveLoading
            }
            onClick={(e) => handleSubmit(e)}
          >
            {employerCompanyState.companyUpdateLoading ||
              employerCompanyState.companySaveLoading
              ? "Saving..."
              : "Save & Next"}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default EmployerCompanyContact;
