// Validates /content against the Zod schemas. Runs before every build (see `prebuild`).
import { readFileSync } from "node:fs";
import {
  ContentError,
  type ContentName,
  contentSchemas,
  findTodos,
  parseContent,
  type RawContent,
} from "../src/lib/content-parse.ts";

const names = Object.keys(contentSchemas) as ContentName[];
const raw = {} as RawContent;

for (const name of names) {
  const file = new URL(`../content/${name}.json`, import.meta.url);
  try {
    raw[name] = JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    console.error(`content/${name}.json: ${(error as Error).message}`);
    process.exit(1);
  }
}

try {
  parseContent(raw);
} catch (error) {
  if (error instanceof ContentError) {
    console.error(error.message);
    process.exit(1);
  }
  throw error;
}

console.log(`Content valid (${names.length} files).`);

const todos = names.flatMap((name) => findTodos(raw[name], name));
if (todos.length > 0) {
  console.warn(`\n${todos.length} TODO placeholder(s) left:`);
  for (const todo of todos) console.warn(`  - content/${todo}`);
}
