import React, { useState } from "react";
import "../App.css";

const Navbar = () => {
  const [menu, setMenu] = useState(false);

  return (
    <React.StrictMode>
      <div className="grid grid-cols-9 sm:grid-cols-7 items-center place-items-center bg-brsl_ochre p-1">
        <span className="grid grid-cols-2 items-center place-items-start bg-brsl_ochre p-1">
          <button
            onClick={() => setMenu(!menu)}
            className="flex items-center px-2.5"
          >
            <svg
              className="block h-6 w-6"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path
                fill="white"
                stroke="white"
                strokeWidth={0.35}
                d="M10,1.445c-4.726,0-8.555,3.829-8.555,8.555c0,4.725,3.829,8.555,8.555,8.555c4.725,0,8.555-3.83,8.555-8.555C18.555,5.274,14.725,1.445,10,1.445 M10,17.654c-4.221,0-7.654-3.434-7.654-7.654c0-4.221,3.433-7.654,7.654-7.654c4.222,0,7.654,3.433,7.654,7.654C17.654,14.221,14.222,17.654,10,17.654 M14.39,10c0,0.248-0.203,0.45-0.45,0.45H6.06c-0.248,0-0.45-0.203-0.45-0.45s0.203-0.45,0.45-0.45h7.879C14.187,9.55,14.39,9.752,14.39,10 M14.39,12.702c0,0.247-0.203,0.449-0.45,0.449H6.06c-0.248,0-0.45-0.202-0.45-0.449c0-0.248,0.203-0.451,0.45-0.451h7.879C14.187,12.251,14.39,12.454,14.39,12.702 M14.39,7.298c0,0.248-0.203,0.45-0.45,0.45H6.06c-0.248,0-0.45-0.203-0.45-0.45s0.203-0.45,0.45-0.45h7.879C14.187,6.848,14.39,7.051,14.39,7.298"
              />
            </svg>
          </button>

          <a href="/markets" className="flex items-center">
            <button className="flex items-center px-3">
              <svg
                className="block h-7 w-7"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Markets</title>
                <path
                  fill="white"
                  stroke="white"
                  strokeWidth={0.35}
                  d="M18.092,5.137l-3.977-1.466h-0.006c0.084,0.042-0.123-0.08-0.283,0H13.82L10,5.079L6.178,3.671H6.172c0.076,0.038-0.114-0.076-0.285,0H5.884L1.908,5.137c-0.151,0.062-0.25,0.207-0.25,0.369v10.451c0,0.691,0.879,0.244,0.545,0.369l3.829-1.406l3.821,1.406c0.186,0.062,0.385-0.029,0.294,0l3.822-1.406l3.83,1.406c0.26,0.1,0.543-0.08,0.543-0.369V5.506C18.342,5.344,18.242,5.199,18.092,5.137 M5.633,14.221l-3.181,1.15V5.776l3.181-1.15V14.221z M9.602,15.371l-3.173-1.15V4.626l3.173,1.15V15.371z M13.57,14.221l-3.173,1.15V5.776l3.173-1.15V14.221z M17.547,15.371l-3.182-1.15V4.626l3.182,1.15V15.371z"
                />
              </svg>
            </button>
          </a>
        </span>

        <div className="col-span-7 sm:col-span-5">
          <a href="/" className="flex items-center justify-center">
            <h1 className="text-white font-bharatshaala text-4xl">Bharatshaala</h1>
          </a>
        </div>

        <span className="grid grid-cols-2 items-center place-items-end bg-brsl_ochre p-1">
          <a href="/bag" className="flex items-center">
            <button className="flex items-center px-3">
              <svg
                className="block h-7 w-7"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Shopping Bag</title>
                <path
                  fill="white"
                  stroke="white"
                  strokeWidth={0.35}
                  d="M17.638,6.181h-3.844C13.581,4.273,11.963,2.786,10,2.786c-1.962,0-3.581,1.487-3.793,3.395H2.362c-0.233,0-0.424,0.191-0.424,0.424v10.184c0,0.232,0.191,0.424,0.424,0.424h15.276c0.234,0,0.425-0.191,0.425-0.424V6.605C18.062,6.372,17.872,6.181,17.638,6.181 M13.395,9.151c0.234,0,0.425,0.191,0.425,0.424S13.629,10,13.395,10c-0.232,0-0.424-0.191-0.424-0.424S13.162,9.151,13.395,9.151 M10,3.635c1.493,0,2.729,1.109,2.936,2.546H7.064C7.271,4.744,8.506,3.635,10,3.635 M6.605,9.151c0.233,0,0.424,0.191,0.424,0.424S6.838,10,6.605,10c-0.233,0-0.424-0.191-0.424-0.424S6.372,9.151,6.605,9.151 M17.214,16.365H2.786V7.029h3.395v1.347C5.687,8.552,5.332,9.021,5.332,9.575c0,0.703,0.571,1.273,1.273,1.273c0.702,0,1.273-0.57,1.273-1.273c0-0.554-0.354-1.023-0.849-1.199V7.029h5.941v1.347c-0.495,0.176-0.849,0.645-0.849,1.199c0,0.703,0.57,1.273,1.272,1.273s1.273-0.57,1.273-1.273c0-0.554-0.354-1.023-0.849-1.199V7.029h3.395V16.365z"
                />
              </svg>
            </button>
          </a>

          <a href="/login" className="flex items-center">
            <button className="flex items-center px-3">
              <svg
                className="block h-6 w-6"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>My Account</title>
                <path
                  fill="white"
                  stroke="white"
                  strokeWidth={0.5}
                  d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"
                />
              </svg>
            </button>
          </a>
        </span>

        {/* Side Menu */}
        <div
          className={
            menu
              ? "fixed top-0 left-0 w-2/5 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6 h-screen bg-brsl_brick z-50 duration-500"
              : "fixed top-0 -left-full w-2/5 h-screen bg-brsl_ochre z-50 duration-500"
          }
        >
          <button
            onClick={() => setMenu(!menu)}
            className="flex relative left-52 top-3 justify-end"
          >
            <svg
              className="block h-6 w-6"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke="white"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18 18 6m0 12L6 6"
              />
            </svg>
          </button>
          <ul className="mt-5 p-10 text-white text-2xl leading-loose font-body">
            <li className="p-2">
              <a href="/about">About</a>
            </li>
            <li className="p-2">
              <a href="/contact_us">Contact Us</a>
            </li>
            <li className="p-2">
              <a href="/support">Support</a>
            </li>
            <li className="p-2">
              <a href="/faq">FAQ</a>
            </li>
          </ul>
        </div>
      </div>
    </React.StrictMode>
  );
};

export default Navbar;

// <ul className='mt-10 text-2xl leading-loose font-body'>
//     <li className='p-2'><a href='#'>About</a></li>
//     <li className='p-2'><a href='#'>Contact Us</a></li>
//     <li className='p-2'><a href='#'>Support</a></li>
//     <li className='p-2'><a href='#'>FAQ</a></li>
// </ul>
