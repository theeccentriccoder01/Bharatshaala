import React from 'react';
import '../App.css';

const Error = () => {
  return (
    <React.StrictMode>
      <div className='bg-brsl_cream h-full min-h-screen'>

        {/* Main text */}
        <br></br>
        <div className='max-w-full mx-auto'>
          <h1 className='flex'></h1>
          <h1 className='flex text-brsl_brick font-bharatshaala text-8xl mt-5 justify-center text-center'>Oops!</h1>
          <p className='flex text-brsl_moss font-body text-2xl mb-5 justify-center text-center'>This part of Bharatshaala has not been completed yet for this release!<br></br>
          Feel free to explore the rest of the website.</p>
        </div>
        <br></br>
      </div>
    </React.StrictMode>
  );
};

export default Error;
