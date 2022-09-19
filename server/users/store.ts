export class User{
    id: string;
    name: string;

    constructor(name: string, id: string){
        this.id = id
        this.name = name
    }
}

export default class Users{
    
    private store: Record<string, string>;

    constructor(){
        this.store = {}
    }

    async add(user: User): Promise<boolean>{
        this.store[user.id] = user.name
        return true
    }

    async get(id: string): Promise<User | undefined>{
        const name = this.store[id]
        return (!name) ? undefined : new User(name, id)
    }
}