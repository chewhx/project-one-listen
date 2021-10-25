import React, { useState } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import { Dropdown, Form, Button, ButtonGroup, Card } from "react-bootstrap";
import { ArrowRightCircle } from "react-bootstrap-icons";

const Home = () => {
  const [input, setInput] = useState("");
  const { url, path } = useLocation();

  return (
    <div className="py-5 text-center">
      <h1>Welcome.</h1>
    </div>
  );
};

export default Home;
