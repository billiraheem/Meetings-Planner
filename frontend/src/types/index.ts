export interface Meeting {
    _id: string;
    title: string;
    startTime: string;
    endTime: string;
    participants: string[];
    data?: {}
}

// export interface User {
//     _id: string;
//     name: string;
//     email: string;
//     isAdmin?: boolean;
// }

// export interface AuthState {
//     isAuthenticated: boolean;
//     user: User | null;
//     isAdmin: boolean;
//     loading: boolean;
//     error: string | null;
// }