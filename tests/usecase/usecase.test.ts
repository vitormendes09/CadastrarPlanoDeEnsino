import { IRepositoryFind } from "../../src/contracts/irepository";
import { ICurso } from "../../src/domain/entities/ICurso";
import { ConsultaGradeCurricularUseCase, ConsultaGradeCurricularEntrada} from "../../src/domain/usecases/usecase";

class RepositoryFake implements IRepositoryFind<ICurso>{
    private opcao: string;
    constructor(opcao: string){
        this.opcao = opcao;
    }

    findAll(): Promise<ICurso[]> {
        throw new Error("Method not Implemented")
    }

    findById(id: string): Promise<ICurso | undefined> {
        if(this.opcao =='certo'){
            return Promise.resolve({
                cursoId: Number(id),
                nomeCurso: 'Bacharelado de Sistemas de Informação',
                disciplinas: ['Algoritmos', 'Estruturas de Dados', 'Banco de Dados', 'Engenharia de Software', 'Redes de Computadores']
            } as unknown as ICurso);
        
        } if (this.opcao ==='falta disciplina'){
            return Promise.resolve({
                cursoId: Number(id),
                nomeCurso: 'Bacharelado de Sistemas de Informação',
                disciplinas: ['Algoritmos', 'Estruturas de Dados']
            }as unknown as ICurso);
        } if(this.opcao === 'falta curso') {
            return Promise.resolve(undefined);
        }if(this.opcao === 'erro'){
            throw new Error('Erro no repositório');
        }else {
            return Promise.resolve(undefined);
        }
    }
}


function makeSUT(opcao: string) {
    const repo = new RepositoryFake(opcao);
    const uc = new ConsultaGradeCurricularUseCase(repo);
    return { repo, uc };
}

describe('ConsultarCronogramaUseCase', () => {
    
    it('deve instanciar ConsultarCronogramaUseCase', () => {
        let { repo, uc } = makeSUT('1');
        expect(uc).toBeDefined();
    });

    it('deve chamar perform', async () => {
        let { repo, uc } = makeSUT('certo');
        const entrada: ConsultaGradeCurricularEntrada = {cursoId: 1}
        const saida = await uc.perform(entrada);

        expect(saida.cursoId).toBe(1);
        expect(saida.disciplinas[0]).toBe("Algoritmos");
        expect(saida.nomeCurso).toBe("Bacharelado de Sistemas de Informação");
        
    });


    it('deve retornar erro caso repositório não retorne o disciplina', async () => {
        let { repo, uc } = makeSUT('falta curso');
        const entrada: ConsultaGradeCurricularEntrada = {cursoId: 1}
        let erro: any;
        try{
            const saida = await uc.perform(entrada);
        }catch(e: any){
            erro = e;
        }
        expect(erro.message).toBe("Curso não encontrado");
        
    });

    it('deve retornar erro caso o id seja maior que 49', async () => {
        let { repo, uc } = makeSUT('certo');
        const entrada: ConsultaGradeCurricularEntrada = {cursoId: 51}
        let erro: any;
        try{
            const saida = await uc.perform(entrada);
        }catch(e: any){
            erro = e;
        }
        expect(erro.message).toBe("O id do curso não pode ser maior que 50");
        
    });

    it('deve retornar erro caso ocorra algum erro no repositório', async () => {
        let { repo, uc } = makeSUT('erro');
        const entrada: ConsultaGradeCurricularEntrada = {cursoId: 50}
        let erro: any;
        try{
            const saida = await uc.perform(entrada);
        }catch(e: any){
            erro = e;
        }
        expect(erro.message).toBe("Erro no repositório");
        
    });

    it('deve retornar erro se o curso tiver menos de 5 disciplinas', async () => {
        let { uc } = makeSUT('falta disciplina');
        const entrada: ConsultaGradeCurricularEntrada = {cursoId: 2}
        let erro: any;
        try {
            await uc.perform(entrada);
        } catch (e: any) {
            erro = e;
        }
        expect(erro.message).toBe("Curso deve ter pelo menos 5 disciplinas");
    });
    

});