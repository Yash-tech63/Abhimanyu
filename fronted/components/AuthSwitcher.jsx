import React, { useState } from "react";
import UserAuth from "./auth/UserAuth";
import DoctorAuth from "./Doctor";

const AuthSwitcher = ({ onClose }) => {

    const [role, setRole] =
        useState("USER");

    return (
        <>
            {/* ROLE SWITCH */}

            <div className="
                fixed
                top-6
                left-1/2
                z-[10000]
                -translate-x-1/2
                rounded-2xl
                bg-white/10
                p-1
                backdrop-blur-xl
            ">

                <div className="
                    flex
                    rounded-xl
                    bg-white/10
                    p-1
                ">

                    <button
                        onClick={() =>
                            setRole("USER")
                        }
                        className={`
                            rounded-lg
                            px-6
                            py-2.5
                            text-sm
                            font-bold
                            transition
                            ${role === "USER"
                                ? "bg-white text-blue-600"
                                : "text-white"
                            }
                        `}
                    >
                        👤 Patient
                    </button>

                    <button
                        onClick={() =>
                            setRole("DOCTOR")
                        }
                        className={`
                            rounded-lg
                            px-6
                            py-2.5
                            text-sm
                            font-bold
                            transition
                            ${role === "DOCTOR"
                                ? "bg-white text-blue-600"
                                : "text-white"
                            }
                        `}
                    >
                        🩺 Doctor
                    </button>

                </div>

            </div>

            {role === "USER" ? (
                <UserAuth
                    onClose={onClose}
                />
            ) : (
                <DoctorAuth
                    onClose={onClose}
                />
            )}

        </>
    );
};

export default AuthSwitcher;