import "reflect-metadata";
import initDBConnection from "./initDBConnection";
import dotenv from "dotenv";
import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { buildSchema } from "type-graphql";
import path from "path";


async function init() {
  // const app = express();

  const port = process.env.PORT || 5000;

  const schema = await buildSchema({
    resolvers: [path.join(__dirname, "./resolvers/**/*.{ts,js}")],
  });

  const app = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  });

  app.listen(port, async () => {
    dotenv.config();
    initDBConnection();

    console.log(`The app is ready in port ${port}`);
  });
}

init();
