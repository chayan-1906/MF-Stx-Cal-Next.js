import {NextResponse} from "next/server";
import {sendVerificationEmail} from "@/lib/email";

export async function POST(request: Request) {
    await sendVerificationEmail('chayan19062000@gmail.com', '1234567890');
    return NextResponse.json({});
}
