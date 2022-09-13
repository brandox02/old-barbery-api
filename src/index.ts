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

async function init() {
  const port = process.env.PORT || 5000;

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
        console.log({ decoded });
        if (!decoded) {
          throw new AuthenticationError("You must be logged");
        }
      }
      return { appDataSource };
    },
  });

  app.listen(port, async () => {
    console.log(`The app is ready in port ${port}`);
  });
}

init();
