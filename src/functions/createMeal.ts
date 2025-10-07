import { APIGatewayProxyEventV2 } from "aws-lambda";
import { parseResponse } from "../utils/parseResponse";
import { parseProtectedEvent } from "../utils/parseProtectedEvent";
import { unauthorized } from "../utils/http";
import { CreateMealsController } from "../controllers/CreateMealsController";

export async function handler(event: APIGatewayProxyEventV2) {
    try {
        const request = parseProtectedEvent(event)
        const response = await CreateMealsController.handle(request)
        return parseResponse(response) 
    } catch {
        return parseResponse(unauthorized({ error: "Invalid access token" }))
    }
}