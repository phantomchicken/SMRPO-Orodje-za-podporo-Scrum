import {User} from "./user";
import {Project} from "./project";

export class Post {
    _id: string  = "";
    title: string = "";
    content: string = "";
    user: User = new User();
    date: Date = new Date();

    project: Project = new Project();

    isEditing: boolean = false;
    deleteError: string = "";
//     updated: boolean = false;
//     update_error: string = "";
//     userFirstName: string;
//     userLastName: string;
//     deleteError: string = "";
}
