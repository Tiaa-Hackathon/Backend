module.exports = (mongoose) => {
  const Schema = mongoose.Schema;

  const OTPSchema = new Schema(
    {
      email: {
        type: String,
        required: true,
      },
      otp: {
        type: String,
        required: true,
      },
    },
    { timestamps: true, versionKey: false }
  );

  const OTP = mongoose.model("otp", OTPSchema);

  return OTP;
};
