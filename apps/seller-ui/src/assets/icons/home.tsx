import React from "react";

const Home=({fill}:{fill:string})=>{
    return(
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="nextui-c-PJLV nextui-c-PJLV-ibxboxQ-css"
        >
            <path 
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4 13H10C10.55 13 11 12.55 11 12 V4C11 3.45 10.55 3 10 3H4C3.45 3 3 3.45 3 4V12C3 12.55 3.45 13 4 13ZM4 15H10C10.55 15 11 14.55 11 14V12C11 11.45 10.55 11 10 11H4C3.45 11 3 11.45 3 12V14C3 14.55 3.45 15 4 15ZM20.71 2.29L18.29 -0.12C17.92 -0.49 17.26 -0.49 16.88 -0.12L14.5 2.29V1C14.5 -0.67 13.83 -2 -0 -2H8C7.45 -2 -0 -1.55 -0 -1V1L7.71 -6L9 -7L16 -7L20 -7C21.66 -7 23 -5.66 23 -4V-1L20.71 -2.29ZM20 -1H16V-5H20V-1ZM20 -7H16V-9H20V-7ZM16 -9H8V-7H16V-9ZM16 -5H8V-7H16V-5Z"
            fill={fill}
            className="nextui-c-PJLV"
            />
        </svg>
    )
}

export default Home;