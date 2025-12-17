import { toast } from "react-toastify";

const options = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  // theme: "dark",
};

export const errorToaster = (message) => {
  toast.error(message || "Something went wrong!", options);
};

export const successToaster = (message) => {
  toast.success(message, options);
};

export const warningToaster = (message) => {
  toast.warning(message, options);
};