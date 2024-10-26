// src/data/mapsAndBonuses.ts

export interface MapData {
    name: string;
    isStaged: boolean;
    bonuses: string[];
    bonusCount: number;
  }
  
  export interface MapsAndBonuses {
    totalMaps: number;
    totalLinearMaps: number;
    totalStagedMaps: number;
    totalBonuses: number;
    maps: MapData[];
  }
  
  export const mapsAndBonuses: MapsAndBonuses = {
    "totalMaps": 126,
    "totalLinearMaps": 112,
    "totalStagedMaps": 14,
    "totalBonuses": 178,
    "maps": [
      {
        "name": "surf_2pacisalive",
        "isStaged": false,
        "bonuses": [
          "surf_2pacisalive_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_3",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_666",
        "isStaged": false,
        "bonuses": [
          "surf_666_bonus1",
          "surf_666_bonus2",
          "surf_666_bonus3",
          "surf_666_bonus4",
          "surf_666_bonus5",
          "surf_666_bonus6"
        ],
        "bonusCount": 6
      },
      {
        "name": "surf_6_d",
        "isStaged": false,
        "bonuses": [
          "surf_6_d_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_abstract_final",
        "isStaged": false,
        "bonuses": [
          "surf_abstract_final_bonus2"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_ace",
        "isStaged": false,
        "bonuses": [
          "surf_ace_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_advanced",
        "isStaged": false,
        "bonuses": [
          "surf_advanced_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_adventure",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_aircontrol_ksf",
        "isStaged": false,
        "bonuses": [
          "surf_aircontrol_ksf_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_akai_final",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_andromeda",
        "isStaged": false,
        "bonuses": [
          "surf_andromeda_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_anime_fun",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_aquaflow",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_aqua_fix",
        "isStaged": false,
        "bonuses": [
          "surf_aqua_fix_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_aser",
        "isStaged": false,
        "bonuses": [
          "surf_aser_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_assail",
        "isStaged": false,
        "bonuses": [
          "surf_assail_bonus1",
          "surf_assail_bonus2",
          "surf_assail_bonus3",
          "surf_assail_bonus4"
        ],
        "bonusCount": 4
      },
      {
        "name": "surf_astra",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_atrium",
        "isStaged": false,
        "bonuses": [
          "surf_atrium_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_aura",
        "isStaged": false,
        "bonuses": [
          "surf_aura_bonus1",
          "surf_aura_bonus2",
          "surf_aura_bonus3",
          "surf_aura_bonus4",
          "surf_aura_bonus5",
          "surf_aura_bonus6",
          "surf_aura_bonus7",
          "surf_aura_bonus8"
        ],
        "bonusCount": 8
      },
      {
        "name": "surf_beginner",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_benevolent",
        "isStaged": false,
        "bonuses": [
          "surf_benevolent_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_beyond",
        "isStaged": false,
        "bonuses": [
          "surf_beyond_bonus1",
          "surf_beyond_bonus2"
        ],
        "bonusCount": 2
      },
      {
        "name": "surf_borderlands",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_borderlands_h",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_boreas",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_cannonball",
        "isStaged": false,
        "bonuses": [
          "surf_cannonball_bonus1",
          "surf_cannonball_bonus2"
        ],
        "bonusCount": 2
      },
      {
        "name": "surf_catrix",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_chasm",
        "isStaged": false,
        "bonuses": [
          "surf_chasm_bonus1",
          "surf_chasm_bonus2",
          "surf_chasm_bonus3",
          "surf_chasm_bonus4"
        ],
        "bonusCount": 4
      },
      {
        "name": "surf_cyberwave",
        "isStaged": false,
        "bonuses": [
          "surf_cyberwave_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_cyka_ksf",
        "isStaged": false,
        "bonuses": [
          "surf_cyka_ksf_bonus1",
          "surf_cyka_ksf_bonus2"
        ],
        "bonusCount": 2
      },
      {
        "name": "surf_dank",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_deathstar",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_delight",
        "isStaged": false,
        "bonuses": [
          "surf_delight_bonus1",
          "surf_delight_bonus2",
          "surf_delight_bonus3"
        ],
        "bonusCount": 3
      },
      {
        "name": "surf_dojo",
        "isStaged": false,
        "bonuses": [
          "surf_dojo_bonus1",
          "surf_dojo_bonus2",
          "surf_dojo_bonus3",
          "surf_dojo_bonus4",
          "surf_dojo_bonus5"
        ],
        "bonusCount": 5
      },
      {
        "name": "surf_driftless",
        "isStaged": false,
        "bonuses": [
          "surf_driftless_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_duggywuggy",
        "isStaged": false,
        "bonuses": [
          "surf_duggywuggy_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_easy1",
        "isStaged": false,
        "bonuses": [
          "surf_easy1_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_easy2",
        "isStaged": false,
        "bonuses": [
          "surf_easy2_bonus1",
          "surf_easy2_bonus2",
          "surf_easy2_bonus3",
          "surf_easy2_bonus4"
        ],
        "bonusCount": 4
      },
      {
        "name": "surf_elysium",
        "isStaged": false,
        "bonuses": [
          "surf_elysium_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_evo",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_ezclap",
        "isStaged": false,
        "bonuses": [
          "surf_ezclap_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_ezpz_syntax",
        "isStaged": true,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_feverdream",
        "isStaged": false,
        "bonuses": [
          "surf_feverdream_bonus1",
          "surf_feverdream_bonus2"
        ],
        "bonusCount": 2
      },
      {
        "name": "surf_fiellu",
        "isStaged": false,
        "bonuses": [
          "surf_fiellu_bonus2",
          "surf_fiellu_bonus3",
          "surf_fiellu_bonus4"
        ],
        "bonusCount": 3
      },
      {
        "name": "surf_firetemple_fixed",
        "isStaged": false,
        "bonuses": [
          "surf_firetemple_fixed_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_for_all",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_fruits",
        "isStaged": false,
        "bonuses": [
          "surf_fruits_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_galaxy_easy",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_garden",
        "isStaged": false,
        "bonuses": [
          "surf_garden_bonus1",
          "surf_garden_bonus2",
          "surf_garden_bonus3"
        ],
        "bonusCount": 3
      },
      {
        "name": "surf_giza",
        "isStaged": false,
        "bonuses": [
          "surf_giza_bonus3",
          "surf_giza_bonus4"
        ],
        "bonusCount": 2
      },
      {
        "name": "surf_glass9",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_gleam",
        "isStaged": false,
        "bonuses": [
          "surf_gleam_bonus1",
          "surf_gleam_bonus2"
        ],
        "bonusCount": 2
      },
      {
        "name": "surf_guitar_hi",
        "isStaged": false,
        "bonuses": [
          "surf_guitar_hi_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_hades",
        "isStaged": false,
        "bonuses": [
          "surf_hades_bonus1",
          "surf_hades_bonus2"
        ],
        "bonusCount": 2
      },
      {
        "name": "surf_hades2",
        "isStaged": false,
        "bonuses": [
          "surf_hades2_bonus1",
          "surf_hades2_bonus2",
          "surf_hades2_bonus4",
          "surf_hades2_bonus5"
        ],
        "bonusCount": 4
      },
      {
        "name": "surf_how2surf",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_hurrr",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_hyzer",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_iceworld",
        "isStaged": false,
        "bonuses": [
          "surf_iceworld_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_ing",
        "isStaged": false,
        "bonuses": [
          "surf_ing_bonus1",
          "surf_ing_bonus2"
        ],
        "bonusCount": 2
      },
      {
        "name": "surf_jade",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_jive",
        "isStaged": false,
        "bonuses": [
          "surf_jive_bonus1",
          "surf_jive_bonus2"
        ],
        "bonusCount": 2
      },
      {
        "name": "surf_juturna",
        "isStaged": false,
        "bonuses": [
          "surf_juturna_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_kitsune",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_kitsune2",
        "isStaged": false,
        "bonuses": [
          "surf_kitsune2_bonus1",
          "surf_kitsune2_bonus2",
          "surf_kitsune2_bonus3",
          "surf_kitsune2_bonus4"
        ],
        "bonusCount": 4
      },
      {
        "name": "surf_klue",
        "isStaged": false,
        "bonuses": [
          "surf_klue_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_leet_xl_beta7z",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_legends_lite",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_lies",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_life_of_duck_go",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_lockdown",
        "isStaged": false,
        "bonuses": [
          "surf_lockdown_bonus1",
          "surf_lockdown_bonus2"
        ],
        "bonusCount": 2
      },
      {
        "name": "surf_longreach",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_loweffort",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_lullaby",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_lux",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_me",
        "isStaged": false,
        "bonuses": [
          "surf_me_bonus1",
          "surf_me_bonus2",
          "surf_me_bonus3",
          "surf_me_bonus4"
        ],
        "bonusCount": 4
      },
      {
        "name": "surf_mellow",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_mesa_aether",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_mesa_revo",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_metrorun",
        "isStaged": false,
        "bonuses": [
          "surf_metrorun_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_mom",
        "isStaged": false,
        "bonuses": [
          "surf_mom_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_momentum",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_neon_final",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_network_2009",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_newbie",
        "isStaged": false,
        "bonuses": [
          "surf_newbie_bonus1",
          "surf_newbie_bonus2",
          "surf_newbie_bonus3"
        ],
        "bonusCount": 3
      },
      {
        "name": "surf_ninja",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_not_so_hentai",
        "isStaged": true,
        "bonuses": [
          "surf_not_so_hentai_bonus1",
          "surf_not_so_hentai_bonus2",
          "surf_not_so_hentai_bonus3"
        ],
        "bonusCount": 3
      },
      {
        "name": "surf_nova",
        "isStaged": false,
        "bonuses": [
          "surf_nova_bonus1",
          "surf_nova_bonus3"
        ],
        "bonusCount": 2
      },
      {
        "name": "surf_nyx",
        "isStaged": false,
        "bonuses": [
          "surf_nyx_bonus1",
          "surf_nyx_bonus2",
          "surf_nyx_bonus3"
        ],
        "bonusCount": 3
      },
      {
        "name": "surf_palais",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_palm",
        "isStaged": false,
        "bonuses": [
          "surf_palm_bonus1",
          "surf_palm_bonus2"
        ],
        "bonusCount": 2
      },
      {
        "name": "surf_pantheon",
        "isStaged": false,
        "bonuses": [
          "surf_pantheon_bonus1",
          "surf_pantheon_bonus2"
        ],
        "bonusCount": 2
      },
      {
        "name": "surf_paradigm",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_prelude_ksf",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_prisma",
        "isStaged": false,
        "bonuses": [
          "surf_prisma_bonus1",
          "surf_prisma_bonus2",
          "surf_prisma_bonus3"
        ],
        "bonusCount": 3
      },
      {
        "name": "surf_psycho",
        "isStaged": false,
        "bonuses": [
          "surf_psycho_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_quickie",
        "isStaged": false,
        "bonuses": [
          "surf_quickie_bonus1",
          "surf_quickie_bonus2",
          "surf_quickie_bonus3",
          "surf_quickie_bonus4",
          "surf_quickie_bonus5"
        ],
        "bonusCount": 5
      },
      {
        "name": "surf_race",
        "isStaged": false,
        "bonuses": [
          "surf_race_bonus1",
          "surf_race_bonus2",
          "surf_race_bonus3",
          "surf_race_bonus4",
          "surf_race_bonus5"
        ],
        "bonusCount": 5
      },
      {
        "name": "surf_ravine",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_rebel_scaz_gg",
        "isStaged": true,
        "bonuses": [
          "surf_rebel_scaz_gg_bonus1",
          "surf_rebel_scaz_gg_bonus2"
        ],
        "bonusCount": 2
      },
      {
        "name": "surf_reprise",
        "isStaged": false,
        "bonuses": [
          "surf_reprise_bonus1",
          "surf_reprise_bonus2"
        ],
        "bonusCount": 2
      },
      {
        "name": "surf_rgb",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_rookie",
        "isStaged": false,
        "bonuses": [
          "surf_rookie_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_salvador",
        "isStaged": true,
        "bonuses": [
          "surf_salvador_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_sandtrap2",
        "isStaged": true,
        "bonuses": [
          "surf_sandtrap2_bonus1",
          "surf_sandtrap2_bonus2",
          "surf_sandtrap2_bonus3",
          "surf_sandtrap2_bonus4"
        ],
        "bonusCount": 4
      },
      {
        "name": "surf_santorini_ksf",
        "isStaged": true,
        "bonuses": [
          "surf_santorini_ksf_bonus1",
          "surf_santorini_ksf_bonus2",
          "surf_santorini_ksf_bonus3",
          "surf_santorini_ksf_bonus4",
          "surf_santorini_ksf_bonus5"
        ],
        "bonusCount": 5
      },
      {
        "name": "surf_saturday",
        "isStaged": true,
        "bonuses": [
          "surf_saturday_bonus1",
          "surf_saturday_bonus2"
        ],
        "bonusCount": 2
      },
      {
        "name": "surf_sewers",
        "isStaged": true,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_simpsons_go_rc2_d",
        "isStaged": true,
        "bonuses": [
          "surf_simpsons_go_rc2_d_bonus1",
          "surf_simpsons_go_rc2_d_bonus2",
          "surf_simpsons_go_rc2_d_bonus3"
        ],
        "bonusCount": 3
      },
      {
        "name": "surf_sippysip",
        "isStaged": true,
        "bonuses": [
          "surf_sippysip_bonus1",
          "surf_sippysip_bonus2"
        ],
        "bonusCount": 2
      },
      {
        "name": "surf_skipalot",
        "isStaged": true,
        "bonuses": [
          "surf_skipalot_bonus1",
          "surf_skipalot_bonus3",
          "surf_skipalot_bonus4"
        ],
        "bonusCount": 3
      },
      {
        "name": "surf_slob",
        "isStaged": true,
        "bonuses": [
          "surf_slob_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_squirrelsonvacation",
        "isStaged": true,
        "bonuses": [
          "surf_squirrelsonvacation_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_subway",
        "isStaged": true,
        "bonuses": [
          "surf_subway_bonus1",
          "surf_subway_bonus2",
          "surf_subway_bonus3"
        ],
        "bonusCount": 3
      },
      {
        "name": "surf_technique",
        "isStaged": false,
        "bonuses": [
          "surf_technique_bonus1",
          "surf_technique_bonus2",
          "surf_technique_bonus3",
          "surf_technique_bonus4"
        ],
        "bonusCount": 4
      },
      {
        "name": "surf_teho_v1",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_tranquil",
        "isStaged": false,
        "bonuses": [
          "surf_tranquil_bonus1",
          "surf_tranquil_bonus2",
          "surf_tranquil_bonus3"
        ],
        "bonusCount": 3
      },
      {
        "name": "surf_trazhtec",
        "isStaged": false,
        "bonuses": [
          "surf_trazhtec_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_tunnelescape_zts",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_utopia_njv",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_volvic",
        "isStaged": false,
        "bonuses": [
          "surf_volvic_bonus1",
          "surf_volvic_bonus2"
        ],
        "bonusCount": 2
      },
      {
        "name": "surf_watertemple",
        "isStaged": false,
        "bonuses": [
          "surf_watertemple_bonus1",
          "surf_watertemple_bonus2"
        ],
        "bonusCount": 2
      },
      {
        "name": "surf_waterworks",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_whatever",
        "isStaged": false,
        "bonuses": [],
        "bonusCount": 0
      },
      {
        "name": "surf_whiteout",
        "isStaged": false,
        "bonuses": [
          "surf_whiteout_bonus1"
        ],
        "bonusCount": 1
      },
      {
        "name": "surf_zeitgeist",
        "isStaged": false,
        "bonuses": [
          "surf_zeitgeist_bonus1",
          "surf_zeitgeist_bonus2",
          "surf_zeitgeist_bonus3",
          "surf_zeitgeist_bonus4"
        ],
        "bonusCount": 4
      }
    ]
  };
  