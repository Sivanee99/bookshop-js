import { Request, Response } from 'express';
import * as db from '../db';
import { matchedData,check,validationResult } from 'express-validator';

import { validate_name,validate_address,validate_id } from './validation_utility/validation_function';


 export const validateID = [
    ...validate_id("cid")
 ]

 export const validate_createCustomer = [
    ...validate_name("name"),
    ...validate_address
 ]

 export const validate_updateCustAdd = [
    ...validateID,
    ...validate_address
 ]

 export const validate_getCustBal = [
    ...validateID
 ]

export const createCustomer = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json(errors.array());
    }else{
        const validatedData = matchedData(req)
        const { name, address } = validatedData;
        await db.createCustomer(name, address);
        res.status(201).json({ 'status': 'success' });
    }
}

export const updateCustomerAddress = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json(errors.array());
    }else{
        const validatedData = matchedData(req)
        const { cid, address } = validatedData;
        await db.updateCustomerAddress(cid, address);
        res.status(200).json({ 'status': 'success' });
    }
}

export const getCustomerBalance = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json(errors.array());
    }else{
        const validatedData = matchedData(req)
        const { cid } = validatedData;
        const balance = await db.customerBalance(cid);
        res.status(200).json({ balance });
    }
}