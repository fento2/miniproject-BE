import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import AuthRouter from "./routers/auth.router";
import AppError from "./errors/AppError";
import { StatusCode } from "./constants/statusCode.enum";
import { ErrorMsg } from "./constants/errorMessage.enum";
import { Prisma } from "../prisma/generated/client";
import { TokenExpiredError } from "jsonwebtoken";
import AccountRouter from "./routers/account.router";
import EventRouter from "./routers/event.router";
import TransactionRouter from "./routers/transaction.router";

const PORT: string = process.env.PORT || "8181";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configure();
    this.route();
    this.errorHandler();
  }

  private configure = (): void => {
    this.app.use(cors());
    this.app.use(express.json());
  };

  private route = (): void => {
    const authrouter: AuthRouter = new AuthRouter();
    const accountRouter: AccountRouter = new AccountRouter();
    const eventRouter: EventRouter = new EventRouter();
    const transaction: TransactionRouter = new TransactionRouter();

    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).send("<h1>Test Tiket Backend</h1>");
    });
    //fendry define path rule start
    this.app.use("/auth", authrouter.getRouter()); //jangan lupa tanda kurung buat jalanin methodnya
    this.app.use("/account", accountRouter.getRouter());
    //end
    //risal define path rule start
    this.app.use("/event", eventRouter.getRouter());
    this.app.use("/transaction", transaction.getRouter());
    //end
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      next(new AppError(ErrorMsg.ROUTE_NOT_FOUND, StatusCode.BAD_REQUEST));
    });
  };

  private errorHandler = (): void => {
    this.app.use(
      (error: unknown, req: Request, res: Response, next: NextFunction) => {
        if (error instanceof AppError) {
          return res.status(error.rc).json({
            result: {
              success: error.success,
              message: error.message,
            },
          });
        }
        //error handle unutk prisam uniqie
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            const target = error.meta?.target as string[];
            const field = target[0];
            return res.status(409).json({
              result: {
                success: false,
                message: `${field} already used`,
              },
            });
          }
        }
        //error handle unutk TokenExiperd
        if (error instanceof TokenExpiredError) {
          return res.status(StatusCode.UNAUTHORIZED).json({
            result: {
              success: false,
              message: ErrorMsg.TOKEN_EXPIRED,
            },
          });
        }
        // error unutk cloudinary upload
        if (
          error instanceof Error &&
          error.name === "Error" &&
          error.message?.toLowerCase().includes("cloudinary")
        ) {
          return res.status(500).json({
            result: {
              success: false,
              message: "Cloudinary upload failed. Please try again later.",
            },
          });
        }

        const message =
          error instanceof Error ? error.message : ErrorMsg.UNKNOWN_ERROR;

        return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          result: {
            success: false,
            message,
          },
        });
      }
    );
  };
  public start = (): void => {
    this.app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  };
}

export default App;
