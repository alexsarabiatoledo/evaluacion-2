import axios from "axios";
import environment from "../config/environment.js";

const {
	REGISTRO_CIVIL_API: { BASE_URL, APIKEY },
} = environment;

const axiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: {
		headers: {
			apikey: APIKEY,
		},
	},
});

/**
 * @param {string} rut - User RUT
 */
async function getCriminalRecords(rut) {
	const url = `${BASE_URL}${ENDPOINTS.getPeople(rut)}`;
	return axios
		.get(url)
		.then(() => {
			return true;
		})
		.catch((error) => {
			if (error.response.status === 404) {
				return false;
			}
			throw error;
		});
}

export { getCriminalRecords };