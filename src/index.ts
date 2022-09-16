import "reflect-metadata";
import initDBConnection from "./initDBConnection";
import { ApolloServer } from "apollo-server";
import {
  ApolloServerPluginLandingPageLocalDefault,
  AuthenticationError,
} from "apollo-server-core";
import { buildSchema } from "type-graphql";
import path from "path";
import { getUserByToken } from "./authService";
import { v2 as Cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

async function init() {
  const port = process.env.APP_PORT || 5000;

  const schema = await buildSchema({
    resolvers: [path.join(__dirname, "./resolvers/**/*.{ts,js}")],
  });

  const appDataSource = await initDBConnection();
  const app = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
    context: async ({ req, res }) => {
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

  Cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  // const response = Cloudinary.image("sample.jpg", { resource_type: "image" });
  // const response = Cloudinary.source('v1663096697/cld-sample-3.jpg')
  // console.log(response);

  app.listen(port, async () => {
    console.log(`The app is ready in port ${port}`);
  });
}

init();
