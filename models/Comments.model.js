module.exports = (mongoose) => {
  const Schema = mongoose.Schema;
  const CommentSchema = new Schema(
    {
      text: {
        type: String,
        required: true,
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      replies: [
        {
          text: {
            type: String,
            required: true,
          },
          author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
          },
        },
      ],
    },
    { timestamps: true, versionKey: false }
  );

  const Comment = mongoose.model("comments", CommentSchema);
  return Comment;
};
