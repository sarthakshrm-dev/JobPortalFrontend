import { React, useEffect, useState } from "react";
import ViewJobCard from "./ViewJobCard";
import { Button, Card } from "react-bootstrap";
import css from "../../components/JobseekerProfileView/JobseekerProfileView.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  setJobDetailsLoading,
  setJobDetailsSuccess,
  setJobDetailsError,
} from "../../state/employerJob/employerJobSlice";
import Loading from "../Loading/Loading";

const ViewJobDetails = ({
  user,
  id,
  data,
  setData,
  statusChange,
  dispatch,
  state,
  userToken
}) => {
  const navigate = useNavigate();

  const { jobDetailsLoading, jobDetailsSuccess, jobDetailsError } =
    state.employerJobs;

  useEffect(() => {
    dispatch(setJobDetailsLoading());
    axios
      .get(`/api/employer/job/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setData(res.data.job);
        dispatch(setJobDetailsSuccess());
      })
      .catch((err) => {
        console.log(err);
        dispatch(setJobDetailsError(err));
      });
  }, []);

  return (
    <>
      {jobDetailsLoading ? (
        <Loading />
      ) : (
        data && (
          <div className="row">
            <div className="mb-3">
              <ViewJobCard
                statusChange={statusChange}
                avatar={false}
                user={user}
                status={data.status}
                id={id}
                data={data}
              />
            </div>
            <div className="mb-4">
              <Card className={`${css.Card} p-2`}>
                <div>
                  <span className="mb-4">{data.jobTitle}</span>
                  <span className="mb-1" style={{ fontWeight: "normal" }}>
                    {data.country}, {data.city}
                  </span>
                  <span className="mb-1" style={{ fontWeight: "normal" }}>
                    {data.workplaceType}
                  </span>
                  <span className="mb-4" style={{ fontWeight: "normal" }}>
                    {data.jobType}
                  </span>
                  <span className="mb-4">Details</span>
                  <span className="mb-1" style={{ fontWeight: "normal" }}>
                    <span style={{ fontWeight: "bolder" }}>Description:</span>{" "}
                    {data.description}
                  </span>
                  <span className="mb-1" style={{ fontWeight: "normal" }}>
                    <span style={{ fontWeight: "bolder" }}>
                      Qualifications:
                    </span>{" "}
                    {data.qualifications}
                  </span>
                  <div style={{ fontWeight: "normal" }} className="mb-4">
                    {data.minimumRequirements &&
                      data.minimumRequirements.map((x, index) => {
                        return (
                          <span key={index}>
                            <span style={{ fontWeight: "bolder" }}>
                              {x.skill}:
                            </span>{" "}
                            {x.experience}
                          </span>
                        );
                      })}
                  </div>
                  <span className="mb-4">Questions</span>
                  <div className="mb-3">
                    {data.screeningQuestions &&
                      data.screeningQuestions.map((x, index) => {
                        return (
                          <div
                            style={{ fontWeight: "normal" }}
                            className="d-flex mb-1"
                            key={index}
                          >
                            <span>{index + 1}.</span>
                            <div className="d-flex flex-column">
                              <span>{x.question}</span>
                              <span>
                                <span style={{ fontWeight: "bolder" }}>
                                  Answer:
                                </span>
                                {x.idealAnswer}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  <span className="mb-4">Payout Details</span>
                  <span className="mb-1" style={{ fontWeight: "normal" }}>
                    <span style={{ fontWeight: "bolder" }}>
                      No. of Vacancies:
                    </span>{" "}
                    {data.NoOfVacancies}
                  </span>
                  <span className="mb-1" style={{ fontWeight: "normal" }}>
                    <span style={{ fontWeight: "bolder" }}>
                      No. of Applications required:
                    </span>{" "}
                    {data.NoOfApplications}
                  </span>
                  <span className="mb-1" style={{ fontWeight: "normal" }}>
                    <span style={{ fontWeight: "bolder" }}>
                      Annual CTC Range:
                    </span>{" "}
                    {data.annualCtcRange}
                  </span>
                  <span className="mb-1" style={{ fontWeight: "normal" }}>
                    <span style={{ fontWeight: "bolder" }}>
                      Maximum Budget:
                    </span>{" "}
                    {data.maximumBudget}
                  </span>
                  <span className="mb-1" style={{ fontWeight: "normal" }}>
                    <span style={{ fontWeight: "bolder" }}>Minimum CTC:</span>{" "}
                    {data.minimumCtc}
                  </span>
                  <span className="mb-1" style={{ fontWeight: "normal" }}>
                    <span style={{ fontWeight: "bolder" }}>
                      FulFillmentPayout ({data.FulFillmentPayoutType}):
                    </span>{" "}
                    {data.FulFillmentPayout}
                  </span>
                </div>
              </Card>
            </div>
            {!user.user.userType === "recruiter" && data.status && (
              <div className="d-flex justify-content-center">
                {data.status === "closed" ? (
                  <Button
                    style={{ borderRadius: "5px", fontSize: "12px" }}
                    type="button"
                    variant="secondary"
                    className="me-3"
                    onClick={() => navigate(`/dashboard/job/edit-job/new/review-and-submit`, {state: {data: data}})}
                  >
                    Repost Job
                  </Button>
                ) : data.status === "draft" ? (
                  <Button
                    style={{ borderRadius: "5px", fontSize: "12px" }}
                    type="button"
                    variant="secondary"
                    onClick={() => statusChange("deleted", data)}
                  >
                    Delete Draft
                  </Button>
                ) : (
                  <Button
                    style={{ borderRadius: "5px", fontSize: "12px" }}
                    type="button"
                    variant="secondary"
                    className="me-3"
                    onClick={() => statusChange("closed", data)}
                  >
                    Close Job
                  </Button>
                )}
                {data.status === "draft" ? (
                  <Button
                    style={{ borderRadius: "5px", fontSize: "12px" }}
                    type="button"
                    variant="primary"
                    className="me-3"
                    onClick={() => navigate(`/dashboard/jobs/${data.jobId}`)}
                  >
                    Complete Draft
                  </Button>
                ) : (
                  <Button
                    style={{ borderRadius: "5px", fontSize: "12px" }}
                    type="button"
                    variant="primary"
                  >
                    View Applications
                  </Button>
                )}
              </div>
            )}
          </div>
        )
      )}
    </>
  );
};

export default ViewJobDetails;
