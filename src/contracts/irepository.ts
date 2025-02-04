export interface IRepository<E> {
    findAll(): Promise<Array<E>>;
    findById(id: string): Promise<E | undefined>;
    create(id: string, obj: E): Promise<E | undefined>;
    update(id: string, obj: E): Promise<E | undefined>;
    delete(id: string): Promise<boolean>; 
}

