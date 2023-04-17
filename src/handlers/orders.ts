import { Request, Response } from "express";
import * as db from "../db";
import { matchedData,check,validationResult } from 'express-validator';

import { validate_title,validate_name,validate_address,validate_id } from "./validation_utility/validation_function";

export const validationData = [
    ...validate_title,
    ...validate_name("author"),
    ...validate_name("name"),
    ...validate_address
]

export const validate_shipOrder = [
    ...validate_id("pid")
]

export const validate_getOrderStatus = [
    ...validate_id("cid"),
    ...validate_id("pid")
]

export const createOrder = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json(errors.array());
    }else{
        const validatedData = matchedData(req)
        const { title, author, name, address } = req.body;
        const bid = await db.getBookId(title, author);
        const cid = await db.getCustomerId(name, address);
        await db.createPurchaseOrder(bid, cid);
        res.status(201).json({ 'status': 'success' });
    }
}

export const getShipmentStatus = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json(errors.array());
    }else{
        const validatedData = matchedData(req)
        const { title, author, name, address } = validatedData;
        const bid = await db.getBookId(title, author);
        const cid = await db.getCustomerId(name, address);
        const pid = await db.getPOIdByContents(bid, cid);
        const shipped = await db.isPoShipped(pid);
        res.status(200).json({ shipped });
    }
}

export const shipOrder = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json(errors.array());
    }else{
        const validatedData = matchedData(req)
        const { pid } = validatedData;
        await db.shipPo(pid);
        res.status(200).json({ 'status': 'success' });
    }
}

export const getOrderStatus = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json(errors.array());
    }else{
        const validatedData = matchedData(req)
        const { cid, bid } = validatedData;
        const pid = await db.getPOIdByContents(bid, cid);
        const shipped = await db.isPoShipped(pid);
        const addr = await db.getCustomerAddress(cid)
        res.set('Content-Type', 'text/html');
        res.status(200)
        res.send(Buffer.from(`
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
    `));
    }
}