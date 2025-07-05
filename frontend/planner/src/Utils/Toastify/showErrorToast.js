import {Bounce, toast} from "react-toastify";

export const showErrorToast = (message, theme = "dark") => {
    toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme,
        transition: Bounce,
    });
};