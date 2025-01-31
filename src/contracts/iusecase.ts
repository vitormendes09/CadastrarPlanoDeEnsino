export interface IUseCase<Entrada, Saida> {
    perform(entrada: Entrada): Promise<Saida>;
}