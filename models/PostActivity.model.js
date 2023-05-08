module.exports = (mongoose) => {
  const Schema = mongoose.Schema;

  const PostActivitySchema = new Schema(
    {
      post_id: {
        type: Schema.Types.ObjectId,
        ref: "posts",
        required: true,
      },
      user_id: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      activity_type: {
        type: String,
        enum: ["upvote", "downvote", "comment", "flag"],
        required: true,
      },
    },
    { timestamps: true, versionKey: false }
  );

  const PostActivity = mongoose.model("posts_activities", PostActivitySchema);

  return PostActivity;
};
