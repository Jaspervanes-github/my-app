import React from 'react'
import { Link } from 'react-router-dom'
import { Toolbar, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';


const styles = makeStyles({
    bar: {
        paddingTop: "1.15rem",
        backgroundColor: "#fff",
        ['@media (max-width:780px)']: {
            flexDirection: "column"
        }
    },
    menuItem: {
        fontFamily: 'Fantasy',
        background: '#3eaabd',
        cursor: "pointer",
        flexGrow: 1,
        "&:hover": {
            background: '#246773'
        },
        ['@media (max-width:780px)']: {
            paddingBottom: "1rem"
        }
    }
})

function NavBar(props) {
    const classes = styles()
    return (
        <Toolbar position="sticky" color="rgba(0, 0,0,0.87)" className={classes.bar}>

            <Typography variant="h6" className={classes.menuItem}>
                <Link to="/home">Home</Link>
            </Typography>
        </Toolbar>
    )
}

export default NavBar
