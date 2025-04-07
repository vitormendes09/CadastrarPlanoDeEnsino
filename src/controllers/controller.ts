import { Request, Response } from 'express';
import { IUseCase } from '../contracts/iusecase';
import {ConsultaGradeCurricularEntrada , ConsultaGradeCurricularSaida} from '../domain/usecases/usecase'; 

export interface IController {
    handle(req: Request, resp: Response): Promise<void>;
}

export class ConsultaGradeCurricularController implements IController {
    uc: IUseCase<ConsultaGradeCurricularEntrada, ConsultaGradeCurricularSaida>;

    constructor(uc: IUseCase<ConsultaGradeCurricularEntrada, ConsultaGradeCurricularSaida>) {
        this.uc = uc;
    }

    public async handle(req: Request, resp: Response): Promise<void> {

        const resultadoValidadaoEntrada = this.validarEntrada(req);

        if(resultadoValidadaoEntrada){
            resp.status(400).json({error: resultadoValidadaoEntrada});
        } else {
            try {
                const {cursoId} = req.params;

                const dto_usecase: ConsultaGradeCurricularEntrada = {
                    cursoId: parseInt(cursoId as string)
                };

                const resposta: ConsultaGradeCurricularSaida = await this.uc.perform(dto_usecase);
               

                if(this.validarSaida(resposta)){
                    resp.status(500).json({error: 'Retorno do use case não é um id'});

                } else {
                    const minha_resposta = {
                        mensagem: 'ConsultarGradeCurricularController.metodoBasico() chamado', 
                        
                    };

                    resp.status(200).json(resposta).end();
                }
            } catch(error: any) {
                resp.status(500).json({ error: error.message});
            }
        }
    }

    private validarEntrada(req: Request): string | null {
        const {cursoId} = req.params;

            if(!cursoId){
                return "Id é obrigatório";
            }
            if( isNaN(Number(cursoId))) {
                return "Id precisa ser um número"
            }  

            return null;
    }

    private validarSaida(resposta: ConsultaGradeCurricularSaida): boolean {
        if (isNaN(Number(resposta.cursoId)) || !Array.isArray(resposta.disciplinas)) {
            return true;
        }
        
        return false;
    }
}