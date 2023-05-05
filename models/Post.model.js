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
        ref: "user",
        required: true,
      },
      comments: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "comment",
        },
      ],
    },
    { timestamps: true, versionKey: false }
  );

  const Post = mongoose.model("posts", PostSchema);

  return Post;
};
