const TextInputBox = ({ currentUser, buttonText, handleClick }) => {
  return (
    <form
      className="mx-2 flex flex-col gap-2 rounded-lg bg-white p-4 sm:flex-row sm:gap-4"
      onSubmit={handleClick}
    >
      <div className="hidden flex-none sm:block">
        <img
          src={currentUser.image}
          alt={`${currentUser.username} profile picture`}
          className="h-8 w-8"
        />
      </div>

      <div className="w-full">
        <textarea
          placeholder="Add a comment..."
          className="h-24 w-full resize-none rounded-lg border-moderate-blue text-dark-blue"
        ></textarea>
      </div>
      <div className="hidden sm:block ">
        <button className="rounded-lg bg-moderate-blue px-8 py-4 font-medium uppercase tracking-wide text-white hover:opacity-50">
          {buttonText}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="block flex-none sm:hidden">
          <img
            src={currentUser.image}
            alt={`${currentUser.username} profile picture`}
            className="h-8 w-8"
          />
        </div>
        <div className="block sm:hidden ">
          <button className="rounded-lg bg-moderate-blue px-8 py-4 font-medium uppercase tracking-wide text-white hover:opacity-50">
            {buttonText}
          </button>
        </div>
      </div>
    </form>
  );
};

export default TextInputBox;
