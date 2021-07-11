import React, { useContext } from "react";
import { NavDropdown, Nav, Button, Image } from "react-bootstrap";
import { useHistory } from "react-router";
import { LinkContainer } from "react-router-bootstrap";

import { AuthContext } from "../../../providers/AuthProvider";
import { ModalContext } from "../../../providers/ModalProvider";

import Form from "../../../containers/Form";

const NavExpand = () => {
  // Hooks
  const history = useHistory();
  const { user, logoutHandler } = useContext(AuthContext);
  const { handleModal } = useContext(ModalContext);
  // Presentation
  return (
    <Nav className="ml-auto d-none d-lg-flex">
      {user?._id ? (
        <>
          <NavDropdown
            title={
              <span>
                <i className="bi bi-plus-lg"></i>
              </span>
            }
            id="nav-action-menu"
          >
            <NavDropdown.Item
              eventKey="3.1"
              onClick={() => handleModal(<Form.Text />)}
            >
              New text
            </NavDropdown.Item>
            <NavDropdown.Item
              eventKey="3.2"
              onClick={() => handleModal(<Form.Url />)}
            >
              Upload url
            </NavDropdown.Item>
            <NavDropdown.Item disabled eventKey="3.3">
              Upload text file
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown
            title={
              <Image
                fluid
                style={{ height: "28px" }}
                src={user.photo || "https://ui-avatars.com/api/?name=John+Doe"}
                roundedCircle
              />
            }
            id="nav-user-menu"
          >
            <LinkContainer to={`/profile/${user._id}`}>
              <NavDropdown.Item>
                {user.email || user.name || "Nameless"}
              </NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to={`/uploads/${user._id}`}>
              <NavDropdown.Item>Uploads</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to={`/profile/edit/${user._id}`}>
              <NavDropdown.Item>Profile</NavDropdown.Item>
            </LinkContainer>
            <NavDropdown.Divider />
            <NavDropdown.Item
              as={Button}
              onClick={() => {
                logoutHandler();
                history.replace(`/signin`);
              }}
            >
              Sign out
            </NavDropdown.Item>
          </NavDropdown>
        </>
      ) : (
        <LinkContainer to={`/signin`}>
          <Nav.Link>Sign in</Nav.Link>
        </LinkContainer>
      )}
    </Nav>
  );
};

export default NavExpand;
