import { IUseCase } from "../../src/contracts/iusecase";
import { ConsultaGradeCurricularController } from "../../src/controllers/controller";
import { ConsultaGradeCurricularEntrada, ConsultaGradeCurricularSaida } from "../../src/domain/usecases/usecase";
import { Request, Response } from "express";

class UseCaseFake implements IUseCase<ConsultaGradeCurricularEntrada, ConsultaGradeCurricularSaida> {
    chamado: boolean = false;
    async perform(entrada: ConsultaGradeCurricularEntrada): Promise<ConsultaGradeCurricularSaida> {
        this.chamado = true;
        if (entrada.cursoId === '1') {
            return {
                cursoId: '1',
                nomeCurso: 'Engenharia de Software',
                disciplinas: ['Algoritmos', 'Estruturas de Dados', 'Banco de Dados']
            };
        } else {
            throw new Error('Curso não encontrado');
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

function makeSUT() {
    const requestStub = {
        params: {
            cursoId: '1',
        },
    } as any as Request;
    const responseFake = new ResponseFake();
    const uc = new UseCaseFake();
    const controller = new ConsultaGradeCurricularController(uc);
    return { uc, controller, requestStub, responseFake };
}

describe('ConsultaGradeCurricularController', () => {
    
    it('deve instanciar ConsultaGradeCurricularController', () => {
        let { controller } = makeSUT();
        expect(controller).toBeDefined();
    });

    it('deve chamar handle com sucesso', async () => {
        let { uc, controller, requestStub, responseFake } = makeSUT();
        await controller.handle(requestStub, responseFake as any as Response);
        
        expect(uc.chamado).toBe(true);
        expect(responseFake.statusCodeInformado).toBe(200);
        expect(responseFake.jsonInformado.mensagem).toBe('Consulta realizada com sucesso');
        expect(responseFake.jsonInformado.cursoId).toBe('1');
        expect(responseFake.jsonInformado.nomeCurso).toBe('Engenharia de Software');
        expect(responseFake.jsonInformado.disciplinas).toEqual(['Algoritmos', 'Estruturas de Dados', 'Banco de Dados']);
    });

    it('deve retornar erro quando o curso não for encontrado', async () => {
        let { uc, controller, requestStub, responseFake } = makeSUT();
        requestStub.params.cursoId = '999';
        await controller.handle(requestStub, responseFake as any as Response);
        
        expect(uc.chamado).toBe(true);
        expect(responseFake.statusCodeInformado).toBe(400);
        expect(responseFake.jsonInformado.mensagem).toBe('Erro ao consultar grade curricular');
        expect(responseFake.jsonInformado.erro).toBe('Curso não encontrado');
    });

    it('deve retornar erro quando o cursoId não for fornecido', async () => {
        let { uc, controller, requestStub, responseFake } = makeSUT();
        requestStub.params.cursoId = '';
        await controller.handle(requestStub, responseFake as any as Response);
        
        expect(uc.chamado).toBe(true);
        expect(responseFake.statusCodeInformado).toBe(400);
        expect(responseFake.jsonInformado.mensagem).toBe('Erro ao consultar grade curricular');
        expect(responseFake.jsonInformado.erro).toBe('Curso não encontrado');
    });
});