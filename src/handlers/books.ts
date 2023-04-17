import { Request, Response } from 'express';
import * as db from '../db';
import { matchedData,check,validationResult } from 'express-validator';

import { validate_name,validate_title,validate_price } from './validation_utility/validation_function';



export const validate = [
   ...validate_title,
   ...validate_name("author")
]

export const validate_createBook = [
    ...validate,
    ...validate_price
]

export const createBook = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json(errors.array());
    }else{
        const validatedData = matchedData(req)
        const { title, author, price } = validatedData;
        await db.createBook(title, author, price);
        res.status(201).json({ 'status': 'success' });
    }
   
}

export const getPrice = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json(errors.array());
    }else{
        const validatedData = matchedData(req)
        const { title, author } = validatedData;
        const bid = await db.getBookId(title, author);
        const price = await db.getBookPrice(bid);
        res.status(200).json({ price });
    }
}