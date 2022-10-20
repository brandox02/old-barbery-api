import "reflect-metadata";
import initDBConnection from "./initDBConnection";
// import { ApolloServer } from "apollo-server";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import {
  ApolloServerPluginLandingPageLocalDefault,
  AuthenticationError,
} from "apollo-server-core";
import { buildSchema } from "type-graphql";
import path from "path";
import { getUserByToken } from "./authService";
import { v2 as Cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { delay } from "./utils/delay";
import { privacyPolicyHtmlString } from "./utils/privacy-policy-html-string";

dotenv.config();

Cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function init() {
  const port = process.env.PORT || 5000;

  const schema = await buildSchema({
    resolvers: [path.join(__dirname, "./resolvers/**/*.{ts,js}")],
  });

  const appDataSource = await initDBConnection();
  const app = express();
  app.use(express.json({ limit: "50mb" }));
  app.use(
    express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
  );
  app.get("/", (_, res) => {
    res.send(privacyPolicyHtmlString);
  });

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
    context: async ({ req, res }) => {
      await delay();
      const freeOperationNames = [
        "LogInByCredential",
        "LogInByToken",
        "SignIn",
      ];
      if (!freeOperationNames.includes(req.body.operationName)) {
        const token = req.headers.authorization || "";
        const decoded = getUserByToken(token);

        if (!decoded) {
          throw new AuthenticationError("You must be logged");
        }
      }
      return { appDataSource };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(port, async () => {
    console.log(`The app is ready in port ${port}`);
    console.log("the version running is v3");
  });
}

init();
