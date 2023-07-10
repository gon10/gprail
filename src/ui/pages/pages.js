import React from "react";
import SingleFullWidth from '../layout/SingleFullWidth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTabletAlt, faUsers, faPlusSquare } from '@fortawesome/free-solid-svg-icons'

import {Card, CardDeck } from '../components/Card';

import AppDetailsForm from '../components/forms/AppDetailsForm'

export function Home() {
  return (
    <SingleFullWidth title="Home">
      <CardDeck>
        <Card 
          title="Apps" 
          subtitle="RailApps" 
          icon={<FontAwesomeIcon icon={faTabletAlt} className="card__icon" />} 
          description="Manage your RailHub Applications"
          linkTo="/apps"
          width="3"
        />
        <Card 
          title="Users" 
          subtitle="RailUsers" 
          icon={<FontAwesomeIcon icon={faUsers} className="card__icon" />} 
          description="Manage your Organisation and Users"
          linkTo="/users"
          width="3"
        />
        <Card 
          spacer 
          width="3"
        />
      </CardDeck>
    </SingleFullWidth>
  );
}

export function Apps() {
  return (
    <SingleFullWidth title="Apps">
      <CardDeck>
        <Card 
          title="SATWS Booking" 
          subtitle="RailHub Application" 
          icon={""} 
          description="Book your SATWS device"
          linkTo="/apps/details"
          width="3"
        />
        <Card 
          title="New App" 
          subtitle="Create a new app" 
          icon={<FontAwesomeIcon icon={faPlusSquare} className="card__icon" />} 
          description="Configure a new railway application for your organisation"
          linkTo="/apps/details"
          width="3"
        />
        <Card 
          spacer 
          width="3"
        />
      </CardDeck>
    </SingleFullWidth>
  );
}

export function Users() {
  return (
    <SingleFullWidth title="Users">
      <p>Lorem ipsum</p>
    </SingleFullWidth>
  );
}

export function Help() {
  return (
    <SingleFullWidth title="Help">
      <p>Lorem ipsum</p>
    </SingleFullWidth>
  );
}

export function AppDetails() {
  return (
    <SingleFullWidth title="App Details">
      <AppDetailsForm />
    </SingleFullWidth>
  );
}