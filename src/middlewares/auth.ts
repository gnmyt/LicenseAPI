import { NextFunction, Request, Response } from "express";
import { ISession, Session } from "@models/Session";
import { Account, IAccount } from "@models/Account";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header("authorization");
    if (!authHeader) return res.status(400).json({ message: "You need to provide the 'authorization' header" });

    const headerTrimmed = authHeader.split(" ");
    if (headerTrimmed.length !== 2) return res.status(400).json({ message: "You need to provide the token in the 'authorization' header" });

    req.session = await Session.findOne({ token: headerTrimmed[1] }) as ISession;
    if (req.session === null || !req?.session?.verified) return res.status(401).json({ message: "The provided token is wrong" });

    req.user = await Account.findById(req.session.userId) as IAccount;
    if (req.user === null || !req?.user?.verified) return res.status(401).json({ message: "The account associated to the token is not registered" });

    next();
};