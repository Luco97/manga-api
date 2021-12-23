
export interface response {
    status: number;
    message: string;
}

export interface userResponse extends response {
    token?: string;
}
