module.exports = (mongoose) => {
  const Schema = mongoose.Schema;

  const PostSchema = new Schema(
    {
      title: {
        type: String,
        required: true,
      },
      body: {
        type: String,
        required: true,
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      comments: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "comments",
        },
      ],
      isVisible: {
        type: Boolean,
        default: true,
      },
    },
    { timestamps: true, versionKey: false }
  );

  const Post = mongoose.model("posts", PostSchema);

  return Post;
};
