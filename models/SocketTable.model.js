module.exports = (mongoose) => {
  const Schema = mongoose.Schema;

  const SocketTableSchema = new Schema(
    {
      socket_id: {
        type: String,
        required: true,
      },
      user_email: {
        type: String,
        required: true,
      },
    },
    { timestamps: false, versionKey: false }
  );

  const SocketTable = mongoose.model("socket_table", SocketTableSchema);

  return SocketTable;
};
