export class User {
    _id: string  = "";
    username: string = "";
    firstname: string = "";
    lastname: string = "";
    email: string = "";
    password: string = "";
    privilege: string = "";
    timestamp: Date = new Date();
    login_counter: number = 0
}
