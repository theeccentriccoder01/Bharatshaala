import React from "react";
import { useEffect, useState } from "react";
import { Navigate } from 'react-router-dom';
import "../App.css";

const Account = () => {
    // <React.StrictMode>

        const [loggedIn, setLoggedIn] = useState(false);
        const [accountType, setAccountType] = useState("");

        useEffect(() => {
            const checkAuthStatus = async () => {
                try {
                const response = await fetch(`/GetUser`, {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                });
                console.log(response);
                if (!response.ok) {
                    console.log('Failed to check authentication status');
                }
                setLoggedIn(response.loggedIn);
                if (loggedIn) {
                    setAccountType(response.accountType);
                }
                } catch (error) {
                    console.log('Error checking authentication status:', error);
                    
                }
            };

        checkAuthStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

    if (loggedIn === false) {
        return <Navigate to="/login" />;
        }
        if (accountType === "vendor") {
        return <Navigate to="/vendor/Dashboard" />;
        }
        if (accountType === "customer") {
        return <Navigate to="/user/Orders" />;
        }

    return (
        <div>
        </div>
      );
    
};

export default Account;