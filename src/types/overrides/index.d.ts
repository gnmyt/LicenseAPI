import { IAccount } from "@models/Account";
import { ISession } from "@models/Session";

declare global {
    namespace Express {
        interface Request {
            session?: ISession,
            user?: IAccount
        }
    }
}