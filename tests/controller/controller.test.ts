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
                cursoId: '1',
                nomeCurso: 'Bacharelado de Sistemas de Informação',
                disciplinas: ['Algoritmos', 'Estruturas de Dados', 'Banco de Dados']
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
    
    it('deve instanciar ConsultaGradeCurricularController', () => {
        let { controller } = makeSUT('1', "certo");
        expect(controller).toBeDefined();
    });

    it('deve chamar handle com sucesso', async () => {
        let { controller, requestStub, responseFake } = makeSUT('1', "certo");
        await controller.handle(requestStub, responseFake as any as Response);

        expect(responseFake.endChamado).toBe(true);
        expect(responseFake.statusCodeInformado).toBe(200);
        expect(responseFake.jsonInformado.mensagem).toBe('Consulta realizada com sucesso');
        expect(responseFake.jsonInformado.cursoId).toBe('1');
        expect(responseFake.jsonInformado.nomeCurso).toBe('Bacharelado de Sistemas de Informação');
        expect(responseFake.jsonInformado.disciplinas).toEqual(['Algoritmos', 'Estruturas de Dados', 'Banco de Dados']);
    });

    it('deve retornar erro quando o curso não for encontrado', async () => {
        let { controller, requestStub, responseFake } = makeSUT('999', "cursoNaoEncontrado");
        await controller.handle(requestStub, responseFake as any as Response);

        expect(responseFake.endChamado).toBe(true);
        expect(responseFake.statusCodeInformado).toBe(400);
        expect(responseFake.jsonInformado.mensagem).toBe('Erro ao consultar grade curricular');
        expect(responseFake.jsonInformado.erro).toBe('Curso não encontrado');
    });

    //it('deve retornar erro quando o curso estiver inativo', async () => {
    //    let { controller, requestStub, responseFake } = makeSUT('2', "cursoInativo");
    //    await controller.handle(requestStub, responseFake as any as Response);

    //    expect(responseFake.endChamado).toBe(true);
    //    expect(responseFake.statusCodeInformado).toBe(400);
    //    expect(responseFake.jsonInformado.mensagem).toBe('Erro ao consultar grade curricular');
    //    expect(responseFake.jsonInformado.erro).toBe('Curso inativo');
    //});

    it('deve retornar erro quando o curso não tiver disciplinas cadastradas', async () => {
        let { controller, requestStub, responseFake } = makeSUT('1', "semDisciplinas");
        await controller.handle(requestStub, responseFake as any as Response);

        expect(responseFake.endChamado).toBe(true);
        expect(responseFake.statusCodeInformado).toBe(400);
        expect(responseFake.jsonInformado.mensagem).toBe('Erro ao consultar grade curricular');
        expect(responseFake.jsonInformado.erro).toBe('Curso sem disciplinas cadastradas');
    });

    it('deve retornar erro quando o curso não tiver disciplinas obrigatórias', async () => {
        let { controller, requestStub, responseFake } = makeSUT('1', "semDisciplinaObrigatoria");
        await controller.handle(requestStub, responseFake as any as Response);

        expect(responseFake.endChamado).toBe(true);
        expect(responseFake.statusCodeInformado).toBe(400);
        expect(responseFake.jsonInformado.mensagem).toBe('Erro ao consultar grade curricular');
        expect(responseFake.jsonInformado.erro).toBe('Curso sem disciplinas obrigatórias');
    });

    it('deve retornar erro quando o curso tiver nome inválido', async () => {
        let { controller, requestStub, responseFake } = makeSUT('1', "nomeInvalido");
        await controller.handle(requestStub, responseFake as any as Response);

        expect(responseFake.endChamado).toBe(true);
        expect(responseFake.statusCodeInformado).toBe(400);
        expect(responseFake.jsonInformado.mensagem).toBe('Erro ao consultar grade curricular');
        expect(responseFake.jsonInformado.erro).toBe('Curso com nome inválido');
    });

    it('deve retornar erro inesperado', async () => {
        let { controller, requestStub, responseFake } = makeSUT('1', "erroInesperado");
        await controller.handle(requestStub, responseFake as any as Response);

        expect(responseFake.endChamado).toBe(true);
        expect(responseFake.statusCodeInformado).toBe(400);
        expect(responseFake.jsonInformado.mensagem).toBe('Erro ao consultar grade curricular');
        expect(responseFake.jsonInformado.erro).toBe('Erro inesperado');
    });

    it('deve logar a instância do controlador quando não estiver em ambiente de teste', () => {
        process.env.NODE_ENV = 'development';
        const consoleSpy = jest.spyOn(console, 'log');
        let { controller } = makeSUT('1', "certo");
        expect(controller).toBeDefined();
        expect(consoleSpy).toHaveBeenCalledWith('ConsultaGradeCurricularController instanciado');
        process.env.NODE_ENV = 'test';
    });

    it('deve logar a chamada do handle quando não estiver em ambiente de teste', async () => {
        process.env.NODE_ENV = 'development';
        const consoleSpy = jest.spyOn(console, 'log');
        let { controller, requestStub, responseFake } = makeSUT('1', "certo");
        await controller.handle(requestStub, responseFake as any as Response);
        expect(consoleSpy).toHaveBeenCalledWith('ConsultaGradeCurricularController.handle() chamado', '1');
        process.env.NODE_ENV = 'test';
    });

    it('deve logar a resposta do use case quando não estiver em ambiente de teste', async () => {
        process.env.NODE_ENV = 'development';
        const consoleSpy = jest.spyOn(console, 'log');
        let { controller, requestStub, responseFake } = makeSUT('1', "certo");
        await controller.handle(requestStub, responseFake as any as Response);
        expect(consoleSpy).toHaveBeenCalledWith('Resposta UseCase', {
            cursoId: '1',
            nomeCurso: 'Bacharelado de Sistemas de Informação',
            disciplinas: ['Algoritmos', 'Estruturas de Dados', 'Banco de Dados']
        });
        process.env.NODE_ENV = 'test';
    });
});