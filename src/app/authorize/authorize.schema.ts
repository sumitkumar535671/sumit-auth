//clientId, redirectUri, scope, state, response_type

import { z } from "zod";

export const getSchema = z.object({
    query:z.strictObject({
        client_id:z.string({
                error: (issue) =>
                    issue.input === undefined
                        ? "Client ID is required"
                        : "Client ID must be a string",
            }).min(1, "Client ID is required"),
        redirect_uri:z
            .url({
                error: (issue) =>
                    issue.input === undefined
                        ? "Redirect URI is required"
                        : "Redirect URI must be a valid URI",
            })
            .min(1, "Redirect URI is required"),
        scope:z
            .string({
                error: (issue) =>
                    issue.input === undefined
                        ? "Scope(s) are required"
                        : "Scope must be a string",
            })
            .min(1, "Scope(s) are required"), // Batata hai ki client application kis permission ki request kar rahi hai
        response_type:z.enum(["code"], {
            error: (issue) =>
                issue.input === undefined
                    ? "Response Type is required"
                    : `Response Type must be "code"`,
        }), //Batata hai Authorization Server ko ki client kis type ka response chahti hai.
        state:z
            .string({
                error: (issue) =>
                    issue.input === undefined
                        ? "State is required"
                        : "State must be a string",
            })
            .min(1, "State is required") //CSRF (Cross-Site Request Forgery) attack se bachana
    })
})


export type GetType = z.infer<typeof getSchema>;

export const createSchema = z.object({
    body:getSchema.shape.query.extend({}),
});

export type CreateType = z.infer<typeof createSchema>;