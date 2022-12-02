import { toast } from "react-toastify";

//Creates a Toast message at the top of the screen which autocloses on given delay
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