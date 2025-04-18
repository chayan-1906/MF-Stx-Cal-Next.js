import bcrypt from "bcryptjs";
import {dbConnect} from "@/lib/db/index";
import OtpModel, {Otp} from "../../models/Otp";

export async function storeOtp(otp: Otp) {
    await dbConnect();
    const {email, code, codeExpiry} = otp;
    const hashedCode = await bcrypt.hash(code, 10);

    await OtpModel.deleteMany({email});

    await OtpModel.create({email, hashedOtp: hashedCode, codeExpiry});
    console.log('otp stored ✅');
}

export async function getOtp(email: string) {
    await dbConnect();
    return OtpModel.findOne({email});
}

export async function deleteOtp(email: string) {
    await dbConnect();
    await OtpModel.deleteOne({email});
    console.log('otp deleted for', email, '✅');
}
