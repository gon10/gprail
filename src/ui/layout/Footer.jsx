import React from "react"

export default function Footer(props) {
  const d = new Date();
  const year = d.getFullYear();

    return (
      <footer className="footer">
          <p className="footer__p">&copy; OnTrac Ltd. &amp; Network Rail. {year}</p>
          <p className="footer__p"><a className="footer__a" href="mailto:enquiries@on-trac.co.uk">enquiries@on-trac.co.uk</a></p>
      </footer>
    )
}
