const createError = require("http-errors");
const isValidEmail = require("../validators/email.js");
const { sendResetPassword } = require("../config/nodemailer.js");
const db = require("../models/index.js");
const User = db.users;
const OTP = db.otp;
const mongoose = db.mongoose;

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, dob, gender, interests } =
      req.body;
    const user = await User.findOne({ email });

    if (!user) {
      if (password === confirmPassword) {
        const userData = {};
        userData.name = name;
        userData.email = email;
        userData.password = password;

        if (dob) userData.dob = new Date(dob);
        if (gender) userData.gender = gender;
        if (interests) {
          const temp = [];
          for (let interest of interests) {
            interest = interest.toLowerCase();
            temp.push(interest);
          }
          userData.interests = temp;
        }

        const newUser = new User(userData);

        newUser.setPassword(password);

        const savedUser = await newUser.save();

        res.status(201).json({
          success: true,
          message: "User created successfully",
          data: {
            user: savedUser.toAuthJSON(),
          },
        });
      } else {
        next(createError(400, "Passwords don't match"));
      }
    } else {
      next(createError(409, "User already exists"));
    }
  } catch (err) {
    next(createError(500, err));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      if (user.validPassword(password)) {
        const token = user.generateJWT();

        res.status(200).send({
          success: true,
          message: "User logged in successfully",
          data: {
            user: user.toAuthJSON(),
            token,
          },
        });
      } else {
        next(createError(401, "Invalid credentials"));
      }
    } else {
      next(createError(401, "User not found"));
    }
  } catch (err) {
    next(createError(500, err));
  }
};

exports.sendResetPasswordMail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (email && isValidEmail(email)) {
      const session = await mongoose.startSession();
      await session.withTransaction(async () => {
        const user = await User.findOne({ email }, null, { session });

        if (user) {
          const otp = user.generateOTP();

          const otpData = await OTP.findOne({ email }, null, { session });

          if (otpData) {
            await otpData.updateOne({ otp }, { session });
          } else {
            const newOTP = new OTP({
              email,
              otp,
            });

            await newOTP.save({ session });
          }

          await sendResetPassword(email, otp);

          res.status(200).json({
            success: true,
            message: "Reset password mail sent successfully",
          });
        } else {
          next(createError(404, "User not found"));
        }
      });
    } else {
      next(createError(400, "Invalid email"));
    }
  } catch (err) {
    next(createError(500, err));
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const { email, otp, password, confirmPassword } = req.body;
      if (email && isValidEmail(email)) {
        if (password === confirmPassword) {
          if (otp) {
            const otpData = await OTP.findOne({ email, otp }, null, {
              session,
            });

            if (otpData) {
              const otpTime = new Date(otpData.updatedAt).getTime();
              const currentTime = new Date().getTime();
              const otpValidity = 60000; // 1 minute in milliseconds

              if (currentTime - otpTime <= otpValidity) {
                const user = await User.findOne({ email }, null, { session });

                if (user) {
                  user.setPassword(password);
                  await user.save({ session });

                  await otpData.deleteOne({ session });

                  res.send({
                    success: true,
                    message: "Password reset successfully",
                  });
                } else {
                  next(createError(404, "User not found"));
                }
              } else {
                next(createError(400, "OTP expired"));
              }
            } else {
              next(createError(400, "Invalid OTP"));
            }
          } else {
            next(createError(400, "OTP is required"));
          }
        } else {
          next(createError(400, "Passwords don't match"));
        }
      } else {
        next(createError(400, "Invalid email"));
      }
    });
  } catch (err) {
    next(createError(500, err));
  }
};
