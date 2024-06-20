import axios from "axios";

export const apiClient = axios.create({
    //baseURL: 'http://10.0.2.2:8000' 
    baseURL: 'https://api.maze.social'
});