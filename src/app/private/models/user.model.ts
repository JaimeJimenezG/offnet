export class User {
    username: string;
    //password: string;
    constructor(attrs: UserAttrs) {
        this.username = attrs.username;
        //this.password = attrs.password;
    }
}
export interface UserAttrs {
    username: string;
    password: string;
}