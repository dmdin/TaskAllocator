export interface IEntityRepository<T>{
    create(item: T): Promise<T>
    get(id: string): Promise<T | null>
    update(id: string, newItem: T): Promise<T | null> 
    delete(id: string): Promise<void>
    getAll(offset: number, count: number): Promise<T[]>
}