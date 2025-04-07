
export interface IRepositoryFind<E> {
    BuscarTodos(): Promise<Array<E>>;
    BuscarPorId(id: string): Promise<E | undefined>;
}


