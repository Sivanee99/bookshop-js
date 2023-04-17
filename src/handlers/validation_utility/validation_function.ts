import {check} from 'express-validator';

export const validate_name = (attribute:string) =>{
    return[
        check(attribute)
        .trim()
        .not()
        .isEmpty()
        .withMessage(`${attribute} has not been provided`)
        .escape()
        .matches(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)
        .withMessage(`Invalid ${attribute}`)
    ]
}

export const validate_title = [
    check("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Book title has not been provided" )
    .escape()
]

export const validate_price = [
    check("price")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Price has not been provided")
    .escape()
    .isFloat()
    .withMessage("Price is invalid")
    
]

export const validate_id =(attribute:string) =>{
    return[
        check(attribute)
        .trim()
        .not()
        .isEmpty()
        .withMessage(`${attribute} has not been provided`)
        .escape()
        .isInt({min:1})
        .withMessage(`${attribute} is invalid`)
    ]
}

export const validate_address = [
    check("address")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Address not provided")
    .escape()
    .matches(/^(\d{1,}) [a-zA-Z0-9\s]+(\,)? [a-zA-Z]+(\,)? [A-Z]{2} [0-9]{5,6}$/)
    .withMessage("Address is invalid. Address format(eg): 260 North 9th street, Laramie, WY 80222")
]
