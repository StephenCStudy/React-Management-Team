export type Project ={
    id: number;
    projectName: string;
    imgUrl: string;
    members:[
        {
            userID: number;
            role: string;
        }
    ]
};