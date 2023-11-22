import React, { useState } from "react";
import {
	Navbar,
	Nav,
	FormControl,
	Form,
	Container,
	Offcanvas,
	Image,
} from "react-bootstrap";
import Bell from "../../images/bell.svg";
import Search from "../../images/search.svg";
import EmployerLoggedSideBar from "../MobileSideBar/EmployerLoggedSideBar";

const EmployerLoggedHeader = ({ user }) => {
	const [showOffcanvas, setShowOffcanvas] = useState(false);

	const handleToggleOffcanvas = () => {
		setShowOffcanvas(!showOffcanvas);
	};

	const closeOffcanvas = (value) => {
		setShowOffcanvas(value);
	};

	return (
		<>


			<Navbar bg="light" expand="lg" className="mb-3">
				<Container className="p-0">
					<Navbar.Toggle
						aria-controls="offcanvas-nav"
						onClick={handleToggleOffcanvas}
						style={{ marginLeft: "0.9rem" }}
					/>

					<Offcanvas
						style={{ width: "80%", height: "97%", zIndex: '2050' }}
						show={showOffcanvas}
						onHide={() => setShowOffcanvas(false)}
					>
						<Offcanvas.Body>
							<Nav className="flex-column">
								<EmployerLoggedSideBar user={user} closeOffcanvas={closeOffcanvas} />
							</Nav>
						</Offcanvas.Body>
					</Offcanvas>

					<Form className="d-flex mx-auto " style={{ width: "60%" }}>
						<div className="search-wrapper " style={{ width: "100%" }}>
							<FormControl
								type="search"
								placeholder="Search Candidates"
								className="mr-2"
							/>
							<img src={Search} alt="search" className="search-icon" />
						</div>
					</Form>
					<Nav className="ml-auto">
						<Image
							alt="logo"
							src={Bell}
							width="22"
							height="22"
							style={{ marginRight: "2.2rem" }}
						/>
					</Nav>
				</Container>
			</Navbar>

		</>
	);
};

export default EmployerLoggedHeader;
