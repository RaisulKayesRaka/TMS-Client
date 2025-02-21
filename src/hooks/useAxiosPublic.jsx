import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://tms-server-lyart.vercel.app",
});

export default function useAxiosPublic() {
  return axiosPublic;
}
