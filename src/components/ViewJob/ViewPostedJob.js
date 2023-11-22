import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ViewJobCard from "./ViewJobCard";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab, Pagination, Row, Col } from "react-bootstrap";
import {
    setLiveJobLoading,
    setLiveJobSuccess,
    setLiveJobError,
    setReviewJobLoading,
    setReviewJobSuccess,
    setReviewJobError,
    setPausedJobLoading,
    setPausedJobSuccess,
    setPausedJobError,
} from "../../state/employerJob/employerJobSlice";
import Loading from "../Loading/Loading";

export default function ViewPostedJob({
    status,
    user,
    state,
    data,
    setData,
    statusChange,
    setShow,
    dispatch,
    page,
    userToken
}) {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("live");
    const itemsPerPage = 10;
    const [totalPages, setTotalPages] = useState(0);

    const {
        liveJobLoading,
        liveJobSuccess,
        liveJobError,
        pausedJobLoading,
        pausedJobSuccess,
        pausedJobError,
        reviewJobLoading,
        reviewJobSuccess,
        reviewJobError,
    } = state.employerJobs;

    const handleTabSelect = (selectedTab) => {
        setActiveTab(selectedTab);
        navigate(`/dashboard/jobs?status=${selectedTab}&page=${page || 1}`);
    };

    useEffect(() => {
        navigate(`/dashboard/jobs?status=${status}&page=${page || 1}`)
        if (status === "live") {
            dispatch(setLiveJobLoading());
        } else if (status === "under-review") {
            dispatch(setReviewJobLoading());
        } else if (status === "paused") {
            dispatch(setPausedJobLoading());
        }
        axios
            .get(`/api/employer/job?status=${status}&page=${page}&limit=${itemsPerPage}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            })
            .then((res) => {
                setTotalPages(res.data.pagination.totalPages)
                setData(res.data.jobs);
                if (status === "live") {
                    dispatch(setLiveJobSuccess());
                } else if (status === "under-review") {
                    dispatch(setReviewJobSuccess());
                } else if (status === "paused") {
                    dispatch(setPausedJobSuccess());
                }
            })
            .catch((err) => {
                console.log(err);
                if (status === "live") {
                    dispatch(setLiveJobError(err));
                } else if (status === "under-review") {
                    dispatch(setReviewJobError(err));
                } else if (status === "paused") {
                    dispatch(setPausedJobError(err));
                }
                setData([]);
            });
        if (status === "live") {
            setActiveTab("live");
        } else if (status === "under-review") {
            setActiveTab("under-review");
        } else if (status === "paused") {
            setActiveTab("paused");
        }
    }, [status, page]);

    const handlePageChange = (pageNumber) => {
        navigate(`/dashboard/jobs?status=${status}&page=${pageNumber}`)
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            navigate(`/dashboard/jobs?status=${status}&page=${parseInt(page) + 1}`)
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            navigate(`/dashboard/jobs?status=${status}&page=${parseInt(page) - 1}`)
        }
    };

    return (
        <div>
            <Tabs className="mb-3" activeKey={activeTab} onSelect={handleTabSelect}>
                <Tab eventKey="live" title="Live">
                    {liveJobLoading ? (
                        <Loading />
                    ) : Array.isArray(data) && data.length > 0 ? (
                        data.map((x, index) => {
                            return (
                                <div key={index} className="mb-3">
                                    <ViewJobCard
                                        setShow={setShow}
                                        statusChange={statusChange}
                                        avatar={true}
                                        user={user}
                                        data={x}
                                        setData={setData}
                                        status={status}
                                    />
                                </div>
                            );
                        })
                    ) : (
                        <div>No jobs added yet.</div>
                    )}
                </Tab>
                <Tab eventKey="under-review" title="Under Review">
                    {reviewJobLoading ? (
                        <Loading />
                    ) : Array.isArray(data) && data.length > 0 ? (
                        data.map((x, index) => {
                            return (
                                <div key={index} className="mb-3">
                                    <ViewJobCard
                                        setShow={setShow}
                                        statusChange={statusChange}
                                        avatar={true}
                                        user={user}
                                        data={x}
                                        setData={setData}
                                        status={status}
                                    />
                                </div>
                            );
                        })
                    ) : (
                        <div>No jobs added yet.</div>
                    )}
                </Tab>
                <Tab eventKey="paused" title="Paused">
                    {pausedJobLoading ? (
                        <Loading />
                    ) : Array.isArray(data) && data.length > 0 ? (
                        data.map((x, index) => {
                            return (
                                <div key={index} className="mb-3">
                                    <ViewJobCard
                                        setShow={setShow}
                                        statusChange={statusChange}
                                        avatar={true}
                                        user={user}
                                        data={x}
                                        setData={setData}
                                        status={status}
                                    />
                                </div>
                            );
                        })
                    ) : (
                        <div>No jobs added yet.</div>
                    )}
                </Tab>
            </Tabs>
            {Array.isArray(data) && data.length > 0 && (
                <Row className="justify-content-center">
                    <Col xs="auto">
                        <Pagination>
                            <Pagination.Prev onClick={handlePreviousPage} disabled={page === 1} />
                            {Array.from({ length: totalPages }).map((_, index) => {
                                if (
                                    index === 0 ||
                                    index === parseInt(page) - 1 ||
                                    index === totalPages - 1 ||
                                    (index >= parseInt(page) - 2 && index <= parseInt(page) + 2)
                                ) {
                                    return (
                                        <Pagination.Item
                                            key={index + 1}
                                            active={index + 1 === parseInt(page)}
                                            onClick={() => handlePageChange(index + 1)}
                                        >
                                            {index + 1}
                                        </Pagination.Item>
                                    );
                                } else if (
                                    (index === 1 && parseInt(page) - 3 > 1) ||
                                    (index === totalPages - 2 && parseInt(page) + 3 < totalPages)
                                ) {
                                    return <Pagination.Ellipsis key={index} />;
                                }
                                return null;
                            })}
                            <Pagination.Next onClick={handleNextPage} disabled={parseInt(page) === totalPages} />
                        </Pagination>
                    </Col>
                </Row>
            )}
        </div>
    );
}
