import React from 'react';
import { faChessRook } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function FourZeroFourPage(props) {
  return (
    <div className="fourzerofour-page">
      <h2 className="fourzerofour-page__h2">Oops! Nothing here.</h2>
      <FontAwesomeIcon icon={faChessRook} className="fourzerofour-page__icon" />
      <p className="fourzerofour-page__p">Looks like our princess is in another castle!</p>
    </div>
  );
}