'use server';

import routes from "@/lib/routes";
import {signIn, signOut} from "@/auth";

const Providers = {Google: 'google', GitHub: 'github', Facebook: 'facebook'} as const;
type Provider = (typeof Providers)[keyof typeof Providers];
const validProviders = new Set<Provider>(Object.values(Providers));

export async function doSocialLogin(formData: FormData): Promise<void> {
    const action = formData.get('action');
    console.log(action);
    if (typeof action === 'string' && validProviders.has(action as Provider)) {
        await signIn(action as Provider, {redirectTo: routes.homePath()});
    } else {
        console.error('Invalid or missing action:', action);
        throw new Error('Invalid authentication provider');
    }
}

export async function doLogout() {
    await signOut({redirectTo: routes.loginPath()});
}
