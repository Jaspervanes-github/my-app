import React from 'react';
import { Link } from 'react-router-dom';
import { Toolbar, Typography, Button } from '@material-ui/core';
import HomeIcon from "@material-ui/icons/Home";
import DiscoverIcon from "@material-ui/icons/Search";
import NotificationsIcon from "@material-ui/icons/Notifications";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from "react-router-dom";

const styles = makeStyles({
    bar: {
        color: "rgba(0, 0,0,0.87)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start"
    },
    menuItem: {
        background: '#666666',
        position: "center",
        color: "#FFFFFF",
        cursor: "pointer",
        border: "solid",
        borderWidth: 1,
        borderRadius: 8,
        minWidth: "auto",
        flexGrow: 1,
        "&:hover": {
            background: '#262626'
        }
    },
})

function NavBar(props) {
    const classes = styles()
    const navigate = useNavigate();
    return (
        <Toolbar className={classes.bar}>
            <Button startIcon={<HomeIcon />} size="100%" className={classes.menuItem} onClick={() => { navigate("/home") }}>
                Home
            </Button>
            <Button startIcon={<DiscoverIcon />} size="100%" className={classes.menuItem} onClick={() => { navigate("/discover") }}>
                Discover
            </Button>
            <Button startIcon={<NotificationsIcon />} size="100%" className={classes.menuItem} onClick={() => { navigate("/notifications") }}>
                Notifications
            </Button>
            <Button startIcon={<LogoutIcon />} size="100%" className={classes.menuItem} onClick={() => { window.location.reload(); }}>
                Logout
            </Button>
        </Toolbar>
    )
}

export default NavBar
