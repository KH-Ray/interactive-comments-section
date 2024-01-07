import { useState } from "react";
import { Flowbite, Modal } from "flowbite-react";
import { customModalTheme } from "../../flowbiteTheme";
import IconPlus from "../assets/IconPlus";
import IconMinus from "../assets/IconMinus";
import IconDelete from "../assets/IconDelete";
import IconEdit from "../assets/IconEdit";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReply, updateReply } from "../services/comments";

const ReplyBox = ({ currentUser, reply, comment }) => {
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [toggleEditBox, setToggleEditBox] = useState(false);
  const [editText, setEditText] = useState("");

  const removeReply = useMutation({
    mutationFn: deleteReply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const replaceReply = useMutation({
    mutationFn: updateReply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const removeExistingReply = async () => {
    removeReply.mutate([comment.id, reply._id]);
  };

  const replaceReplyText = async () => {
    replaceReply.mutate([comment.id, reply._id, { content: editText }]);
  };

  const increaseScoreReply = async () => {
    replaceReply.mutate([comment.id, reply._id, { score: reply.score + 1 }]);
  };

  const decreaseScoreReply = async () => {
    replaceReply.mutate([comment.id, reply._id, { score: reply.score - 1 }]);
  };

  return (
    <div className="mx-2 ml-2.5 mt-8 flex gap-4 rounded-lg bg-white p-4 sm:ml-10">
      <div>
        <Flowbite theme={{ theme: customModalTheme }}>
          <Modal
            dismissible
            show={openModal}
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
                    onClick={removeExistingReply}
                  >
                    yes, delete
                  </button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </Flowbite>
      </div>

      <div className="hidden h-24 w-10 flex-col items-center justify-around rounded bg-light-grayish-blue/25 sm:flex">
        <button onClick={increaseScoreReply}>
          <IconPlus className="scale-110 fill-light-grayish-blue hover:fill-moderate-blue" />
        </button>
        <span className="font-medium text-moderate-blue">{reply.score}</span>
        <button onClick={decreaseScoreReply}>
          <IconMinus className="scale-110 fill-light-grayish-blue hover:fill-moderate-blue" />
        </button>
      </div>
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center gap-4">
          <div className="flex-none">
            <img
              src={reply.user.image}
              alt={`${reply.user.username} profile picture`}
              className="h-8 w-8"
            />
          </div>
          <div className="font-medium text-dark-blue">
            {reply.user.username}
          </div>
          {currentUser.username === reply.user.username && (
            <div className="rounded-sm bg-moderate-blue px-1.5 py-0.5 text-sm font-bold text-white">
              you
            </div>
          )}
          <div className="text-grayish-blue">{reply.createdAt}</div>
          {currentUser.username === reply.user.username && (
            <div className="ml-auto hidden items-center justify-center gap-4 font-medium sm:flex">
              <div
                className="flex items-center justify-center gap-2 text-soft-red hover:cursor-pointer hover:opacity-50"
                onClick={() => setOpenModal(true)}
              >
                <IconDelete className="fill-soft-red" />
                Delete
              </div>
              <div
                className="flex items-center justify-center gap-2 text-moderate-blue hover:cursor-pointer hover:opacity-50"
                onClick={() => setToggleEditBox(!toggleEditBox)}
              >
                <IconEdit className="fill-moderate-blue" />
                Edit
              </div>
            </div>
          )}
        </div>

        {toggleEditBox ? (
          <form
            className="flex w-full flex-col items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              replaceReplyText();
              setEditText("");
              setToggleEditBox(!toggleEditBox);
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
            <span className="font-medium text-moderate-blue">
              @{reply.replyingTo}
            </span>{" "}
            {reply.content}
          </div>
        )}

        <div className="flex sm:hidden">
          <div className="flex h-10 w-24 items-center justify-around rounded bg-light-grayish-blue/25 sm:hidden">
            <button onClick={increaseScoreReply}>
              <IconPlus className="scale-110 fill-light-grayish-blue hover:fill-moderate-blue" />
            </button>
            <span className="font-medium text-moderate-blue">
              {reply.score}
            </span>
            <button onClick={decreaseScoreReply}>
              <IconMinus className="scale-110 fill-light-grayish-blue hover:fill-moderate-blue" />
            </button>
          </div>

          {currentUser.username === reply.user.username && (
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
                onClick={() => setToggleEditBox(!toggleEditBox)}
              >
                <IconEdit className="fill-moderate-blue" />
                Edit
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReplyBox;
