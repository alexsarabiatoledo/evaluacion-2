import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import config from "../config/environment";

const { BASE_URL, APIKEY } = config.REGISTRO_CIVIL_API;

const getPersonURL = `${BASE_URL}${ENDPOINTS.getPeople()}`;

const mock = new MockAdapter(axios);

const peopleRegisteredInRegistroCivil = [
    {"rut": "199714961", "fullName": "Alex Fabian Sarabia Toledo", "quantity":7},
    {"rut":"10570061k", "fullName": "Patricia Fabiola Toledo Fernandez", "quantity":0},
    {"rut":"108665551", "fullName": "Max Hernán Bustamante Ancalao", "quantity":4}
];

peopleRegisteredInRegistroCivil.forEach((person) =>
mock.onGet(`${getPersonURL}${person}`).reply(200,{})
);
export default mock;