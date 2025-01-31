import { Request, Response } from 'express';
import { IUseCase } from '../contracts/iusecase';
import {ConsultaGradeCurricularEntrada , ConsultaGradeCurricularSaida} from '../domain/usecases/usecase'; 

export interface IController {
    handle(req: Request, resp: Response): Promise<void>;
}

export class ConsultaGradeCurricularController implements IController {
    uc: IUseCase<ConsultaGradeCurricularEntrada, ConsultaGradeCurricularSaida>;

    constructor(uc: IUseCase<ConsultaGradeCurricularEntrada, ConsultaGradeCurricularSaida>) {
        console.log('ConsultaGradeCurricularController instanciado');
        this.uc = uc;
    }

    public async handle(req: Request, resp: Response): Promise<void> {
        const { cursoId } = req.params;

        console.log('ConsultaGradeCurricularController.handle() chamado', cursoId);
        const dto_usecase: ConsultaGradeCurricularEntrada = {
            cursoId: cursoId as string,
        };
        try {
            const resposta: ConsultaGradeCurricularSaida = await this.uc.perform(dto_usecase);
            console.log('Resposta UseCase', resposta);

            const minha_resposta = {
                mensagem: 'Consulta realizada com sucesso',
                cursoId: resposta.cursoId,
                nomeCurso: resposta.nomeCurso,
                disciplinas: resposta.disciplinas,
            };
            resp.status(200).json(minha_resposta).end();
        } catch (error) {
            console.error('Erro ao consultar grade curricular', error);
            const errorMessage = (error as Error).message;
            resp.status(400).json({ mensagem: 'Erro ao consultar grade curricular', erro: errorMessage }).end();
        }
    }
}