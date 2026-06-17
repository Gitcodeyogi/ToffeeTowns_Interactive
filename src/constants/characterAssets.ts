import { getAssetUrl } from '../utils/getAssetUrl';

export const CHARACTER_IMAGES = {
    bosses: {
        pompelmoose: getAssetUrl('/characters/Boss_Mayor_Pompelmooose.png'),
        stefon: getAssetUrl('/characters/Boss_Dr. Stefon_Fossoway.png'),
        grimshade: getAssetUrl('/characters/Boss_Madam_Grimshade.png'),
        stautwood: getAssetUrl('/characters/Boss_Sheriff_Stautwood.png'),
        bumblewood: getAssetUrl('/characters/Boss_Sheriff_Stautwood.png'),
        dottie: getAssetUrl('/characters/Boss_Dottie_Ticktockwell.png'),
        matron: getAssetUrl('/characters/mojo/boss_matron.png'),
        chief: getAssetUrl('/characters/mojo/boss_chief.png'),
        cop: getAssetUrl('/characters/mojo/boss_cop.png'),
    },
    rebels: {
        whiskerton: getAssetUrl('/characters/Rebel_Mastermind_Whiskerton.png'),
        chucklebop: getAssetUrl('/characters/Rebel_Archer_ChuckleBop.png'),
        chucklebop_alt: getAssetUrl('/characters/Rebel_Archer_Chucklebop1.png'),
        whimsley: getAssetUrl('/characters/Rebel_Fisherman_Whimsley.png'),
        tibbin: getAssetUrl('/characters/Rebel_Tibbin_Quickstep.png'),
        nella: getAssetUrl('/characters/Rebel_Nella_Nudgepot.png'),
        lanternella: getAssetUrl('/characters/Rebel_Lanternella Glowfen.png'),
        bounce: getAssetUrl('/characters/mojo/rebel_baker.png'),
        petalworth: getAssetUrl('/characters/Rebel_Madam petalworth.png'),
        timber: getAssetUrl('/characters/mojo/rebel_lumberjack.png'),
        beni: getAssetUrl('/characters/mojo/rebel_lumberjack.png'), // Fallback
        greta: getAssetUrl('/characters/Rebel_Tibbin_Quickstep.png'), // Fallback
        merriweather: getAssetUrl('/characters/mojo/rebel_baker.png'), // Fallback
    },
    townheads: {
        bramwell: getAssetUrl('/characters/Nutwood/HazelnutTerrace-Townhead-Bramwell_Nutgrove.png'),
        seren: getAssetUrl('/characters/Nutwood/NougatNode-TownHead_Serene_Nougarde.png'),
        garrick: getAssetUrl('/characters/Nutwood/PeanutButterFalls-Townhead_Garrick_Butterwell.png'),
        roland: getAssetUrl('/characters/Nutwood/PralinePort-Townhead_Roland_Prailer.png'),
    },
    heroes: {} as Record<string, string>
};
