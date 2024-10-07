export class User {
    name: string;
    //password: string;
    constructor(attrs: UserAttrs) {
        this.name = attrs.name;
        //this.password = attrs.password;
    }
}
export interface UserAttrs {
    name: string;
    password: string;
}