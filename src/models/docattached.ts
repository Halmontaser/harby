export interface docattached {
    file :File
    doctype :string
    docname ?:string
    parent ?:string
    get_supplier():string
    isdetials ?:boolean
}
interface legal_document extends docattached{
issue   :string
expired_at :string
type :string

}