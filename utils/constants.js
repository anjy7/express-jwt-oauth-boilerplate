
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const loginType = {
    GOOGLE_LOGIN: 0,
    BASIC_LOGIN: 1,
};

const userRole = {
    MEMBER: 1,
    ADMIN: 2,
    UNVERIFIED: 0,
};

const errorCodes = {
    UNKNOWN_ERROR: 0,
    EXCEPTION: 1,
    INPUT_PARAMS_INVALID: 2,
    INVALID_TOKEN: 3,
    USER_NAME_EXISTS: 4,
    INVALID_USERNAME_OR_PASSWORD: 5,
    INVALID_URL: 6,
};

module.exports = {
    loginType,
    userRole,
    errorCodes
}