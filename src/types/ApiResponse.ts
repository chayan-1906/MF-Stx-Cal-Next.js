export interface ApiResponse {
    code: string;
    success: boolean;
    message: string;
    error?: any;   // for internal use only
}
