import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { useAuthStore } from "../store/authStore";
import { isProtected } from "../utils/protected";

const fetchUser = async (isLoggedIn: boolean) => {
  const config = isLoggedIn ? isProtected : {};
  const response = await axiosInstance.get("/api/logged-in-user", config);
  return response.data.user;
};

const useUser = () => {
  const { setLoggedIn, isLoggedIn, setUser } = useAuthStore();

  const {
    data: user,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUser(isLoggedIn),
    staleTime: 1000 * 60 * 5,
    retry: false,
    //@ts-ignore@
    onSuccess: (data) => {
      setLoggedIn(true);
      setUser(data); 
    },
    onError: () => {
      setLoggedIn(false);
      setUser(null); 
    },
  });

  return { user: user as any, isLoading: isPending, isError };
};

export default useUser;
