import z from "zod"

export const SignUpSchema = z.object({
    name : z.string().min(3 , "Username should be greater than 3").max(20),
    email : z.email(),
    password : z.string()
})
export const SignInSchema = z.object({
    email : z.email(),
    password : z.string()
})
export const RoomSchema = z.object({
    name : z.string().min(3 , "Room name should be greater than 3").max(20),
})

