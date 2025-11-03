// provider/useBillStore.js
import axios from "axios";
import { create } from "zustand";
import config from "../config";
import ResponseError from "../utils/ResponseError";

const provider = (set, get) => ({
    totalBill: 0,
    loading: false,

    fetchDataTotalBill: async () => {
        set({ loading: true });
        try {
            const res = await axios.get(
                config.path + "/package/count-bill",
                config.headers()
            );
            if (res.data?.status) {
                set({ totalBill: res.data.total_bill });
                return res.data.total_bill; 
            }
            return null;
        } catch (error) {
            ResponseError(error?.message);
            return null;
        } finally {
            set({ loading: false });
        }
    },
});

const useBearProvider = create(provider);
export default useBearProvider;
