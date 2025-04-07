import { IUseCase } from "../../src/contracts/iusecase";
import { ConsultaGradeCurricularController } from "../../src/controllers/controller";
import { ConsultaGradeCurricularEntrada, ConsultaGradeCurricularSaida } from "../../src/domain/usecases/usecase";
import { Request, Response } from "express";

class UseCaseFake implements IUseCase<ConsultaGradeCurricularEntrada, ConsultaGradeCurricularSaida> {
    chamado: boolean = false;
    opcao: string;
    constructor(opcao: string) {
        this.opcao = opcao;
    }
    async perform(entrada: ConsultaGradeCurricularEntrada): Promise<any> {
        this.chamado = true;
        if (this.opcao === "certo") {
            return {
               
                    cursoId: 1,
                    nomeCurso: 'Bacharelado de Sistemas de Informação',
                    disciplinas: ['Algoritmos', 'Estruturas de Dados', 'Banco de Dados', 'Engenharia de Software', 'Redes de Computadores']
                
            };
        } else if (this.opcao === "cursoNaoEncontrado") {
            throw new Error('Curso não encontrado');
        } else if (this.opcao === "semDisciplinas") {
            throw new Error('Curso sem disciplinas cadastradas');
        } else if (this.opcao === "semDisciplinaObrigatoria") {
            throw new Error('Curso sem disciplinas obrigatórias');
        } else if (this.opcao === "nomeInvalido") {
            throw new Error('Curso com nome inválido');
        } else {
            throw new Error('Erro inesperado');
        }
    }
}

class ResponseFake {
    statusCodeInformado: number = 0;
    jsonInformado: any = null;
    endChamado: boolean = false;

    status(code: number): ResponseFake {
        this.statusCodeInformado = code;
        return this;
    }

    json(data: any): ResponseFake {
        this.jsonInformado = data;
        return this;
    }

    end(): ResponseFake {
        this.endChamado = true;
        return this;
    }
}

function makeSUT(cursoId: any, opcao: string) {
    const requestStub = {
        params: {
            cursoId: cursoId,
        },
    } as any as Request;
    const responseFake = new ResponseFake();
    const uc = new UseCaseFake(opcao);
    const controller = new ConsultaGradeCurricularController(uc);
    return { uc, controller, requestStub, responseFake };
}


describe('ConsultaGradeCurricularController', () => {
    it('deve retornar status 400 se o id não for informado', async () => {
        const { controller, requestStub, responseFake } = makeSUT(undefined, 'certo');
        await controller.handle(requestStub, responseFake as any);
        expect(responseFake.statusCodeInformado).toBe(400);
        expect(responseFake.jsonInformado).toEqual({ error: "Id é obrigatório" });
    });

    it('deve retornar status 400 se o id não for um número', async () => {
        const { controller, requestStub, responseFake } = makeSUT('abc', 'certo');
        await controller.handle(requestStub, responseFake as any);
        expect(responseFake.statusCodeInformado).toBe(400);
        expect(responseFake.jsonInformado).toEqual({ error: "Id precisa ser um número" });
    });

    it('deve retornar status 500 se o curso não for encontrado', async () => {
        const { controller, requestStub, responseFake } = makeSUT('1', 'cursoNaoEncontrado');
        await controller.handle(requestStub, responseFake as any);
        expect(responseFake.statusCodeInformado).toBe(500);
        expect(responseFake.jsonInformado).toEqual({ error: "Curso não encontrado" });
    });

    it('deve retornar status 500 se o curso não tiver disciplinas', async () => {
        const { controller, requestStub, responseFake } = makeSUT('1', 'semDisciplinas');
        await controller.handle(requestStub, responseFake as any);
        expect(responseFake.statusCodeInformado).toBe(500);
        expect(responseFake.jsonInformado).toEqual({ error: "Curso sem disciplinas cadastradas" });
    });

    it('deve retornar status 500 se o curso não tiver disciplinas obrigatórias', async () => {
        const { controller, requestStub, responseFake } = makeSUT('1', 'semDisciplinaObrigatoria');
        await controller.handle(requestStub, responseFake as any);
        expect(responseFake.statusCodeInformado).toBe(500);
        expect(responseFake.jsonInformado).toEqual({ error: "Curso sem disciplinas obrigatórias" });
    });

    it('deve retornar status 500 se o nome do curso for inválido', async () => {
        const { controller, requestStub, responseFake } = makeSUT('1', 'nomeInvalido');
        await controller.handle(requestStub, responseFake as any);
        expect(responseFake.statusCodeInformado).toBe(500);
        expect(responseFake.jsonInformado).toEqual({ error: "Curso com nome inválido" });
    });

    it('deve retornar status 200 e resposta correta se o curso for encontrado', async () => {
        const { controller, requestStub, responseFake } = makeSUT('1', 'certo');
        await controller.handle(requestStub, responseFake as any);
        expect(responseFake.statusCodeInformado).toBe(200);
        expect(responseFake.jsonInformado).toEqual({
            cursoId: 1,
            nomeCurso: 'Bacharelado de Sistemas de Informação',
            disciplinas: ['Algoritmos', 'Estruturas de Dados', 'Banco de Dados', 'Engenharia de Software', 'Redes de Computadores']
        });
    });

    it('deve retornar status 500 se o cursoId na resposta não for um número', async () => {
        const { controller, requestStub, responseFake } = makeSUT('1', 'cursoIdInvalido');
    
        controller['uc'] = {
            perform: async () => ({
                cursoId: "não é número",
                nomeCurso: 'Nome Qualquer',
                disciplinas: ['Algoritmos']
            }) as any
        };
    
        await controller.handle(requestStub, responseFake as any);
        expect(responseFake.statusCodeInformado).toBe(500);
        expect(responseFake.jsonInformado).toEqual({ error: 'Retorno do use case não é um id' });
    });

    it('deve retornar status 500 se disciplinas não for um array', async () => {
        const { controller, requestStub, responseFake } = makeSUT('1', 'disciplinasInvalidas');
    
        controller['uc'] = {
            perform: async () => ({
                cursoId: 1,
                nomeCurso: 'Nome Qualquer',
                disciplinas: "não é array"
            }) as any
        };
    
        await controller.handle(requestStub, responseFake as any);
        expect(responseFake.statusCodeInformado).toBe(500);
        expect(responseFake.jsonInformado).toEqual({ error: 'Retorno do use case não é um id' });
    });
    
});

