import {useQuery} from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";

const fetchUser=async () => {
    try {
        const response = await axiosInstance.get("/api/logged-in-user");
        return response.data?.user ?? null;
    } catch (error: any) {
        if (error.response?.status === 401) {
            return null; // Користувач не залогінений — ок
        }
        console.error("fetchUser error:", error);
        throw error; // Інші помилки — пробросити далі
    }
    //const response=await axiosInstance.get("/api/logged-in-user");
    //return response.data.user;
};

const useUser=()=>{
    const {
        data:user,
        isPending:isLoading,
        isError,
        refetch,
    }=useQuery({
        queryKey:["user"],
        queryFn:fetchUser,
        staleTime:1000*60*5,
        retry:false,
    });

    return {user, isLoading, isError, refetch};
};

export default useUser;