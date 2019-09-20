import React, { useState, useEffect } from "react";
import { withFormik, Field, Form } from "formik";
import * as yup from "yup";
import axios from "axios";

function NewUser({ values, errors, touched, status }) {
  const [users, setUsers] = useState([]);

  function validateTerms(value) {
    let error;
    if (!value) {
      error = "Please accept the terms!";
    }
    return error;
  }

  useEffect(() => {
    if (status) {
      setUsers([...users, status]);
    }
  }, [status]);
  /* ===========RETURN ============== */
  return (
    <div className="user-form">
      <h1>HELLO NEW USER</h1>
      <Form>
        <div className="field">
          <Field
            type="text"
            name="username"
            placeholder="Enter a username you will remember"
          />
          {touched.username && errors.username && (
            <p className="error">{errors.username}</p>
          )}
        </div>
        <div className="field">
          <Field type="email" name="email" placeholder="Enter Your Email" />
          {touched.email && errors.email && (
            <p className="error">{errors.email}</p>
          )}
        </div>

        <div className="field">
          <Field
            type="password"
            name="password"
            placeholder="Enter a passord you will remember"
          />
          {touched.password && errors.password && (
            <p className="error">{errors.password}</p>
          )}
        </div>
        <div className="field">
          <Field
            type="password"
            name="passwordConfirmation"
            placeholder="Re-enter your password"
          />
          {touched.passwordConfirmation && errors.passwordConfirmation && (
            <p className="error">{errors.passwordConfirmation}</p>
          )}
        </div>

        <label htmlFor="terms-checkbox">
          <div className="terms-checkbox-container">
            <span>Check if you agree to the terms of this company</span>
            <Field
              className="checkbox"
              type="checkbox"
              name="terms"
              validate={validateTerms}
              checked={values.terms}
            />
            {touched.terms && errors.terms && (
              <p className="error">{errors.terms}</p>
            )}
          </div>
        </label>
        <button type="submit">Submit</button>
        <div className="response-data"></div>
      </Form>
      {users.map(user => (
        <ul className="user-list" key={user.id}>
          <li>Username:{user.name}</li>
          <li>Email: {user.email}</li>
          <li>Agree {user.terms}</li>
        </ul>
      ))}
    </div>
  );
}
const FormikNewUserForm = withFormik({
  mapPropsToValues({ username, email, password, terms }) {
    return {
      username: username || "",
      email: email || "",
      password: password || "",
      terms: terms || false
    };
  },

  validationSchema: yup.object().shape({
    username: yup
      .string()
      .min(5, "Too Short! Must be at least 5 characters")
      .max(50, "Too Long! Cannot be longer than 50 characters")
      .required("Looks like you forgot the username"),
    email: yup
      .string()
      .email("Whoops ! Looks like that's not a valid email!")
      .required("Whoops, you forgot to enter your email"),
    password: yup
      .string()
      .min(8, "Too Short! Must be at least 8 charachters")
      .max(50, "Too Long! Must be less than 50 characters")
      .required(),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match"),
    terms: yup.boolean().required("Please confirm you agree with our terms")
  }),
  handleSubmit: (values, { setStatus }) => {
    axios
      .post("https://reqres.in/api/users/", values)
      .then(res => {
        setStatus(res.data);
        console.log("res.data: ", res.data);
      })
      .catch(err => console.log(err.res));
    console.log("values: ", values);
  }
})(NewUser);

export default FormikNewUserForm;
