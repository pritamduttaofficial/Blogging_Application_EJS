const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    secret: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: "/images/user.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return;
  }
  const secret = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", secret)
    .update(user.password)
    .digest("hex");

  this.secret = secret;
  this.password = hashedPassword;

  next();
});

userSchema.static("matchPassword", async function (loginEmail, loginPassword) {
  const user = await this.findOne({ email: loginEmail });
  if (!user) {
    throw new Error("User Not Found");
  }
  const secret = user.secret;
  const hashedPassword = user.password; // "0daa817f042b2f5213b162f90ef3f604f6107e2c"

  const userProvidedPasswordHash = createHmac("sha256", secret)
    .update(loginPassword)
    .digest("hex");

  if (hashedPassword !== userProvidedPasswordHash) {
    throw new Error("Incorrect Password");
  }
  return user;
});

const User = model("User", userSchema);

module.exports = User;

/*
    `pre` middleware explained :-------->
        1. Middleware Attachment: This code attaches a `pre-save` middleware function to the `userSchema`, which will be executed before saving a user document to the database.

        2. Function Declaration: It declares a function to be executed before saving. This function takes the "next" function as a parameter, which is a callback function used to move to the next middleware in the chain.

        3. Accessing User Object: Inside the function, it references the `current user document` (referred to as `this`) being saved.

        4. Password Modification Check: It checks whether the password field of the user document has been modified. If not modified, it returns early without performing any further actions. This is to avoid re-hashing the password unnecessarily.

        5. Generating a Secret: If the password is modified, it generates a random 16-byte secret using the randomBytes function.

        6. Hashing Password: It then creates a `hash` of the user's password using the `SHA-256` hashing algorithm along with the generated `secret`. It uses the `createHmac` function to create a `hash-based message authentication code` (HMAC) with SHA-256, then `updates` the code with the `user's password` and obtains the hashed result in `hexadecimal format`.

        7. Updating Document Fields: It updates the user document fields before saving. It sets the "secret" field of the user document to the generated secret and replaces the "password" field with the hashed password.

        8. Execution Continuation: Finally, it calls the "next" function to proceed with saving the user document. This ensures that the middleware chain continues and the user document is saved with the modified fields.


    Schema `static` method explained :---------->

        1. Schema Static Method: This code defines a static method named `matchPassword` on the `userSchema`. Static methods are functions that are associated with the model itself rather than individual instances of the model. They can be called directly on the model.

        2. Asynchronous Execution: This static method is declared as an asynchronous function using the `async` keyword, indicating that it performs asynchronous operations. This allows for non-blocking execution, which is common when interacting with databases or performing I/O operations.

        3. Finding User by Email: The method uses `await this.findOne({ email: loginEmail })` to asynchronously search for a `user` document in the database based on the provided `login email`. It awaits the result of the database query before proceeding further.

        4. Error Handling - User Not Found: If no user is found with the provided email, it throws an error using `throw new Error("User Not Found")`. Throwing an error stops further execution of the method and indicates that the user with the provided email does not exist in the database.

        5. Retrieving Secret and Hashed Password: If a `user` document is found, it retrieves the `secret` and `hashed password` from the user document. These values are necessary for verifying the `provided password` during authentication.

        6. Hashing User Provided Password: It hashes the provided `login password` using the same `secret` retrieved from the user document. It uses the `createHmac` function to create a hash-based message authentication code (HMAC) using the `SHA-256` algorithm. This ensures that the password is hashed using the same method and secret as the stored password for comparison.

        7. Password Comparison: It compares the hashed password stored in the database with the hashed password derived from the user-provided password. If they do not match, it throws an error using `throw new Error("Incorrect Password")`. This indicates that the provided password is incorrect.

        8. Successful Authentication: If the provided password matches the stored hashed password, it returns the user document using `return user`;. This indicates successful authentication.
*/
