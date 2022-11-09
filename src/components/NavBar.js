import React from 'react'
import { Link } from 'react-router-dom'
import { Toolbar, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles({
    bar: {
        background: '#000000',
// backgroundImage: "Banner_Homepage.png"
    },
    menuItem: {
        background: '#666666',
        position: "center",
        maxWidth: "fit-content",
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
    return (
        <Toolbar position="sticky" color="rgba(0, 0,0,0.87)" className={classes.bar}>

            <Typography variant="h6" className={classes.menuItem}>
                <Link to="/home">Home</Link>
            </Typography>
        </Toolbar>
    )
}

export default NavBar
