import express from "express";
import * as smtpServer from "smtp-server";
import * as mailparser from "mailparser";
import { MongoClient, Db, Collection } from "mongodb";
const app = express();
const port = 3000;

const MONGODB_CONNECTION_STRING =
  "mongodb+srv://sa:as@cluster0.jnlgbrx.mongodb.net/?retryWrites=true&w=majority";
const DB_NAME = "Mailhog_clone";
const COLLECTION_NAME = "emails";

async function storeEmailInMongoDB(
  db: Db,
  email: mailparser.ParsedMail,
  attachments: mailparser.Attachment[]
): Promise<string> {
  const collection: Collection = db.collection(COLLECTION_NAME);
  const result = await collection.insertOne({ email, attachments });
  return result.insertedId.toString();
}

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
    stream.pipe(process.stdout); // Print the received email data to the console

    const temp = async (): Promise<mailparser.ParsedMail> =>
      await mailparser.simpleParser(stream);

    const data = async () => {
      const email = await temp();
      console.log(email.to);
      const client = await MongoClient.connect(MONGODB_CONNECTION_STRING, {});
      const db = client.db(DB_NAME);
      const attachments = email.attachments || [];
      // Store the email in MongoDB
      const emailId = await storeEmailInMongoDB(db, email, attachments);
    };
    data();

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
