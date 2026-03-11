import { cpSync } from "node:fs";

cpSync("src/css", "dist/css", { recursive: true });
