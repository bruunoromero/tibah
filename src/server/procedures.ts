import { isAuthed } from "./middlewares/auth";
import { t } from "./trpc";

export const publicProcedure = t.procedure;

export const privateProcedure = t.procedure.use(isAuthed);
