import React from "react";
import './index.css';

/**
 * This component displays the title of the application together with its logo, usually displayed at the top of the page.
 * @returns The render components of the Header component.
 */
function Header() {
  return (
    <h1>
      Handpicked Media
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40px"
        height="40px"
        viewBox="0 0 20 32"
      >
        <path
          fill="#FFFFFF"
          fillRule="evenodd"
          d="M10.35 0 5.47 2.17l4.95 10.33c-.18-.01-.36-.03-.55-.03-4.51 0-8.52 
            2.92-9.75 7.1l5.17 1.41a4.75 4.75 0 0 1 4.58-3.33 4.68 4.68 0 0 1 4.75 4.58 4.68 4.68 0 0 1-4.75 4.59 4.7 4.7 
            0 0 1-4.63-3.54L0 24.45A10.02 10.02 0 0 0 9.87 32C15.45 32 20 27.62 20 22.23c0-1.73-.56-3.34-1.28-4.78L10.35 0z"
        />
      </svg>
    </h1>
  );
}

export default Header;
