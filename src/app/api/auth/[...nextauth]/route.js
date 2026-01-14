import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account.provider === "google") {
                try {
                    // Check if user exists
                    const existingUser = await prisma.user.findUnique({
                        where: { email: user.email },
                    });

                    if (!existingUser) {
                        // Create new customer user
                        await prisma.user.create({
                            data: {
                                name: user.name,
                                email: user.email,
                                password: "", // No password for Google users
                                role: "CUSTOMER",
                            },
                        });
                    } else {
                        // Optional: Update name or avatar if needed
                    }
                    return true;
                } catch (error) {
                    console.error("Error creating user from Google login:", error);
                    return false;
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (session.user) {
                // Fetch role from DB to ensure it's up to date
                const dbUser = await prisma.user.findUnique({
                    where: { email: session.user.email },
                    select: { id: true, role: true }
                });

                if (dbUser) {
                    session.user.id = dbUser.id;
                    session.user.role = dbUser.role;
                }
            }
            return session;
        },
    },
    pages: {
        signIn: '/login', // Redirect here if auth fails or needed
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
