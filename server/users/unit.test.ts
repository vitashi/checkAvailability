/**
 * Tests for User store logic
 * 
 * @group unit
 */

import Users, { User } from "./store";

 describe("User store logic", () => {

    const users = new Users()
  
    it("returns true when a new user is set", async () => {
        const user = new User("newUser", "new-user-id")
        expect(await users.add(user)).toBeTruthy()
    });

    it("returns undefined when a non existing user is fetched", async () => {
        expect(await users.get("non-existant-user")).toBeUndefined()
    })

    it("returns a user object when an existing user is fetched", async () => {
        const name = "newUser"
        const id = "new-user-id"
        const user = new User(name, id)
        await users.add(user)

        const fetchedUser = await users.get(id)

        expect(fetchedUser).toBeInstanceOf(User)
        expect(fetchedUser).toHaveProperty("name", name)
        expect(fetchedUser).toHaveProperty("id", id)
    })

 })