import { Request, Response } from "express";
import * as db from "../db";
import { matchedData, check, validationResult } from "express-validator";

import log4js from "log4js";

const log = log4js.getLogger("application");

import {
  validate_title,
  validate_name,
  validate_address,
  validate_id,
} from "./validation_utility/validation_function";
import { Order } from "../db/purchaseOrders";
import { Book1 } from "../db/books";
import { Customer } from "../db/customers";

export const validationData = [
  ...validate_title,
  ...validate_name("author"),
  ...validate_name("name"),
  ...validate_address,
];

export const validate_shipOrder = [...validate_id("pid")];

export const validate_getOrderStatus = [
  ...validate_id("cid"),
  ...validate_id("bid"),
];

export const createOrder = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
  } else {
    try {
      const validatedData = matchedData(req);
      const customer: Customer = {
        name: validatedData.name,
        address: validatedData.address,
      };
      const book1: Book1 = {
        title: validatedData.title,
        author: validatedData.author,
      };
      const bid = await db.getBookId(book1);
      const cid = await db.getCustomerId(customer);
      const order: Order = {
        cid: cid,
        bid: bid,
      };
      await db.createPurchaseOrder(order);
      res.status(201).json({ status: "success" });
    } catch (error) {
      log.error("createOrder: " + error);
      res
        .status(500)
        .json({ error: "an error occured,data might not be available" });
    }
  }
};

export const getShipmentStatus = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
  } else {
    try {
      const validatedData = matchedData(req);
      const customer: Customer = {
        name: validatedData.name,
        address: validatedData.address,
      };
      const book1: Book1 = {
        title: validatedData.title,
        author: validatedData.author,
      };
      const bid = await db.getBookId(book1);
      const cid = await db.getCustomerId(customer);
      const order: Order = {
        cid: cid,
        bid: bid,
      };
      const pid = await db.getPOIdByContents(order);
      const shipped = await db.isPoShipped(pid);
      res.status(200).json({ shipped });
    } catch (error) {
      log.error("shipmentStatus: " + error);
      res
        .status(500)
        .json({ error: "an error occured,data might not be available" });
    }
  }
};

export const shipOrder = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
  } else {
    try {
      const validatedData = matchedData(req);
      const { pid } = validatedData;
      await db.shipPo(pid);
      res.status(200).json({ status: "success" });
    } catch (error) {
      log.error("shipOrder: " + error);
      res
        .status(500)
        .json({ error: "an error occured,data might not be available" });
    }
  }
};

export const getOrderStatus = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
  } else {
    try {
      const validatedData = matchedData(req);
      const { cid, bid } = validatedData;
      const order: Order = {
        cid: cid,
        bid: bid,
      };
      const pid = await db.getPOIdByContents(order);
      const shipped = await db.isPoShipped(pid);
      const addr = await db.getCustomerAddress(cid);
      res.set("Content-Type", "text/html");
      res.status(200);
      res.send(
        Buffer.from(`
            <html>
            <head>
            <title>Order Status</title>
            </head>
            <body>
                <h1>Order Status</h1>
                <p>Order ID: ${pid}</p>
                <p>Book ID: ${bid}</p>
                <p>Customer ID: ${cid}</p>
                <p>Is Shipped: ${shipped}</p>
                <p>Shipping Address: ${addr}</p>
            </body>
            </html>
        `)
      );
    } catch (error) {
      log.error("orderStatus: " + error);
      res
        .status(500)
        .json({ error: "an error occured,data might not be available" });
    }
  }
};
