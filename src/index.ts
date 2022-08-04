import "reflect-metadata";
import initDBConnection from "./initDBConnection";
import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { buildSchema } from "type-graphql";
import path from "path";

async function init() {

  const port = process.env.PORT || 5000;

  const schema = await buildSchema({
    resolvers: [path.join(__dirname, "./resolvers/**/*.{ts,js}")],
  });

  const appDataSource = await initDBConnection();
  const app = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
    context: async () => ({ appDataSource }),
  });

  app.listen(port, async () => {
    console.log(`The app is ready in port ${port}`);
  });
}

init();
