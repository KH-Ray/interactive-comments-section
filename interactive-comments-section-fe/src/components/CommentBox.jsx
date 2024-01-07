import { useState } from "react";
import { Flowbite, Modal } from "flowbite-react";
import { customModalTheme } from "../../flowbiteTheme";
import ReplyBox from "./ReplyBox";
import IconPlus from "../assets/IconPlus";
import IconMinus from "../assets/IconMinus";
import IconReply from "../assets/IconReply";
import IconDelete from "../assets/IconDelete";
import IconEdit from "../assets/IconEdit";
import TextInputBox from "./TextInputBox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postReply } from "../services/comments";

const CommentBox = ({
  currentUser,
  comment,
  handleDelete,
  handleIncreaseScore,
  handleDecreaseScore,
  handleUpdateComment,
}) => {
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [toggleInputTextBox, setToggleInputTextBox] = useState(false);
  const [toggleEditTextBox, setToggleEditTextBox] = useState(false);
  const [editText, setEditText] = useState("");

  const postNewReply = useMutation({
    mutationFn: postReply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const addReply = async (event) => {
    event.preventDefault();
    const textInputBox = event.target;
    const replyValue = textInputBox.querySelector("textarea").value;
    textInputBox.querySelector("textarea").value = "";
    postNewReply.mutate([comment.id, replyValue]);
  };

  return (
    <div>
      <div className="flex items-center justify-center">
        <Flowbite theme={{ theme: customModalTheme }}>
          <Modal
            content="newBase"
            dismissible
            show={openModal}
            position="center"
            onClose={() => setOpenModal(false)}
            size="md"
          >
            <Modal.Body>
              <div className="flex flex-col gap-2 font-rubik">
                <p className="text-2xl font-medium text-dark-blue">
                  Delete comment
                </p>
                <p className="leading-6 text-grayish-blue">
                  Are you sure you want to delete this comment? This will remove
                  the comment and can&apos;t be undone.
                </p>
                <div className="flex gap-2 text-white">
                  <button
                    className="h-12 w-full rounded-lg bg-grayish-blue font-medium uppercase hover:opacity-50"
                    onClick={() => setOpenModal(false)}
                  >
                    no, cancel
                  </button>
                  <button
                    className="h-12 w-full rounded-lg bg-soft-red font-medium uppercase hover:opacity-50"
                    onClick={() => {
                      handleDelete(comment.id);
                      setOpenModal(false);
                    }}
                  >
                    yes, delete
                  </button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </Flowbite>
      </div>

      <div className="mx-2 flex gap-4 rounded-lg bg-white p-4">
        <div className="hidden h-24 w-10 flex-col items-center justify-around rounded bg-light-grayish-blue/25 sm:flex">
          <button onClick={() => handleIncreaseScore(comment)}>
            <IconPlus className="scale-110 fill-light-grayish-blue hover:fill-moderate-blue" />
          </button>
          <span className="font-medium text-moderate-blue">
            {comment.score}
          </span>
          <button onClick={() => handleDecreaseScore(comment)}>
            <IconMinus className="scale-110 fill-light-grayish-blue hover:fill-moderate-blue" />
          </button>
        </div>
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center gap-4">
            <div className="flex-none">
              <img
                src={comment.user.image}
                alt={`${comment.user.username} profile picture`}
                className="h-8 w-8"
              />
            </div>
            <div className="font-medium text-dark-blue">
              {comment.user.username}
            </div>
            {currentUser.username === comment.user.username && (
              <div className="rounded-sm bg-moderate-blue px-1.5 py-0.5 text-sm font-bold text-white">
                you
              </div>
            )}
            <div className="text-grayish-blue">{comment.createdAt}</div>
            {currentUser.username === comment.user.username ? (
              <div className="ml-auto hidden items-center justify-center gap-4 font-medium sm:flex">
                <div
                  className="flex items-center justify-center gap-2 text-soft-red  hover:cursor-pointer hover:opacity-50"
                  onClick={() => setOpenModal(true)}
                >
                  <IconDelete className="fill-soft-red" />
                  Delete
                </div>
                <div
                  className="flex items-center justify-center gap-2 text-moderate-blue  hover:cursor-pointer hover:opacity-50"
                  onClick={() => setToggleEditTextBox(!toggleEditTextBox)}
                >
                  <IconEdit className="fill-moderate-blue" />
                  Edit
                </div>
              </div>
            ) : (
              <div
                className="ml-auto hidden items-center gap-2 font-medium text-moderate-blue hover:cursor-pointer hover:opacity-50 sm:flex"
                onClick={() => setToggleInputTextBox(!toggleInputTextBox)}
              >
                <IconReply className="fill-moderate-blue" />
                Reply
              </div>
            )}
          </div>

          {toggleEditTextBox ? (
            <form
              className="flex w-full flex-col items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateComment(comment, editText);
                setEditText("");
                setToggleEditTextBox(!toggleEditTextBox);
              }}
            >
              <textarea
                onChange={(e) => setEditText(e.target.value)}
                value={editText}
                placeholder="Add a comment..."
                className="h-24 w-full resize-none rounded-lg border-moderate-blue text-dark-blue"
              ></textarea>
              <button className="rounded-lg bg-moderate-blue px-8 py-4 font-medium uppercase tracking-wide text-white hover:opacity-50">
                edit
              </button>
            </form>
          ) : (
            <div className="p-2 leading-6 text-grayish-blue">
              {comment.content}
            </div>
          )}

          <div className="flex sm:hidden">
            <div className="flex h-10 w-24 items-center justify-around rounded bg-light-grayish-blue/25 sm:hidden">
              <button onClick={() => handleIncreaseScore(comment)}>
                <IconPlus className="scale-110 fill-light-grayish-blue hover:fill-moderate-blue" />
              </button>
              <span className="font-medium text-moderate-blue">
                {comment.score}
              </span>
              <button onClick={() => handleDecreaseScore(comment)}>
                <IconMinus className="scale-110 fill-light-grayish-blue hover:fill-moderate-blue" />
              </button>
            </div>

            {currentUser.username === comment.user.username ? (
              <div className="ml-auto flex items-center justify-center gap-4 font-medium sm:hidden">
                <div
                  className="flex items-center justify-center gap-2 text-soft-red  hover:cursor-pointer hover:opacity-50"
                  onClick={() => setOpenModal(true)}
                >
                  <IconDelete className="fill-soft-red" />
                  Delete
                </div>
                <div
                  className="flex items-center justify-center gap-2 text-moderate-blue  hover:cursor-pointer hover:opacity-50"
                  onClick={() => setToggleEditTextBox(!toggleEditTextBox)}
                >
                  <IconEdit className="fill-moderate-blue" />
                  Edit
                </div>
              </div>
            ) : (
              <div
                className="ml-auto flex items-center gap-2 font-medium text-moderate-blue hover:cursor-pointer hover:opacity-50 sm:hidden"
                onClick={() => setToggleInputTextBox(!toggleInputTextBox)}
              >
                <IconReply className="fill-moderate-blue" />
                Reply
              </div>
            )}
          </div>
        </div>
      </div>

      {toggleInputTextBox && (
        <div className="mt-8">
          <TextInputBox
            currentUser={currentUser}
            buttonText="reply"
            handleClick={addReply}
          />
        </div>
      )}

      <div>
        <div className="ml-2.5 space-y-6 border-l-2 border-solid border-gray-300 sm:ml-10">
          {comment.replies.map((reply) => (
            <ReplyBox
              key={reply._id}
              currentUser={currentUser}
              reply={reply}
              comment={comment}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentBox;
