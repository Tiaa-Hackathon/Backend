const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const db = require("../models/index.js");
const User = db.Users;
const sequelize = db.sequelize;

/**
 * allowed roles: Team Lead, Module Lead, Developer
 */

module.exports = (role) => {
  return async (req, res, next) => {
    try {
      await sequelize.transaction(async (transaction) => {
        const token =
          req.headers.authorization && req.headers.authorization.split(" ")[1];
        if (token) {
          let tokenData;
          try {
            tokenData = jwt.verify(token, process.env.JWT_SECRET);
          } catch (err) {
            return next(createError(401, "Invalid Token"));
          }
          if (tokenData) {
            const user = await User.findOne({
              where: { id: tokenData.id },
              transaction,
            });

            if (user) {
              // check if user.role is present in role array
              if (role.includes(user.role)) {
                req.user = user;
                next();
              } else {
                next(createError(401, "Unauthorized"));
              }
            } else {
              next(createError(401, "Unauthorized"));
            }
          } else {
            next(createError(401, "Unauthorized"));
          }
        } else {
          next(createError(401, "Unauthorized"));
        }
      });
    } catch (err) {
      next(createError(500, "Internal server error"));
      console.log(err);
    }
  };
};

// module.exports = async (req, res, next) => {
//   try {
//     await sequelize.transaction(async (transaction) => {
//       const token =
//         req.headers.authorization && req.headers.authorization.split(" ")[1];
//       if (token) {
//         let tokenData;
//         try {
//           tokenData = jwt.verify(token, process.env.JWT_SECRET);
//         } catch (err) {
//           next(createError(401, "Invalid Token"));
//           return;
//         }
//         if (tokenData) {
//           const user = await User.findOne({
//             where: { id: tokenData.id },
//             transaction,
//           });

//           if (user) {
//             req.user = user;
//             next();
//           } else {
//             next(createError(401, "Unauthorized"));
//           }
//         } else {
//           next(createError(401, "Unauthorized"));
//         }
//       } else {
//         next(createError(401, "Unauthorized"));
//       }
//     });
//   } catch (err) {
//     next(createError(500, "Internal server error"));
//   }
// };
