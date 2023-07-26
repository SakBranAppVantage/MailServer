import express from "express";
import * as smtpServer from "smtp-server";

const app = express();
const port = 3000;

const server = new smtpServer.SMTPServer({
  authOptional: true,
  onAuth(auth, session, callback) {
    if (auth.username !== "admin" || auth.password !== "password") {
      return callback(new Error("Invalid username or password"));
    }
    console.log(auth);
    callback(null, { user: 123 }); // where 123 is the user id or similar property
  },
  onData(stream, session, callback) {
    console.log(stream);
    stream.pipe(process.stdout); // Print the received email data to the console
    stream.on("end", callback);
  },
});

server.on("error", (err) => {
  console.error("Error occurred:", err);
});

server.listen(25, "127.0.0.1", () => {
  console.log("SMTP server is running on port 25");
});

// app.get("/", (req, res) => {
//   res.send("Hello, Express with TypeScript! Got to sleep now.Ok");
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
