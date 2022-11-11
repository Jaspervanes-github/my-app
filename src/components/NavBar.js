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
        background: "#212121"
    },
    menuItem: {
        background: '#666666',
        position: "center",
        color: "#FFFFFF",
        cursor: "pointer",
        flexGrow: 1,
        "&:hover": {
            background: '#262626'
        }
    }
})

function NavBar(props) {
    const classes = styles()
    const navigate = useNavigate();
    return (
        <Toolbar position="sticky" color="rgba(0, 0,0,0.87)" className={classes.bar}>
            <Button startIcon={<HomeIcon />} size="100%" className={classes.menuItem} onClick={() => { navigate("/home") }} style={{
                border: "solid",
                borderWidth: 1,
                borderRadius: 8,
            }}>
                Home
            </Button>
            <Button startIcon={<DiscoverIcon />} size="100%" className={classes.menuItem} onClick={() => { navigate("/discover") }} style={{
                border: "solid",
                borderWidth: 1,
                borderRadius: 8,
            }}>
                Discover
            </Button>
            <Button startIcon={<NotificationsIcon />} size="100%" className={classes.menuItem} onClick={() => { navigate("/notifications") }} style={{
                border: "solid",
                borderWidth: 1,
                borderRadius: 8,
                minWidth: "auto"
            }}>
                Notifications
            </Button>
            <Button startIcon={<LogoutIcon />} size="100%" className={classes.menuItem} onClick={() => { navigate("/"); window.location.reload(); }} style={{
                border: "solid",
                borderWidth: 1,
                borderRadius: 8,
                minWidth: "auto"
            }}>
                Logout
            </Button>
        </Toolbar>
    )
}

export default NavBar
