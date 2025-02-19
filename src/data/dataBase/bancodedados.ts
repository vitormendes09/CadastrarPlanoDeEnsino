import { ICurso } from "../../domain/entities/entitiesCurso";

export interface IBancoDeDados<T> {
    query(sql: string, param: any): T[] | null;
}

export class BancoDeDados implements IBancoDeDados<ICurso> {
    query(sql: string, param: any): ICurso[] | null {
        if (sql == "SELECT * FROM curso;") {
            return [
                {
                    cursoId: 1,
                    nomeCurso: 'Bacharelado de Sistemas de Informação',
                    disciplinas: ['Algoritmos', 'Estruturas de Dados', 'Banco de Dados']
                },

                {
                    cursoId: 2,
                    nomeCurso: 'Ciência da Computação',
                    disciplinas: ['Cálculo', 'Programação', 'Inteligência Artificial']
                }
            ];
        } else if (sql == "SELECT * FROM curso where id = $id;") {
            return [{
                cursoId: 1,
                nomeCurso: 'Bacharelado de Sistemas de Informação',
                disciplinas: ['Algoritmos', 'Estruturas de Dados', 'Banco de Dados']
            }];
        } else {
            return null;
        }
    }

}