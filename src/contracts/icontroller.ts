import { Request, Response } from 'express';

export interface IController {
    handle(req: Request, resp: Response): Promise<void>;
}