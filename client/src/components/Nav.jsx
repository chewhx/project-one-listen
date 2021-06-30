import React from "react";
import {
  Container,
  Navbar,
  Nav,
  Button,
  NavDropdown,
  Image,
} from "react-bootstrap";
// import { useQuery } from "react-query";
import { NavLink, useHistory } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import axios from "axios";

const Nav_ = () => {
  const history = useHistory();

  const [user, setUser] = React.useState();

  React.useEffect(() => {
    axios
      .get(`/auth/user`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // const { data: user, status } = useQuery("user", getUser, {
  //   keepPreviousData: true,
  //   refetchOnMount: true,
  //   refetchOnWindowFocus: false,
  //   refetchOnReconnect: true,
  // });

  const logoutHandler = async () => {
    const { status } = await axios.get(`/logout`);
    setUser({});
    if (status === 200 || status === 302) {
      history.replace(`/`);
    }
  };

  return (
    <>
      <Navbar className="sticky-top" bg="dark" variant="dark" expand="lg">
        <Container>
          <NavLink className="navbar-brand" to="/">
            <span>One Listen</span>
          </NavLink>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {user?._id ? (
              <>
                <Nav className="d-block d-lg-none">
                  <LinkContainer to={`/profile/${user._id}`}>
                    <Nav.Item>{user.name || "Nameless"}</Nav.Item>
                  </LinkContainer>
                  <Nav.Item>
                    <Nav.Link variant="dark" onClick={() => logoutHandler()}>
                      Sign out
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </>
            ) : (
              <Nav className="d-block d-lg-none">
                <LinkContainer to={`/signin`}>
                  <Nav.Item>
                    <Nav.Link>Sign in</Nav.Link>
                  </Nav.Item>
                </LinkContainer>
              </Nav>
            )}
          </Navbar.Collapse>

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
                  <NavDropdown.Item eventKey="3.1">New text</NavDropdown.Item>
                  <NavDropdown.Item eventKey="3.2">Upload url</NavDropdown.Item>
                  <NavDropdown.Item disabled eventKey="3.3">
                    Upload text file
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  title={
                    <Image
                      fluid
                      style={{ height: "28px" }}
                      src={
                        user.photo ||
                        "https://ui-avatars.com/api/?name=John+Doe"
                      }
                      roundedCircle
                    />
                  }
                  id="nav-user-menu"
                >
                  <LinkContainer to={`/profile/${user._id}`}>
                    <NavDropdown.Item>
                      {user.name || "Nameless"}
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to={`/profile/edit/${user._id}`}>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Button} onClick={() => logoutHandler()}>
                    Sign out
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <Nav.Link href="/signin">Sign in</Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default Nav_;
