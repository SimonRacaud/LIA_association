
export default interface Paginated<T> 
{
    data: T[],
    page: number,
    max: number
}