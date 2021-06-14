import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
// import { useQuery } from "react-query";
import { NavLink, useHistory } from "react-router-dom";
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
    if (status === 200) {
      history.replace(`/`);
    }
  };

  return (
    <>
      <Navbar className="mb-5 sticky-top" bg="light" expand="lg">
        <NavLink className="navbar-brand" to="/">
          <h3>One Listen</h3>
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {user?._id ? (
              <>
                <NavLink className="nav-link" to={`/profile/${user._id}`}>
                  {user.name}
                </NavLink>
                <Nav.Link href="/account">Account</Nav.Link>
                <Button
                  variant="link"
                  className="nav-link"
                  onClick={() => logoutHandler()}
                >
                  Log out
                </Button>
              </>
            ) : (
              <Nav.Link href="/auth/google">Sign in</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default Nav_;
