/**
 * Created by sunlong on 2017/3/20.
 */
export default class BaseModal {
    constructor() {
        Object.defineProperty(this, 'getRandomInt', { enumerable: false });
        Object.defineProperty(this, 'generateId', { enumerable: false });
        this.id = this.generateId();
    }

    getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };

    generateId = () => `${new Date().getTime()}${this.getRandomInt(0, 10000)}`;

    plainObject() {
        return { ...this };
    }
}

