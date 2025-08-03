import React from "react";
import '../App.css';

var date = new Date();
var currYear = date.getFullYear();

const Footer = () => {
  return (
    <React.StrictMode>
      <div>
        <div className='bg-brsl_mahogany'>
          <h3 className='flex justify-center font-body text-white text-sm py-1'>&copy; {currYear} NextTech Innovations Inc. All Rights Reserved.</h3>
        </div>
      </div>
    </React.StrictMode>
  );
}

export default Footer;