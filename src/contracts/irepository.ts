
export interface IRepositoryFind<E> {
    findAll(): Promise<Array<E>>;
    findById(id: string): Promise<E | undefined>;
}

export interface IRepositoryCreat<E>{
    create (id: string, obj: E): Promise<E | null>;
}

export interface IRepositoryUpdate<E>{
    update(id: string, obj: E): Promise<E | null>;
}

export interface IRepositoryDelete<E>{
    delete(id: string): Promise<boolean>; 
}

