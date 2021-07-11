import React, { useContext } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { useHistory } from "react-router";
import { LinkContainer } from "react-router-bootstrap";

import { AuthContext } from "../../../providers/AuthProvider";
import { ModalContext } from "../../../providers/ModalProvider";

import Form from "../../../containers/Form";

const NavCollapse = () => {
  // Hooks
  const history = useHistory();
  const { user, logoutHandler } = useContext(AuthContext);
  const { handleModal } = useContext(ModalContext);
  // Presentation
  return (
    <Navbar.Collapse>
      {user?._id ? (
        <>
          <Nav className="d-block d-lg-none">
            <Nav.Item>
              <Nav.Link onClick={() => handleModal(<Form.Text />)}>
                + Text
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => handleModal(<Form.Url />)}>
                + URL
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer to={`/profile/${user._id}`}>
                <Nav.Link>{user.email || user.name || "Nameless"}</Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer to={`/uploads/${user._id}`}>
                <Nav.Link>Uploads</Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                variant="dark"
                onClick={() => {
                  logoutHandler();
                  history.replace(`/signin`);
                }}
              >
                Sign out
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </>
      ) : (
        <Nav className="d-block d-lg-none">
          <LinkContainer to={`/signin`}>
            <Nav.Link>Sign in</Nav.Link>
          </LinkContainer>
        </Nav>
      )}
    </Navbar.Collapse>
  );
};

export default NavCollapse;
