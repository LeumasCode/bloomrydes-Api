import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * scrambles string data
 * @param {String} token - input string data
 * @returns {String} - scrambled data
 */
const shuffleToken = (token) => token.split("").reverse().join("");

/**
 * Class representing the Authentication methods
 * @class Authentication
 * @description Authentication class methods
 */
class Authentication {
  /**
   * creates a user token
   * @param {object} payload - contains id, role username and hashedPassword
   * @param {integer} expiresIn - Time in seconds
   * @returns {string} - returns a jwt token
   */
  static async getToken(payload, expiresIn = "24h") {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn,
    });
    const scrambledToken = shuffleToken(token);
    return scrambledToken;
  }

  /**
   * verify a token's validity
   * @param {string} token - token input
   * @returns {req} - populate the request with the decrypted content
   */
  static async verifyToken(token) {
    const reshuffledToken = shuffleToken(token);
    let output = {};
    return await jwt.verify(
      reshuffledToken,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {
          output = {
            Error: "Failed to authenticate token",
            success: false,
          };
        } else {
          output = {
            success: true,
            data: decoded,
          };
        }
        return output;
      }
    );
  }
}

export default Authentication;
