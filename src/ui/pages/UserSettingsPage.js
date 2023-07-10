import React from 'react';
import Input from '../base/Input'
import Button from '../base/Button'

export default function UserSettingsPage(props) {
  document.title = "RailHub Evo - User Settings";

  return (
    <div className="user-settings-page">
      <h2 className="user-settings-page__h2">User settings</h2>

      <div className="user-settings-page__form">
        <Input name="firstName" label="First Name" />
        <Input name="surname" label="Surname" />
        <Input name="email" label="Email" />
        <Input name="phone" label="Phone" />
        <Input name="jobTitle" label="Job Title" />
        <Input name="company" label="Company" />
        <div className="button-group">
          <Button action="tertiary">Cancel</Button>
          <Button action="primary">Update</Button>
        </div>
      </div>
    </div>
  );
}