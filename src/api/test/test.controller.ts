import { Request, Response } from "express";

export function getTest(_req: Request, res: Response) {
    res.json({ foo: "bar" });
}

