
export interface IComment {
    _id:            string;
    content:        string;
    commentCreator: CommentCreator;
    post:           string;
    createdAt:      Date;
    id:             string;
}

export interface CommentCreator {
    _id:   string;
    name:  string;
    photo: string;
}
