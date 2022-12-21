import { toast } from "react-toastify";

/**
 * This function creates a Toast message at the top of the screen which autocloses on given delay.
 * @param {*} text Content of the toast message.
 * @param {*} autoClose The delay on which the toast message closes automatically. 
 * If a value of < 0 is given the toast message needs to be closed manually by clicking on it.
 */
export function createToastMessage(text, autoClose) {
    toast(text, {
        autoClose: autoClose,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
    });
}