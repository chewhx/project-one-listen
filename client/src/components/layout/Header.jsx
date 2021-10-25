import React from "react";
import {
  Container,
  Navbar,
  Col,
  Row,
  Nav,
  NavDropdown,
  Dropdown,
  ButtonGroup,
  Button,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useIsFetching } from "react-query";
import { Soundwave } from "react-bootstrap-icons";
import { useAuth0 } from "@auth0/auth0-react";

const Header = () => {
  // Hooks
  const isFetching = useIsFetching();
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  // Presentation
  return (
    <>
      <Navbar
        collapseOnSelect
        className="mb-5 mb-md-3 bg-white"
        variant="light"
        expand="lg"
      >
        <Container>
          <NavLink className="navbar-brand" to="/">
            <div className="d-flex">
              <h1>One</h1>
              <Soundwave size="50" className="mx-1" />
              <h1>Listen</h1>
            </div>
          </NavLink>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto">
              <NavDropdown title="Podcast" id="nav-dropdown-podcast">
                <NavDropdown.Item eventKey="4.1">
                  <NavLink to="/podcast/rss" className="nav-link mr-2">
                    RSS Feed
                  </NavLink>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item eventKey="4.2">
                  <NavLink
                    to="/podcast/topic/singapore"
                    className="nav-link mr-2"
                  >
                    Singapore
                  </NavLink>
                </NavDropdown.Item>
                <NavDropdown.Item eventKey="4.3">
                  <NavLink to="/podcast/topic/tech" className="nav-link mr-2">
                    Tech
                  </NavLink>
                </NavDropdown.Item>
              </NavDropdown>

              <Nav.Item>
                <NavLink to="/speech" className="nav-link mr-2">
                  Speech
                </NavLink>
              </Nav.Item>
              {isAuthenticated && (
                <Nav.Item>
                  <NavLink to="/profile" className="nav-link mr-2">
                    Profile
                  </NavLink>
                </Nav.Item>
              )}
              <Nav.Item>
                {isAuthenticated ? (
                  <Button variant="secondary" onClick={() => logout()}>
                    Log Out
                  </Button>
                ) : (
                  <Button
                    variant="outline-dark"
                    onClick={() => loginWithRedirect()}
                  >
                    Log In
                  </Button>
                )}
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
