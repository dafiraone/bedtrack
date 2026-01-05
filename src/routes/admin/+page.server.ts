import { getBedData } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const beds = await getBedData();
    return { beds };
};