import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "flowbite-react";
import { getCurrentUser } from "./services/currentUser";
import {
  getAllComments,
  postComment,
  deleteComment,
  updateComment,
} from "./services/comments";
import CommentBox from "./components/CommentBox";
import TextInputBox from "./components/TextInputBox";

const App = () => {
  const queryClient = useQueryClient();

  const currentUserResult = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const commentsResult = useQuery({
    queryKey: ["comments"],
    queryFn: getAllComments,
  });

  const postNewComment = useMutation({
    mutationFn: postComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const deleteExistingComment = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const replaceComment = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  if (currentUserResult.isLoading || commentsResult.isLoading) {
    return (
      <main className="flex max-h-full min-h-screen items-center justify-center bg-light-grayish-blue/25">
        <Spinner color="purple" size="xl" />
      </main>
    );
  }

  const currentUser = currentUserResult.data[0];
  const comments = commentsResult.data;

  const addComment = async (event) => {
    event.preventDefault();
    const textInputBox = event.target;
    const commentValue = textInputBox.querySelector("textarea").value;
    textInputBox.querySelector("textarea").value = "";
    postNewComment.mutate({ content: commentValue });
  };

  const removeComment = async (commentId) => {
    deleteExistingComment.mutate(commentId);
  };

  const replaceTextComment = async (comment, commentValue) => {
    replaceComment.mutate({ ...comment, content: commentValue });
  };

  const increaseScoreComment = async (comment) => {
    replaceComment.mutate({ ...comment, score: comment.score + 1 });
  };

  const decreaseScoreComment = async (comment) => {
    replaceComment.mutate({ ...comment, score: comment.score - 1 });
  };

  return (
    <main className="max-h-full min-h-screen bg-light-grayish-blue/25 font-rubik">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 py-4 sm:py-12">
        <div className="flex flex-col gap-8">
          {comments.map((comment) => (
            <CommentBox
              key={comment.id}
              currentUser={currentUser}
              comment={comment}
              handleDelete={removeComment}
              handleIncreaseScore={increaseScoreComment}
              handleDecreaseScore={decreaseScoreComment}
              handleUpdateComment={replaceTextComment}
            />
          ))}
        </div>

        <div>
          <TextInputBox
            currentUser={currentUser}
            buttonText="send"
            handleClick={addComment}
          />
        </div>
      </div>
    </main>
  );
};

export default App;
