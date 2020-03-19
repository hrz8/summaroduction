import React from 'react';
import { withRouter } from 'react-router-dom';

const Footer = () =>  (
  <footer className="page-footer text-center text-md-left bg-secondary">
    <div className="footer-copyright py-3 text-center">
      <div className="container-fluid">
        © 2020 Copyright <a href="/#">&nbsp;HIAMS - IB</a>
      </div>
    </div>
  </footer>
)

export default withRouter(Footer);
