import { Request, Response } from "express";
import * as db from "../db";
import { matchedData, check, validationResult } from "express-validator";

import {
  validate_name,
  validate_address,
  validate_id,
} from "./validation_utility/validation_function";
import { Customer, updateCustomer } from "../db/customers";

import log4js from "log4js";

const log = log4js.getLogger("application");

export const validateID = [...validate_id("cid")];

export const validate_createCustomer = [
  ...validate_name("name"),
  ...validate_address,
];

export const validate_updateCustAdd = [...validateID, ...validate_address];

export const validate_getCustBal = [...validateID];

export const createCustomer = async (req: Request, res: Response) => {
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
      await db.createCustomer(customer);
      res.status(201).json({ status: "success" });
    } catch (error) {
      log.error("createCustomer: " + error);
      res
        .status(500)
        .json({ error: "an error occured,data might not be available" });
    }
  }
};

export const updateCustomerAddress = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
  } else {
    try {
      const validatedData = matchedData(req);
      const updateCust: updateCustomer = {
        cid: validatedData.cid,
        address: validatedData.address,
      };
      await db.updateCustomerAddress(updateCust);
      res.status(200).json({ status: "success" });
    } catch (error) {
      log.error("updateCustomerAddress: " + error);
      res
        .status(500)
        .json({ error: "an error occured,data might not be available" });
    }
  }
};

export const getCustomerBalance = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
  } else {
    try {
      const validatedData = matchedData(req);
      const { cid } = validatedData;
      const balance = await db.customerBalance(cid);
      res.status(200).json({ balance });
    } catch (error) {
      log.error("CustomerBalance: " + error);
      res
        .status(500)
        .json({ error: "an error occured,data might not be available" });
    }
  }
};
