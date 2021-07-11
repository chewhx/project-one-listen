import React from "react";
import { Container, Navbar, Spinner } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useIsFetching } from "react-query";

import NavCollapse from "./NavCollapse";
import NavExpand from "./NavExpand";

const Header = () => {
  // Hooks
  const isFetching = useIsFetching();
  // Presentation
  return (
    <>
      <Navbar
        collapseOnSelect
        className="sticky-top"
        bg="dark"
        variant="dark"
        expand="lg"
      >
        <Container>
          <NavLink className="navbar-brand" to="/">
            <span>One Listen</span>
          </NavLink>

          {isFetching ? (
            <Spinner
              className="ml-auto mr-2"
              animation="border"
              variant="light"
              size="md"
            />
          ) : null}

          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <NavCollapse />

          <NavExpand />
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
