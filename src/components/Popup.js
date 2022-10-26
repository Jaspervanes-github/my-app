import React from 'react';
import "./Popup.css";
import { Button } from "@material-ui/core";


function Popup(props) {
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <Button className="close-btn" variant="contained" onClick={
                    props.setTrigger
                }>
                    Close
                </Button>
                {props.children}
            </div>
        </div>
    ) : ""
}

export default Popup
