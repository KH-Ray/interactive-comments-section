import axios from "axios";
import baseUrl from "../../baseUrl";

const url = `${baseUrl}/comments`;

export const getAllComments = () =>
  axios
    .get(url)
    .then((res) => res.data)
    .catch((err) => console.error(err));

export const postComment = (content) =>
  axios
    .post(url, content)
    .then((res) => res.data)
    .catch((err) => console.error(err));

export const deleteComment = (commentId) =>
  axios
    .delete(`${url}/${commentId}`)
    .then((res) => res.data)
    .catch((err) => console.error(err));

export const updateComment = (updatedComment) =>
  axios
    .put(`${url}/${updatedComment.id}`, updatedComment)
    .then((res) => res.data)
    .catch((err) => console.error(err));

export const postReply = (content) =>
  axios
    .post(`${url}/${content[0]}/replies`, { content: content[1] })
    .then((res) => res.data)
    .catch((err) => console.error(err));

export const deleteReply = (content) =>
  axios
    .delete(`${url}/${content[0]}/replies/${content[1]}`)
    .then((res) => res.data)
    .catch((err) => console.error(err));

export const updateReply = (content) =>
  axios
    .put(`${url}/${content[0]}/replies/${content[1]}`, content[2])
    .then((res) => res.data)
    .catch((err) => console.error(err));
