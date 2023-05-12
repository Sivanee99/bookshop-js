import { Request, Response } from "express";
import * as db from "../db";
import { matchedData, check, validationResult } from "express-validator";

import log4js from "log4js";

const log = log4js.getLogger("application");

import {
  validate_name,
  validate_title,
  validate_price,
  validate_id,
} from "./validation_utility/validation_function";

import { Book, BookID, Book1, BookPrice } from "../db/books";
import { Purchase, checkout, isPoPaid } from "../db/purchaseOrders";
import { PID, isEnoughBalance } from "../db/customers";

export const validate = [...validate_title, ...validate_name("author")];

export const validate_createBook = [...validate, ...validate_price];

export const validatePurchase = [
  ...validate_title,
  ...validate_name("author"),
  ...validate_id("cid"),
  ...validate_id("pid"),
];

export const createBook = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
  } else {
    try {
      const validatedData = matchedData(req);
      const book: Book = {
        title: validatedData.title,
        author: validatedData.author,
        price: validatedData.price,
      };
      await db.createBook(book);
      log.info("Book Created ");
      res.status(201).json({ status: "success" });
    } catch (error) {
      log.error("createBook: " + error);
      res
        .status(500)
        .json({ error: "an error occured,data might not be available" });
    }
  }
};

export const getPrice = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
  } else {
    try {
      const validatedData = matchedData(req);
      const book1: Book1 = {
        title: validatedData.title,
        author: validatedData.author,
      };
      const bid: BookID = await db.getBookId(book1);
      const price: BookPrice = await db.getBookPrice(bid);

      res.status(200).json({ price });
    } catch (error) {
      log.error("GetPrice: " + error);
      res
        .status(500)
        .json({ error: "an error occured,data might not be available" });
    }
  }
};

export const purchase = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
  } else {
    try {
      const validatedData = matchedData(req);
      const book: Book1 = {
        title: validatedData.title,
        author: validatedData.author,
      };
      const bid = await db.getBookId(book);
      const price = await db.getBookPrice(bid);
      const pur: Purchase = {
        price: price,
        cid: validatedData.cid,
        pid: validatedData.pid,
      };
      const pid: PID = validatedData.pid;
      if (await isPoPaid(pid)) {
        res.status(400).json({ error: "Paid already" });
      }
      if (await isEnoughBalance({ price: pur.price, cid: pur.cid })) {
        await checkout(pur);
        log.info("Book purchase successful ");
        res.status(201).json({ status: "success" });
      } else {
        log.error("Book: Balance not enough");
        res.status(402).json({ status: "failed due to insufficient balance" });
      }
    } catch (error) {
      log.error("createBook: " + error);
      res
        .status(500)
        .json({ error: "an error occured,data might not be available" });
    }
  }
};
