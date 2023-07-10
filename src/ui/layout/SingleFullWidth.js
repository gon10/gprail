import React from 'react';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';

function SingleFullWidth(props) {

  let headerTitle = props.title? props.title : "Access Register";

  return (
    <div className="wrap">
      <Header title={headerTitle} />
      <div className="main--single-full-width">
        {props.children}
      </div>
      <Footer />
    </div>
  )
};

export default SingleFullWidth;