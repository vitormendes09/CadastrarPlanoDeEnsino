import { ICurso } from "../../domain/entities/ICurso";

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
                    disciplinas: ['Algoritmos', 'Estruturas de Dados', 'Banco de Dados', 'Engenharia de Software', 'Redes de Computadores']
                },

                {
                    cursoId: 2,
                    nomeCurso: 'Ciência da Computação',
                    disciplinas: ['Algoritmos', 'Estruturas de Dados', 'Banco de Dados', 'Engenharia de Software', 'Redes de Computadores']
                }
            ];
        } else if (sql == "SELECT * FROM curso where id = $id;") {
            return [{
                cursoId: 1,
                nomeCurso: 'Bacharelado de Sistemas de Informação',
                disciplinas: ['Algoritmos', 'Estruturas de Dados', 'Banco de Dados', 'Engenharia de Software', 'Redes de Computadores']
            }];
        } else {
            return null;
        }
    }

}