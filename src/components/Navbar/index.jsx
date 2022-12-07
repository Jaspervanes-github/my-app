import React from 'react';
import { Toolbar, Typography, Button } from '@material-ui/core';
import HomeIcon from "@material-ui/icons/Home";
import DiscoverIcon from "@material-ui/icons/Search";
import NotificationsIcon from "@material-ui/icons/Notifications";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import { useNavigate } from "react-router-dom";
import "./index.css";

function NavBar(props) {
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
