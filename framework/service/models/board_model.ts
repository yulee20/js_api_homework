export interface Board {
    title: string;
    owner: string;
    color?: string;
    permission?: string;
    isAdmin?: boolean;
    isActive?: boolean;
    isNoComments?: boolean;
    isCommentOnly?: boolean;
}