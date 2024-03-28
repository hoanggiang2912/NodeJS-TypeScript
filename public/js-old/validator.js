import { getData } from '/dist/assets/main.js';


export function Validator (options, callback = async () => {}) {
    const formElement = document.querySelector(options.formSelector)
    let selectorRules = {}

    function getParentElement (inputElement , parentSelector) {
        while(inputElement.parentElement) {
            if (inputElement.parentElement.matches(parentSelector)) {
                return inputElement.parentElement
            } else {
                inputElement = inputElement.parentElement
            }
        }
    }
    if(formElement) {
        formElement.onsubmit = async function (e) {
            e.preventDefault();
            
            let isValid = true;
            options.rules.forEach((rule) => {
                const inputElements = formElement.querySelectorAll(rule.selector);

                inputElements.forEach(function (inputElement) {
                    validate(inputElement, rule);

                    const formGroup = getParentElement(inputElement, options.formGroupSelector);
                    if (formGroup.classList.contains('invalid')) {
                        isValid = false;
                    }
                });
            });
            if (isValid) {
                await callback();
                if (options.redirectUrl) {
                    window.location.href = await options.redirectUrl;
                }
            }
        };

        // function serializeFormData(formElement) {
        //     const formData = new FormData(formElement);
        //     const serializedData = {};

        //     for (let [name, value] of formData.entries()) {
        //         serializedData[name] = value;
        //     }

        //     return serializedData;
        // }

        async function validate(inputElement, rule) {
            const rules = selectorRules[rule.selector];
            let errorMessage = '';

            for (let i = 0; i < rules.length; i++) {
                const ruleFunction = rules[i];

                if (typeof ruleFunction === 'function') {
                    errorMessage = ruleFunction(inputElement.value);
                } else if (typeof ruleFunction === 'object' && ruleFunction instanceof Promise) {
                    try {
                        errorMessage = await ruleFunction; // Wait for the promise to resolve
                    } catch (error) {
                        console.error('An error occurred during validation:', error);
                        throw new Error('Có lỗi xảy ra trong quá trình kiểm tra!');
                    }
                }

                // Break the loop if an error message is found
                if (errorMessage) {
                    break;
                }
            }

            if (errorMessage instanceof Promise) {
                errorMessage.then((resolvedMessage) => {
                    if (resolvedMessage) {
                        const formGroup = getParentElement(inputElement, options.formGroupSelector);
                        formGroup.querySelector(options.formMessage).innerText = resolvedMessage;
                        formGroup.classList.add('invalid');
                    } else {
                        oninputHandler(inputElement);
                    }
                });
            } else {
                if (errorMessage) {
                    const formGroup = getParentElement(inputElement, options.formGroupSelector);
                    formGroup.querySelector(options.formMessage).innerText = errorMessage;
                    formGroup.classList.add('invalid');
                } else {
                    oninputHandler(inputElement);
                }
            }
        }
        
        // async function validate(inputElement, rule) {
        //     const rules = selectorRules[rule.selector];
        //     let errorMessage = '';

        //     for (let i = 0; i < rules.length; i++) {
        //         const ruleFunction = rules[i];

        //         if (typeof ruleFunction === 'function') {
        //             errorMessage = ruleFunction(inputElement.value);
        //         } else if (typeof ruleFunction === 'object' && ruleFunction instanceof Promise) {
        //             try {
        //                 errorMessage = await ruleFunction; // Wait for the promise to resolve
        //             } catch (error) {
        //                 console.error('An error occurred during validation:', error);
        //                 throw new Error('Có lỗi xảy ra trong quá trình kiểm tra!');
        //             }
        //         }

        //         // if (errorMessage) {
        //         //     this.errorMessages.push(errorMessage);
        //         //     break;
        //         // }
        //     }

        //     if (errorMessage instanceof Promise) {
        //         errorMessage.then((resolvedMessage) => {
        //             if (resolvedMessage) {
        //                 const formGroup = getParentElement(inputElement, options.formGroupSelector);
        //                 formGroup.querySelector(options.formMessage).innerText = resolvedMessage;
        //                 formGroup.classList.add('invalid');
        //             } else {
        //                 oninputHandler(inputElement);
        //             }
        //         });
        //     } else {
        //         if (errorMessage) {
        //             const formGroup = getParentElement(inputElement, options.formGroupSelector);
        //             formGroup.querySelector(options.formMessage).innerText = errorMessage;
        //             formGroup.classList.add('invalid');
        //         } else {
        //             oninputHandler(inputElement);
        //         }
        //     }
        // }


        // remove all the invalid signal while user fill in the input
        function oninputHandler (inputElement) {
            // getParentElement(inputElement , options.formGroupSelector).querySelector(options.formMessage).innerText = ''
            // getParentElement(inputElement , options.formGroupSelector).classList.remove('invalid')
            const formGroup = getParentElement(inputElement, options.formGroupSelector);
            formGroup.querySelector(options.formMessage).innerText = '';
            formGroup.classList.remove('invalid');
        }
        
        options.rules.forEach(rule => {
            const inputElements = Array.from(formElement.querySelectorAll(rule.selector))

            inputElements.forEach(inputElement => {
                if (Array.isArray(selectorRules[rule.selector])) {
                    selectorRules[rule.selector].push(rule.test)
                } else {
                    selectorRules[rule.selector] = [rule.test]
                }

                inputElement.onblur = () => {
                    validate(inputElement, rule)
                }

                inputElement.oninput = () => {
                    oninputHandler(inputElement)
                }
            })
        })
    }
}

Validator.isRequired = (selector , message) => {
    return {
        selector,
        test (value) {
            return value.trim() ? undefined : message || 'Vui lòng điền thông tin.'
        }
    }
}
Validator.isEmail = (selector , message) => {
    return {
        selector,
        test (value) {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : message || 'Thông tin phải là email!' 
        }
    }
}
Validator.isCoupon = (selector , message) => {
    return {
        selector,
        test (value) {
            const regex = /^[a-zA-Z0-9]{10}$/;
            return regex.test(value) ? undefined : message || 'Mã không hợp lệ!' 
        }
    }
}
Validator.isEmailAlreadyExist = function (selector, message , url) {
    return {
        selector: selector,
        test: function (value) {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            if (!regex.test(value)) {
                return message || 'Please enter a valid email.';
            }

            // Check if email exists in the database
            const checkEmailUrl = url; // Replace with your server-side script URL

            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: checkEmailUrl,
                    method: 'POST',
                    data: { email: value },
                    success: function (response) {
                        if (response === 'exists') {
                            resolve('Email đã tồn tại trên hệ thống.');
                        } else {
                            resolve();
                        }
                    },
                    error: function (xhr, status, error) {
                        reject('Có lỗi xảy ra trong quá trình kiểm tra. Vui lòng thử lại.');
                    }
                });
            });
        },
    };
};
Validator.isPhone = (selector , message) => {
    return {
        selector,
        test (value) {
            const regex = /^(0[2|3|5|6|7|8|9])+([0-9]{8})$/;
            return regex.test(value) ? undefined : message || 'Số điện thoại của bạn không hợp lệ!'
        }
    }
}
Validator.isPassword = (selector , min = 8, max = 32, message) => {
    return {
        selector,
        test (value) {
            return value.length >= min && value.length <= max ? undefined : message || `Mật khẩu phải có ít nhất ${min} kí tự`
        }
    }
}
Validator.isConfirm = (selector , confirm , message) => {
    return {
        selector,
        test (value) {
            return value == confirm() ? undefined : message || `Mật khẩu xác nhận sai! Vui lòng nhập lại.`
        }
    }
}
Validator.isUsername = (selector, limit , message) => {
    return {
        selector,
        test (value) {
            return value < limit ? undefined : message || `Tên đăng nhập phải có độ dài dưới ${limit} kí tự`
        }
    }
}
Validator.isUsernameAlreadyExist = function (selector, message, url) {
    return {
        selector: selector,
        async test(value) {
            if (!value.trim()) {
                return message || 'Vui lòng nhập tên đăng nhập của bạn!';
            }

            const checkUsernameUrl = url; // Replace with your server-side script URL
            
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: checkUsernameUrl,
                    method: 'POST',
                    data: { username: value },
                    success: function (response) {
                        if (response === 'exists') {
                            resolve('Tên đăng nhập đã tồn tại trên hệ thống.');
                        } else {
                            resolve();
                        }
                    },
                    error: function (xhr, status, error) {
                        reject('Có lỗi xảy ra trong quá trình kiểm tra. Vui lòng thử lại.');
                    }
                });
            });
        },
    };
};
Validator.isProductNameAlreadyExist = function (selector, message, url) {
    return {
        selector: selector,
        async test(value) {
            if (!value.trim()) {
                return message || 'Please enter a product name!';
            }

            const checkProductNameUrl = url; // Replace with your server-side script URL

            try {
                const [...products] = await getData(checkProductNameUrl);
                const productNames = products.map(product => product.title);

                const isProductNameExist = productNames.includes(value);
                // console.log(products);
                // console.log(productNames);
                // console.log(isProductNameExist)

                if (isProductNameExist) {
                    return 'Product name already exists.';
                }
            } catch (error) {
                console.error('An error occurred during validation:', error);
                throw new Error('An error occurred during validation. Please try again later.');
            }
        },
    };
};
Validator.isPrice = (selector, message) => {
    return {
        selector,
        test(value) {
            const numericValue = Number(value);
            console.log(numericValue);

            if (isNaN(numericValue)) {
                return message || 'Price must be a number!';
            }

            if (numericValue < 0) {
                return message || `Price can't be a negative number!`;
            }

            return undefined; // Return undefined when validation passes
        },
    };
};
Validator.isPromotion = (selector, message) => {
    return {
        selector,
        test(value) {
            const price = document.querySelector('input[name="price"]').value;
            console.log(price);

            if (!price) {
                return 'You have to enter the product price before entering the promotion.';
            }

            const numericPrice = Number(price);
            const numericValue = Number(value);
            // console.log(numericValue, numericPrice)

            if (isNaN(numericValue)) {
                return message || 'Promotion must be a number!';
            }

            if (numericValue < 0) {
                return message || 'Promotion cannot be a negative number.';
            }

            if (numericValue > numericPrice) {
                return message || 'Promotion cannot be greater than the price.';
            }

            return undefined; // Return undefined when validation passes
        },
    };
};
Validator.isPositiveNumber = (selector, message) => {
    return {
        selector: selector,
        test (value) {
            const numericValue = Number(value);
            if (isNaN(numericValue)) {
                return message || 'Please enter a valid number.';
            }

            if (numericValue < 0) {
                return message || 'Please enter a positive number.';
            }

            return undefined; // Return undefined when validation passes
        }
    }
}