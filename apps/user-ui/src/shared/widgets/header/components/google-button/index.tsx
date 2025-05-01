import * as React from "react";


const GoogleButton = () => {
    return (
        <div className="w-full flex justify-center">
            <div className="h-[46px] cursor-pointer border border-blue-100 flex items-center gap-2 px-3 rounded my-2 bg-[rgba(210,227,252,0.3)]">
                <svg
                    fill="#000000"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    id="google-circle"
                    data-name="Line Color"
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon line-color"
                >
                    <path
                        id="secondary"
                        d="M12,12h5a5,5,0,1,1-1.46-3.54"
                        style={{
                            fill: "none",
                            stroke: "rgb(44, 169, 188)",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                        }}
                    />
                    <circle
                        id="primary"
                        cx={12}
                        cy={12}
                        r={9}
                        style={{
                            fill: "none",
                            stroke: "rgb(0, 0, 0)",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                        }}
                    />
                </svg>
                <span className="text-[16px] opacity-[.8] font-Poppins">
                    Увійти через Google
                </span>
            </div>
        </div>
    )
};
export default GoogleButton;
