import React from "react";
import { Image, Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import Logo from "../../images/Header/logo.svg";
import { Link } from "react-router-dom";
import Avatar from "../Avatar/AvatarProfile";

const WebLoggedHeader = ({ navDetails, profileDetails, user }) => {
  return (
    <>
      <Navbar expand="sm" className="bg-body-tertiary">
        <Container>
          <Link to="/">
            <Navbar.Brand>
              <Image
                alt="logo"
                src={Logo}
                width="65"
                height="70"
                className="me-3"
              />{" "}
              <span className="brand">Securing Digital World!</span>
            </Navbar.Brand>
          </Link>
          <Nav>
            {navDetails.map((detail, index) => (
              <Link key={index} to={`/${detail.Link}`}>
                <div key={detail.name}>
                  <Image
                    alt="Img"
                    src={detail.icon}
                    width="40"
                    height="40"
                    className="d-block mx-auto"
                  />{" "}
                  <Nav.Link className="link me-2">{detail.name}</Nav.Link>
                </div>
              </Link>
            ))}

            <div>
              <Avatar user={user.user} size={40} />
              <NavDropdown
                title="My Profile"
                id="dropdown-menu-align-responsive-1"
                align={{ sm: "end" }}
              >
                {profileDetails.map((detail, index) => (
                  <NavDropdown.Item
                    key={index}
                    className="mb-3"
                    href={detail.href ? `#action${detail.href}` : null}
                    onClick={
                      detail.clickHandler ? () => detail.clickHandler() : null
                    }
                  >
                    <Link key={detail.name} to={`/${detail.link}`}>
                      <div onClick={detail.handleLogOut}>
                        <Image
                          alt="Img"
                          src={detail.icon}
                          width="22"
                          height="21"
                          className="d-line-block me-2"
                        />{" "}
                        {detail.name}
                      </div>
                    </Link>
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            </div>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default WebLoggedHeader;
