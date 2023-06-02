import { connectDB, mongoDisconnect } from "../../src/config/mongo";
import { expect, jest } from "@jest/globals";
import { UserModel } from '../../src/models/user.model';
import {register} from "../../src/logic/register.logic"


describe("Business Logic: Register unit test", ()=>{

	it("[ERROR] When user is already registered", async () => {
        
		//mockear la función getCriminalRecords para devolver un valor true que indique que no tiene antecedentes
        //mockear la función UserModel.findOne para devolver un objeto de usuario que coincida con el email o rut proporcionado
        //resultado esperado: la función register lanza un httpError con código 400 indicando que el usuario ya existe
	});
})