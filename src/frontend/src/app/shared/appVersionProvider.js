import axios from "axios";
import { APP_VERSION_URL } from "@/app/shared/apiUrls";

export async function getAppVersionString() {
    const response = await axios.get(APP_VERSION_URL);

    const { version } = response.data;

    return version;
}
