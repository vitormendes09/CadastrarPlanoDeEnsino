import { IRepositoryFind } from "../../contracts/irepository"
import { IBancoDeDados } from "../../data/dataBase/bancodedados"
import { ICurso } from "../../domain/entities/ICurso"

export class ConsultarCursoRepostory implements IRepositoryFind<ICurso> {

    banco: IBancoDeDados<ICurso>;

    constructor(bd: IBancoDeDados<ICurso>) {
        this.banco = bd;
    }

    BuscarTodos(): Promise<ICurso[]> {
        try {
            let result = this.banco.query("Select * From curso;", null) as ICurso[];
            if (!result) {
                new Error("Nenhum curso encontrado");
            }
            if (result.length == 0) {
                new Error("Nenhum curso encontrado")

            }
            return Promise.resolve(result)
        } catch (error) {
            return Promise.resolve([]);
        }
    }


    BuscarPorId(id: string): Promise<ICurso | undefined> {
        try {

            let result = this.banco.query("SELECT * FROM curso where id =$id;", null);

      
            if (!result || result.length === 0) {
                return Promise.resolve(undefined);
            }

            return Promise.resolve(result.shift() as unknown as ICurso)

        } catch (e) {
            return Promise.resolve(undefined);
        }

    }
     

}