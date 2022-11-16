import React from 'react';
import { Link } from 'react-router-dom';
import { Toolbar, Typography, Button } from '@material-ui/core';
import HomeIcon from "@material-ui/icons/Home";
import DiscoverIcon from "@material-ui/icons/Search";
import NotificationsIcon from "@material-ui/icons/Notifications";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";

function NavBar(props) {
    const navigate = useNavigate();
    return (
        <div className="navbar">
        <Toolbar className="bar">
            <Button startIcon={<HomeIcon />} size="100%" className="menuItem" onClick={() => { navigate("/home") }}>
                Home
            </Button>
            <Button startIcon={<DiscoverIcon />} size="100%" className="menuItem" onClick={() => { navigate("/discover") }}>
                Discover
            </Button>
            <Button startIcon={<NotificationsIcon />} size="100%" className="menuItem" onClick={() => { navigate("/notifications") }}>
                Notifications
            </Button>
            <Button startIcon={<LogoutIcon />} size="100%" className="menuItem" onClick={() => { window.location.reload(); }}>
                Logout
            </Button>
        </Toolbar>
        </div>
    )
}

export default NavBar
