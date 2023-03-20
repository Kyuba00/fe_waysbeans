import React, { useState } from "react";
import { Alert, Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { useMutation } from "react-query";

// API
import { API } from "../../configs/api";

export default function Register({ show, setShow, setShowLogin }) {
  // setup state error text
  const [error, setError] = useState("");
  // setup handle close modal
  function handleClose() {
    setShow(false);
    setError("");
  }
  // setup handle switch modal
  function changeModal() {
    handleClose();
    setShowLogin(true);
  }
  // setup form register
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
  });
  // setup form register on change
  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // post form register on submit
  const handleOnSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      const response = await API.post("/register", form);
      console.log("register success : ", response);
      // switch to login
      changeModal();
    } catch (error) {
      // change state error text
      setError("Failed to Register");
      console.log("register failed : ", error);
    }
  });
  return (
    <Modal show={show} onHide={handleClose}>
      <Form className="p-5" onSubmit={(e) => handleOnSubmit.mutate(e)}>
        <h2 className="text-left color-main fw-bold">Register</h2>
        {error !== "" ? (
          <Alert
            variant="danger"
            className="text-center"
            onClose={() => setError("")}
            dismissible
          >
            {error}
          </Alert>
        ) : (
          <></>
        )}
        <Form.Group className="my-3">
          <FloatingLabel label="Email">
            <Form.Control
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleOnChange}
              required
            />
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="mb-3">
          <FloatingLabel label="Password">
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleOnChange}
              required
            />
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="mb-3">
          <FloatingLabel label="Fullname">
            <Form.Control
              type="text"
              placeholder="Fullname"
              name="name"
              onChange={handleOnChange}
              required
            />
          </FloatingLabel>
        </Form.Group>
        <Form.Group>
          <Button className="btn btn-form btn-main col-12" type="submit">
            Register
          </Button>
        </Form.Group>
        <Form.Group>
          <p className="text-center my-3">
            Already have an account ? Click{" "}
            <span className="fw-bold cursor-pointer" onClick={changeModal}>
              Here
            </span>
          </p>
        </Form.Group>
      </Form>
    </Modal>
  );
}
