export interface ApiResponse {
    code: string;
    success: boolean;
    message: string;
    error?: any;   // for internal use only
    data?: any; // likely only for success response
}
