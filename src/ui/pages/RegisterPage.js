import React, { useState } from 'react'
import Input from '../base/Input'
import Button from '../base/Button'

export default function RegisterPage(props) {

  const initialVals = {
    firstName : "",
    surname : "",
    email : "",
    phone : "",
    companyName : "",
  };

  const [values, setValues] = useState(initialVals);

  function handleInputChange(e) {
    setValues(values => ({ ...values, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(values);
  }

  function handleReset(e) {
    e.preventDefault();
    setValues({...initialVals});
  }


  return (
    <div className="register-page">
      <div className="register-page__welcome">
        <h1 className="register-page__welcome__title">Register on RailHub</h1>
        <p className="register-page__welcome__p">Please enter your details to register and create a new account on RailHub.
        By entering your details you are agreeing to Ontrac Ltd Terms of Service, Privacy Policy, and Acceptable Behaviour policies.</p>
      </div>
      <div className="register-form__wrap">
        <form className="form register-form">
          <section className="form__section register-form__section register-form__header">
            <h2>Sign up for RailHub</h2>
            <p>Access approved rail safety applications and more on RailHub.</p>
          </section>
          <section className="form__section register-form__section">
            <Input name="firstName" label="First Name" value={values.firstName} onChange={handleInputChange} />
            <Input name="surname" label="Surname" value={values.surname} onChange={handleInputChange} />
            <Input name="email" label="Email" value={values.email} onChange={handleInputChange} />
            <Input name="phone" label="Phone" value={values.phone} onChange={handleInputChange} />
            <Input name="companyName" label="Company" value={values.companyName} onChange={handleInputChange} />
          </section>
          <section className="button-group">
            <Button action="secondary" label="Cancel" onClick={(e) =>handleReset(e)} />
            <Button action="primary" label="Register" onClick={(e) => handleSubmit(e)}/>
          </section>
        </form>
      </div>
    </div>
  );
}