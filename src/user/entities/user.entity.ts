import { Prop, Schema } from "@nestjs/mongoose";

@Schema({
    timestamps: true
})
export class User {
    _id: string

    @Prop({type: String})
    firstName?: string

    @Prop({type: String})
    lastName?: string

    @Prop({type: String})
    password?: string

    @Prop({type: String})
    email?: string

    createdAt?:Date

    updatedAt?:Date
}
