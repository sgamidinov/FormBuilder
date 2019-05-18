const onlyNumbers = /^\d+$/;
const onlyNumbersAndSpace = /^(?=.*\d)[\d ]+$/;
const email = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

export {
    email,
    onlyNumbers,
    onlyNumbersAndSpace,
}

