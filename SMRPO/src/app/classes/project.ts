import { User } from "./user";

export class Project {
    _id: string  = "";
    name: string = "";
    description: string = "";
    developers: Array<User> = [] ;
    scrum_master: User = new User;
    product_owner: User = new User;
    documentation: string [] = []
}
