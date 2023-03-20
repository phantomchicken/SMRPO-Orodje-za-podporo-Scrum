export class Story {
    _id: string  = "";
    name: string  = "";
    description: string  = "";
    storyPoints: Number | undefined;
    priority: string | undefined;
    acceptanceCriteria: string  = "";
    businessValue: Number | undefined;
    status: string | undefined;
    project: string = "";
    sprint: string | undefined;
    assignee: string | undefined;
}
