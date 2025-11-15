import { defineConfig } from "prisma/config";
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  schema: "../admin-service/prisma/schema.prisma",
  migrations: {
    path: "../admin-service/prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env["MONGO_URI"]!,
  },
});
