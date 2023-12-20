
export default interface Paginated<T> 
{
    data: T[],
    page: number, // Current page
    max: number // Max page
}

export interface PaginationQuery
{
    page: number, // Current page
    size: number // Max number of item
}