import { IRepositoryFind } from "../../contracts/irepository"
import { IBancoDeDados } from "../../data/dataBase/bancodedados"
import { ICurso } from "../../domain/entities/ICurso"

export class ConsultarCursoRepostory implements IRepositoryFind<ICurso> {

    bd: IBancoDeDados<ICurso>;

    constructor(bd: IBancoDeDados<ICurso>) {
        this.bd = bd;
    }

    findAll(): Promise<ICurso[]> {
        try {
            let result = this.bd.query("Select * From curso;", null) as ICurso[];
            if (!result) {
                new Error("Nenhum curso encontrado");
            }
            if (result.length == 0) {
                new Error("Nenhum curso encontrado")

            }
            return Promise.resolve(result)
        } catch (e) {
            return Promise.resolve([]);
        }
    }


    findById(id: string): Promise<ICurso | undefined> {
        let result = this.bd.query("SELECT * FROM curso where id =$id;", null)

      
            if (!result) {
                return Promise.resolve(undefined);
            }

            if (result.length === 0) {
                new Error("Nenhum curso encontrado");
            }

            return Promise.resolve(result.shift() as unknown as ICurso)

        
    }

}