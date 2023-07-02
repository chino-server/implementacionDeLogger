
export default class UsersDB_DTO{
    constructor (user){
        this.firstName = user.firstName
        this.lastName = user.lastName
        this.mail = user.mail
        this.cart = user.cart
        this.rol = user.rol
    }
}