import { IsFunction } from "adminjs";

// 
export const isAdmin: IsFunction = ({ currentAdmin }) => {
    return currentAdmin && currentAdmin.role === 'admin';
}
