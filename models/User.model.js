const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secret = process.env.JWT_SECRET;
const bcrypt = require("bcrypt");

module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        unique: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, "is invalid"],
        index: true,
      },
      password: {
        type: String,
        required: true,
        trim: true,
        required: [true, "can't be blank"],
        minlength: 6,
      },
      dob: {
        type: Date,
        required: true,
      },
      gender: {
        type: String,
        enum: [
          "Female",
          "Male",
          "Trans",
          "Agender",
          "Gender-neutral",
          "Non-binary",
          "Other",
        ],
        required: true,
      },
      interests: {
        type: Array,
        required: true,
      },
      score: {
        type: Number,
        default: 0,
      },
      role: {
        type: String,
        enum: ["User", "Moderator"],
        default: "User",
      },
      isBlocked: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true, versionKey: false }
  );

  schema.methods.setPassword = function (password) {
    this.password = bcrypt.hashSync(password, 12);
  };

  schema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  schema.methods.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
      },
      secret
    );
  };

  schema.methods.verifyJWT = function (token) {
    return jwt.verify(token, secret);
  };

  schema.methods.toAuthJSON = function () {
    return {
      id: this._id,
      email: this.email,
      name: this.name,
      isModerator: this.role === "Moderator",
    };
  };

  schema.methods.generateOTP = function () {
    const otp = crypto.randomInt(100000, 999999);
    this.otp = otp;
    this.otpExpires = Date.now() + 10 * 60 * 1000;
    return otp;
  };

  schema.methods.verifyOTP = function (otp) {
    return otp === this.otp && Date.now() < this.otpExpires;
  };

  const Users = mongoose.model("users", schema);
  return Users;
};
