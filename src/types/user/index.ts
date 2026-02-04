interface menuItem{
  name:string
  icon:string
  url:string
  children?:menuItem[]
}  

export type{menuItem}