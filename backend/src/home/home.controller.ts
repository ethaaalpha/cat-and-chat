import { Controller, Get, Res } from "@nestjs/common";
import * as path from "path";
import { Response } from 'express';
@Controller('*')
export class HomeController {
  handleInvalidRoutes(@Res() res: Response) {
    const errorPagePath = path.join(__dirname, '../../../frontend/src/html/index.html'); // Replace with actual path

    res.sendFile(errorPagePath);
  }
}