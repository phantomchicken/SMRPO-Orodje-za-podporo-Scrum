import {User} from "./user";

export class Post {
    _id: string  = "";
    title: string = "";
    content: string = "";
    user: User = new User();
    date: Date = new Date();
}
