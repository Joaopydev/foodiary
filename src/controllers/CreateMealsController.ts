import { db } from "../db";
import { ProtectedHttpRequest, HttpResponse } from "../types/Http";
import { badRequest, created} from "../utils/http";
import { mealsTable } from "../db/schema";
import z from "zod";

const schema = z.object({
    fileType: z.enum(["audio/m4a", "img/jpeg"]),
})

export class CreateMealsController {
    static async handle({ userId, body }: ProtectedHttpRequest): Promise<HttpResponse> {

        const { success, error, data } = schema.safeParse(body)

        if (!success) {
            return badRequest({ errors: error.issues })
        }

        const [ meal ] = await db.insert(mealsTable).values({
            userId,
            inputFileKey: "input_file_key",
            inputType: data.fileType == "audio/m4a" ? "audio" : "picture",
            status: "uploading",
            icon: "",
            name: "",
            foods: [],
        }).returning({ id: mealsTable.id })

        return created({ mealId: meal.id })
    }
}