// Validation
const Joi = require('@hapi/joi');

const registerValidator = data => {
    const schema = Joi.object(
        {
            email: Joi.string().min(6).required().email(),
            password: Joi.string().min(8).max(32).required(),
            phone: Joi.string().required().allow('')
        }
    )
    return schema.validate(data);
}

const loginValidator = data => {
    const schema = Joi.object(
        {
            email: Joi.string().min(6).required().email(),
            password: Joi.string().min(8).max(32).required()
        }
    )
    return schema.validate(data);
}

const emailValidator = data => {
    const schema = Joi.object(
        {
            email: Joi.string().min(6).required().email()
        }
    )
    return schema.validate(data);
}

const addProductValidator = data => {
    const schema = Joi.object(
        {
            name: Joi.string().min(3).required().messages({
                'string.empty': 'Name is not allowed to be empty!',
                'string.min': 'Name should have a minimum length of {#limit}',
                'any.required': 'Name is a required field'
            }),
            price: Joi.number().required().messages({
                'string.empty': 'Price is not allowed to be empty!',
                'any.required': 'Price is a required field'
            }),
            salePrice: Joi.number().required().custom((value, helpers) => {
                                if (value > data.price * 0.8) {
                                    return helpers.message('Promotion must be less than or equal to 80% of price');
                                }
                                return value;
                            }),
            description: Joi.string().min(10).required(),
            category: Joi.string().min(3).required(),
            image: Joi.string().min(3).required()
        }
    )
    return schema.validate(data);
}

const passwordValidator = data => {
    const schema = Joi.object(
        {
            oldPassword: Joi.string().min(8).max(32).required().messages({
                'string.empty': 'Old password is not allowed to be empty!',
                'string.min': 'Old password should have a minimum length of {#limit}',
                'string.max': 'Old password should have a maximum length of {#limit}',
                'any.required': 'Old password is a required field'
            }),
            newPassword: Joi.string().min(8).max(32).required().invalid(Joi.ref('oldPassword')).messages({
                'string.empty': 'New password is not allowed to be empty!',
                'string.min': 'New password should have a minimum length of {#limit}',
                'string.max': 'New password should have a maximum length of {#limit}',
                'any.required': 'New password is a required field',
                'any.invalid': 'New password cannot be the same as the old password'
            }),
        }
    )
    return schema.validate(data);
}

const checkoutValidator = data => {
    const schema = Joi.object(
        {
            shippingMethod: Joi.string().default('standard'),
            shippingFee: Joi.number().default(0),
            paymentMethod: Joi.string().default('cash'),
            status: Joi.string().default('processing'),
            subTotal: Joi.number().required(),
            total: Joi.number().default(0),
            products: Joi.array().min(1).required().messages({
                'array.min': 'You have to choose at least one product to checkout!',
                'any.required': 'You have to choose at least one product to checkout!',
            }),
            idUser: Joi.string().min(3).required(), 
            email: Joi.string().min(6).required().email().messages({
                'string.empty': 'Email is not allowed to be empty!',
                'string.min': 'Email should have a minimum length of {#limit}',
                'any.required': 'Email is a required field',
                'string.email': 'Email must be a valid email'
            }),
            firstName: Joi.string().min(3).required().messages({
                'string.empty': 'First name is not allowed to be empty!',
                'string.min': 'First name should have a minimum length of {#limit}',
                'any.required': 'First name is a required field'
            }),
            lastName: Joi.string().min(3).required().messages({
                'string.empty': 'Last name is not allowed to be empty!',
                'string.min': 'Last name should have a minimum length of {#limit}',
                'any.required': 'Last name is a required field'
            }),
            phone: Joi.string().required().messages({
                'string.empty': 'Phone is not allowed to be empty!',
                'any.required': 'Phone is a required field'
            }),
            address: Joi.string().min(5).required().messages({
                'string.empty': 'Address is not allowed to be empty!',
                'string.min': 'Address should have a minimum length of {#limit}',
                'any.required': 'Address is a required field'
            }),
            addressDetail: Joi.string().min(5).required().messages({
                'string.empty': 'Address detail is not allowed to be empty!',
                'string.min': 'Address detail should have a minimum length of {#limit}',
                'any.required': 'Address detail is a required field'
            })
        }
    )

    return schema.validate(data);
}

const singlePasswordValidator = data => {
    const schema = Joi.object({
        password: Joi.string().min(8).max(32).required().messages({
            'string.empty': 'Old password is not allowed to be empty!',
            'string.min': 'Old password should have a minimum length of {#limit}',
            'string.max': 'Old password should have a maximum length of {#limit}',
            'any.required': 'Old password is a required field'
        }),
    })

    return schema.validate(data);
}

const updateProfileValidator = data => {
    const schema = Joi.object({
        firstName: Joi.string().min(3).required().messages({
            'string.empty': 'First name is not allowed to be empty!',
            'string.min': 'First name should have a minimum length of {#limit}',
            'any.required': 'First name is a required field'
        }),
        lastName: Joi.string().min(3).required().messages({
            'string.empty': 'Last name is not allowed to be empty!',
            'string.min': 'Last name should have a minimum length of {#limit}',
            'any.required': 'Last name is a required field'
        }),
    })

    return schema.validate(data);
}

const adminUserUpdateValidator = data => {
    const schema = Joi.object({
        firstName: Joi.string().min(3).required().messages({
            'string.empty': 'First name is not allowed to be empty!',
            'string.min': 'First name should have a minimum length of {#limit}',
            'any.required': 'First name is a required field'
        }),
        lastName: Joi.string().min(3).required().messages({
            'string.empty': 'Last name is not allowed to be empty!',
            'string.min': 'Last name should have a minimum length of {#limit}',
            'any.required': 'Last name is a required field'
        }),
        email: Joi.string().min(6).required().email().messages({
            'string.empty': 'Email is not allowed to be empty!',
            'string.min': 'Email should have a minimum length of {#limit}',
            'any.required': 'Email is a required field',
            'string.email': 'Email must be a valid email'
        }),
        phone: Joi.string().required().messages({
            'string.empty': 'Phone is not allowed to be empty!',
            'any.required': 'Phone is a required field'
        }),
        role: Joi.string().required().messages({
            'string.empty': 'Role is not allowed to be empty!',
            'any.required': 'Role is a required field'
        }),
        note: Joi.string().allow('')
    })

    return schema.validate(data);
}

const createUserValidator = data => {
    const schema = Joi.object({
        firstName: Joi.string().min(3).allow('').messages({
            'string.empty': 'First name is not allowed to be empty!',
            'string.min': 'First name should have a minimum length of {#limit}'
        }),
        lastName: Joi.string().min(3).allow('').messages({
            'string.empty': 'Last name is not allowed to be empty!',
            'string.min': 'Last name should have a minimum length of {#limit}'
        }),
        email: Joi.string().min(6).required().email().messages({
            'string.empty': 'Email is not allowed to be empty!',
            'string.min': 'Email should have a minimum length of {#limit}',
            'any.required': 'Email is a required field',
            'string.email': 'Email must be a valid email'
        }),
        phone: Joi.string().required().messages({
            'string.empty': 'Phone is not allowed to be empty!',
            'any.required': 'Phone is a required field'
        }),
        password: Joi.string().min(8).max(32).required().messages({
            'string.empty': 'Password is not allowed to be empty!',
            'string.min': 'Password should have a minimum length of {#limit}',
            'string.max': 'Password should have a maximum length of {#limit}',
            'any.required': 'Password is a required field'
        }),
        role: Joi.string().required().messages({
            'string.empty': 'Role is not allowed to be empty!',
            'any.required': 'Role is a required field'
        }),
        note: Joi.string().allow('')
    });

    return schema.validate(data);
}

const createProductValidator = data => {
    const schema = Joi.object({
        background: Joi.allow({}),
        idCategory: Joi.string().required().messages({
            'string.empty': 'Please choose your product\'s category!',
            'any.required': 'Category is a required field'
        }),
        title: Joi.string().min(3).required().messages({
            'string.empty': 'Title is not allowed to be empty!',
            'string.min': 'Title should have a minimum length of {#limit}',
            'any.required': 'Title is a required field'
        }),
        price: Joi.number().required().messages({
            'number.base': 'Price must be a number',
            'any.required': 'Price is a required field'
        }),
        salePrice: Joi.custom((value, helpers) => {
            if (value > (data.price - data.price * 0.8)) {
                return helpers.message('Promotion must be less than or equal to 80% of price');
            }
        }),
        description: Joi.required().messages({
            'string.empty': 'Description is not allowed to be empty!',
            'string.min': 'Description should have a minimum length of {#limit}',
            'any.required': 'Description is a required field'
        }),
        qty: Joi.number().required().messages({
            'number.base': 'Quantity must be a number',
            'any.required': 'Quantity is a required field'
        }),
        thumbnails: Joi.array().min(1).required().messages({
            'array.min': 'You have to choose at least one thumbnail for the product!',
            'any.required': 'You have to choose at least one thumbnail for the product!'
        })
    });

    return schema.validate(data);
}

const resetPasswordValidator = data => {
    const schema = Joi.object({
        password: Joi.string().min(8).max(32).required().messages({
            'string.empty': 'Password is not allowed to be empty!',
            'string.min': 'Password should have a minimum length of {#limit}',
            'string.max': 'Password should have a maximum length of {#limit}',
            'any.required': 'Password is a required field'
        }),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
            'string.empty': 'Confirm password is not allowed to be empty!',
            'any.required': 'Confirm password is a required field',
            'any.only': 'Confirm password must be the same as password'
        })
    });

    return schema.validate(data);
}

module.exports.registerValidator = registerValidator;
module.exports.loginValidator = loginValidator;
module.exports.emailValidator = emailValidator;
module.exports.addProductValidator = addProductValidator;
module.exports.passwordValidator = passwordValidator;
module.exports.checkoutValidator = checkoutValidator;
module.exports.singlePasswordValidator = singlePasswordValidator;
module.exports.updateProfileValidator = updateProfileValidator;
module.exports.adminUserUpdateValidator = adminUserUpdateValidator;
module.exports.createUserValidator = createUserValidator;
module.exports.createProductValidator = createProductValidator;
module.exports.resetPasswordValidator = resetPasswordValidator;