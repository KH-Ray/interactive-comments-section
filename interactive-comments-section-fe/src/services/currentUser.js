import axios from "axios";
import baseUrl from "../../baseUrl";

const url = `${baseUrl}/currentUser`;

export const getCurrentUser = () =>
  axios
    .get(url)
    .then((res) => res.data)
    .catch((err) => console.error(err));
