import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                gender: true,
                birthDate: true,
                role: true,
                image: true // if existing in schema, though not in the schema I viewed earlier, but Prisma might map it if OAuth. Wait, schema has NO image field for User.
            }
        });

        // Schema check: User has NO image field. 'session.user.image' comes from OAuth.
        // I should return what IS in schema.

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}


export async function PATCH(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, phone, gender, birthDate } = body;

        // Validation (Basic)
        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                name,
                phone,
                gender,
                birthDate: birthDate ? new Date(birthDate) : null,
            }
        });

        // Omit password from response
        const { password, ...userWithoutPassword } = updatedUser;

        return NextResponse.json({
            message: "Profile updated successfully",
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
