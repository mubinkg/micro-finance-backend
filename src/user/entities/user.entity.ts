import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

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

export type UserDocument = HydratedDocument<User>
export const UserSchema = SchemaFactory.createForClass(User)
