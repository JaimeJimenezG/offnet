export class User {
    id: number;
    name: string;
    //password: string;
    constructor(attrs: UserAttrs) {
        this.id = Math.floor(Math.random() * 99999)
        //this.id = attrs.id;
        this.name = attrs.name;
        //this.password = attrs.password;
    }
}
export interface UserAttrs {
    name: string;
    password: string;
}