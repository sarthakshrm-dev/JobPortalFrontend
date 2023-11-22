import React, { useState } from "react";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import css from "./EmployerCompanyOffices.module.css";
import { useNavigate } from "react-router-dom";
import SuccessAlert from "../SuccessAlert/SuccessAlert";
import ErrorAlert from "../ErrorAlert/ErrorAlert";
import { cloneDeep, isEqual } from "lodash";
import moment from "moment";
import { AiFillCloseCircle } from "react-icons/ai";
const EmployerCompanyOffices = ({
  dispatch,
  companyData,
  createEmployerCompany,
  updateEmployerCompany,
  employerCompanyState,
  clearForm,
  nextTab,
}) => {
  const addressTypeArr = [
    {
      key: "registeredOffice",
      value: "registeredOffice",
      label: "Registered office",
    },
    {
      key: "corporateOffice",
      value: "corporateOffice",
      label: "Corporate office",
    },
    { key: "branchOffice", value: "branchOffice", label: "Branch office" },
    { key: "siteOffice", value: "siteOffice", label: "Site office" },
    {
      key: "clientLocation",
      value: "clientLocation",
      label: "Client's location",
    },
    { key: "headOffice", value: "headOffice", label: "Head location" },
  ];
  const [initialValues, setInitialValues] = useState({});
  const [formValues, setFormValues] = useState({});
  const [officeArr, setOfficeArray] = useState([]);

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
    const values = companyData?.offices || [];
    const copiedValues = cloneDeep(values);
    setInitialValues(copiedValues);
    setFormValues({});
    setOfficeArray(copiedValues);
  }, [companyData]);

  React.useEffect(() => {
    setIsFromChanged(!isEqual(officeArr, initialValues));
  }, [officeArr, initialValues]);

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

      case "addressType":
        if (!value) {
          updatedErrors[name] = "Please provide a valid addressType name.";
        } else {
          updatedErrors = errors;
          delete updatedErrors.addressType;
        }
        break;
      case "address1":
        if (!value) {
          updatedErrors[name] = "Please provide address1";
        } else {
          updatedErrors = errors;
          delete updatedErrors.address1;
        }
        break;
      case "country":
        if (!value) {
          updatedErrors[name] = "Please provide country";
        } else {
          updatedErrors = errors;
          delete updatedErrors.country;
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
      !formValues.addressType ||
      !formValues.address1 ||
      !formValues.country ||
      !formValues.number ||
      !formValues.email
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
      addressType: formValues.addressType,
      address1: formValues.address1,
      address2: formValues.address2,
      country: formValues.country,
      city: formValues.city,
      state: formValues.state,
      pin: formValues.pin,
      email: formValues.email,
      number: formValues.number,
    };
    setOfficeArray([...officeArr, newArr]);
    setFormValues({
      addressType: "",
      address1: "",
      address2: "",
      country: "",
      city: "",
      state: "",
      pin: "",
      number: "",
      email: "",
    });
    setErrorMessage(false);
    setErrors({});
  };
  const handleRemove = (index) => {
    console.log("rem");
    const updatedData = [...officeArr];
    updatedData.splice(index, 1);
    setOfficeArray(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      offices: officeArr,
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
        style={{ padding: "2rem 2.5rem 0", backgroundColor: "white" }}
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
            <Form.Group controlId="addressType">
              <Form.Label className={css.labelChange}>
                Address Type :
              </Form.Label>
              <Form.Select
                name="addressType"
                value={formValues.addressType}
                onChange={handleChange}
                className="custom-select"
                style={{ borderRadius: "2px" }}
                required
              >
                <option key={1} value="">
                  Select
                </option>
                {addressTypeArr.map((each, index) => (
                  <option key={index} value={each.value}>
                    {each.label}
                  </option>
                ))}
              </Form.Select>
              {errors.addressType && (
                <Form.Text className="text-danger">
                  {errors.addressType}
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="address1">
              <Form.Label className={css.labelChange}>
                Address line 1 :
              </Form.Label>
              <Form.Control
                type="text"
                name="address1"
                value={formValues.address1}
                onChange={handleChange}
                isInvalid={showErrorAlert && !formValues.address1}
                style={{ borderRadius: "2px" }}
              />
              <Form.Control.Feedback type="invalid">
                Please provide an address.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="address2">
              <Form.Label className={css.labelChange}>
                Address line 2 :
              </Form.Label>
              <Form.Control
                type="text"
                name="address2"
                value={formValues.address2}
                onChange={handleChange}
                isInvalid={showErrorAlert && !formValues.address2}
                style={{ borderRadius: "2px" }}
              />
              <Form.Control.Feedback type="invalid">
                Please provide an address.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="country">
              <Form.Label className={css.labelChange}>Country :</Form.Label>
              <Form.Control
                type="text"
                name="country"
                value={formValues.country}
                onChange={handleChange}
                isInvalid={showErrorAlert && !formValues.country}
                style={{ borderRadius: "2px" }}
              />
              <Form.Control.Feedback type="invalid">
                Please provide an country.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="city">
              <Form.Label className={css.labelChange}>City :</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={formValues.city}
                onChange={handleChange}
                isInvalid={showErrorAlert && !formValues.city}
                style={{ borderRadius: "2px" }}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a city.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="state">
              <Form.Label className={css.labelChange}>State :</Form.Label>
              <Form.Control
                type="text"
                name="state"
                value={formValues.state}
                onChange={handleChange}
                isInvalid={showErrorAlert && !formValues.state}
                style={{ borderRadius: "2px" }}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a state.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="pin">
              <Form.Label className={css.labelChange}>Pin Code :</Form.Label>
              <Form.Control
                type="text"
                name="pin"
                value={formValues.pin}
                onChange={handleChange}
                isInvalid={showErrorAlert && !formValues.pin}
                style={{ borderRadius: "2px" }}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a pin.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="number">
              <Form.Label className={css.labelChange}>
                Mobile Number:
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
                    <th>Address Type</th>
                    <th>Registered Address</th>
                    <th>Email</th>
                    <th>Mobile No.</th>

                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody className={css.tableBody}>
                  {officeArr.map((entry, index) => (
                    <tr key={index}>
                      <td>
                        {
                          addressTypeArr.find(
                            (e) => e.value == entry.addressType
                          ).label
                        }
                      </td>
                      <td>
                        {entry.address1 +
                          " " +
                          entry.address2 +
                          " " +
                          entry.country +
                          " " +
                          entry.pin}
                      </td>
                      <td>{entry.email}</td>
                      <td>{entry.number}</td>
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
              : "Save "}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default EmployerCompanyOffices;
