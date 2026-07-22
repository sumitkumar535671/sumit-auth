import { serial,integer, pgTable, varchar,boolean,text,timestamp } from "drizzle-orm/pg-core";


export const users = pgTable("users",{
    id:serial("id").primaryKey(),

    firstName:varchar("first_name",{length:322}).notNull(),
    lastName:varchar("last_name"),

    profileImageURL:text("profile_image_url"),

    email:varchar("email",{length:255}).notNull().unique(),
    emailVerified:boolean("email_verified").default(false),

    passwordHash:varchar("password_hash").notNull(),

    deletedAt:timestamp("deleted_at"),
    createdAt:timestamp("created_at").defaultNow().notNull(),
    updatedAt:timestamp("updated_at").defaultNow().$onUpdate(()=>new Date()).notNull()

});


export const clients = pgTable("clients",{
    id:serial("id").primaryKey(),

    name:varchar("name",{length:55}).notNull(),

    clientId:varchar("client_id").notNull().unique(),
    clientSecretHash:varchar("client_secret_hash",{length:255}),

    redirectUris:text("redirect_uris").array().notNull(),
    allowedScopes:text("allowed_scopes").array().notNull(),

    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});


export const authorizationCode = pgTable("authorization_code",{
    code:varchar("code",{length:255}).primaryKey(),

    userId:integer("user_id").references(()=> users.id, {onDelete:"cascade"}).notNull(),
    clientId:integer("client_id").notNull().references(()=> clients.id,{onDelete:"cascade"}),
    
    redirectUri:text("redirect_uri").notNull(),
    scopes:text("scopes").array().notNull(),

    expiresAt:timestamp("expires_at").notNull(),
    createdAt:timestamp("created_at").defaultNow().notNull()
});


export const refreshToken = pgTable("refresh_token",{
    id:serial("id").primaryKey(),

    tokenHash:varchar("token_hash").notNull().unique(),
    userId:integer("user_id").notNull().references(()=>users.id,{onDelete:"cascade"}),
    clientId:integer("client_id").notNull().references(()=>clients.id,{onDelete:"cascade"}),

    grantedScopes:text("granted_scopes").array().notNull(),

    expiresAt: timestamp("expires_at").notNull(),
    revokedAt: timestamp("revoked_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});


export const authSessions = pgTable("auth_sessions",{
    id:serial("id").primaryKey(),

    sessionTokenHash:varchar("session_token_hash").notNull().unique(),

    userId:integer("user_id").notNull().references(()=>users.id,{onDelete:"cascade"}),

    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});



