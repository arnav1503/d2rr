import { pgTable, text, serial } from 'drizzle-orm/pg-core';
export const calculations = pgTable('calculations', {
  id: serial('id').primaryKey(),
});
