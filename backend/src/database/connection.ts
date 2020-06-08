import knex from "knex";
import "dotenv/config";

export default knex({
  client: "pg",
  connection: {
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    //@ts-ignore
    port: parseInt(process.env.DATABASE_PORT),
  },
});
