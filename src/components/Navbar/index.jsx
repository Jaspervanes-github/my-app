import { Button, Toolbar } from '@material-ui/core';
import LogoutIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import NotificationsIcon from "@material-ui/icons/Notifications";
import DiscoverIcon from "@material-ui/icons/Search";
import React from 'react';
import { useNavigate } from "react-router-dom";
import "./index.css";

/**
 * This component displays a list of buttons. These buttons navigates the user to different pages of the application.
 * @returns The render components of the NavBar component.
 */
function NavBar() {
    const navigate = useNavigate();
    return (
        <div className="navbar">
            <Toolbar className="bar">
                <Button startIcon={<HomeIcon />} size="large" className="menuButton" onClick={() => { navigate("/") }}>
                    Home
                </Button>
                <Button startIcon={<DiscoverIcon />} size="large" disabled className="menuButton" onClick={() => { navigate("/discover") }}>
                    Discover
                </Button>
                <Button startIcon={<NotificationsIcon />} size="large" disabled className="menuButton" onClick={() => { navigate("/notifications") }}>
                    Notifications
                </Button>
                <Button startIcon={<LogoutIcon />} size="large" className="menuButton" onClick={() => { window.location.reload(); }}>
                    Logout
                </Button>
            </Toolbar>
        </div >
    )
}

export default NavBar
