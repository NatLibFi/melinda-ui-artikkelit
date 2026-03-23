// This list contains everything from
// https://wiki.eduuni.fi/display/cscsuorat/7.1+Korkeakoulujen+oppilaitosnumerot+2024
// and some value from
// https://wiki.eduuni.fi/display/cscsuorat/7.6+Tutkimuslaitosten+ja+yliopistollisten+sairaaloiden+organisaatiotunnukset+2024 .
//
// I reckon that tutkimuslaitos will ask if they want to be listed here.
// Thus I check and keep the existing ones, but won't add new ones.
// Latest update: 2024-10-03 (NV). We should do this annually...
//
// If a listed organisation ceases operations, then
// - comment it (don't remove),
// - try to find it's successor


export const organizations = [
  {value: 'Aalto yliopisto', text: '', code: '10076'}, // 2024
  {value: 'Centria-ammattikorkeakoulu', text: '', code: '02536'}, // 2024
  {value: 'Diakonia-ammattikorkeakoulu', text: '', code: '02623'}, // 2024
  {value: 'Geologian tutkimuskeskus', text: '', code: '5040011'}, // 2024
  {value: 'Haaga-Helia ammattikorkeakoulu', text: '', code: '10056'}, // 2024
  {value: 'Helsingin seudun yliopistollisen keskussairaalan erityisvastuualue', text: '', code: '15675350'}, // 2024
  {value: 'Helsingin yliopisto', text: '', code: '01901'}, // 2024
  {value: 'Humanistinen ammattikorkeakoulu', text: '', code: '02631'}, // 2024
  {value: 'Hämeen ammattikorkeakoulu', text: '', code: '02467'}, // 2024
  {value: 'Ilmatieteen laitos', text: '', code: '4940015'}, // 2024
  {value: 'Itä-Suomen yliopisto', text: '', code: '10088'}, // 2024
  {value: 'Jyväskylän ammattikorkeakoulu', text: '', code: '02504'}, // 2024
  {value: 'Jyväskylän yliopisto', text: '', code: '01906'}, // 2024
  {value: 'Kaakkois-Suomen ammattikorkeakoulu', text: '', code: '10118'}, // 2024
  {value: 'Kajaanin ammattikorkeakoulu', text: '', code: '02473'}, // 2024
  {value: 'Karelia-ammattikorkeakoulu', text: '', code: '02469'}, // 2024
  {value: 'Kuopion yliopistollisen sairaalan erityisvastuualue', text: '', code: '01714953'}, // 2024
  {value: 'LAB-ammattikorkeakoulu', text: '', code: '10126'}, // 2024
  // {value: 'Lahden ammattikorkeakoulu', text: '', code: '02470'}, // No longer exists
  {value: 'Lapin ammattikorkeakoulu', text: '', code: '10108'}, // 2024
  {value: 'Lapin yliopisto', text: '', code: '01918'}, // 2024
  {value: 'Lappeenrannan-Lahden teknillinen yliopisto LUT', text: '', code: '01914'}, // 2024
  {value: 'Laurea-ammattikorkeakoulu', text: '', code: '02629'}, // 2024
  {value: 'Luonnonvarakeskus', text: '', code: '4100010'}, // 2024
  {value: 'Lääkealan turvallisuus- ja kehittämiskeskus', text: '', code: '558005'}, // 2024
  {value: 'Maanmittauslaitos', text: '', code: '4020217'}, // 2024
  {value: 'Maanpuolustuskorkeakoulu', text: '', code: '02358' }, // found from interner 2026-01-29 https://koodistot.suomi.fi/code;registryCode=fairdata;schemeCode=organization;codeCode=02358
  {value: 'Metropolia ammattikorkeakoulu', text: '', code: '10065'}, // 2024
  {value: 'Oulun ammattikorkeakoulu', text: '', code: '02471'}, // 2024
  {value: 'Oulun yliopisto', text: '', code: '01904'}, // 2024
  {value: 'Oulun yliopistollisen sairaalan erityisvastuualue', text: '', code: '06794809'}, // 2024
  {value: 'Poliisiammattikorkeakoulu', text: '', code: '02557'}, // 2024
  {value: 'Ruokavirasto', text: '', code: '430001'}, // 2024
  // {value: 'Saimaan ammattikorkeakoulu', text: '', code: '02609'}, // No longer exists
  {value: 'Satakunnan ammattikorkeakoulu', text: '', code: '02507'}, // 2024
  {value: 'Savonia-ammattikorkeakoulu', text: '', code: '02537'}, // 2024
  {value: 'Seinäjoen ammattikorkeakoulu', text: '', code: '02472'}, // 2024
  {value: 'Suomen Pankki', text: '', code: '02022481'}, // 2024
  {value: 'Suomen ympäristökeskus', text: '', code: '7020017'}, // 2024
  {value: 'Svenska handelshögskolan', text: '', code: '01910'}, // 2024
  {value: 'Säteilyturvakeskus', text: '', code: '5550012'}, // 2024
  {value: 'Taideyliopisto', text: '', code: '10103'}, // 2024
  {value: 'Tampereen ammattikorkeakoulu', text: '', code: '02630'}, // 2024
    // {value: 'Tampereen teknillinen yliopisto', text: '', code: '01915'}, // No longer exists
  {value: 'Tampereen yliopisto', text: '', code: '10122'}, // 2024 (Old TY had different code)
  // {value: 'Tampereen yliopisto', text: '', code: '01905'}, // Ye olde code)
  {value: 'Tampereen yliopistollisen sairaalan erityisvastuualue', text: '', code: '08265978'}, // 2024
  {value: 'Teknologian tutkimuskeskus VTT Oy', text: '', code: '26473754'}, // 2024
  {value: 'Terveyden ja hyvinvoinnin laitos', text: '', code: '5610017'}, // 2024
  {value: 'Turun ammattikorkeakoulu', text: '', code: '02509'}, // 2024
  {value: 'Turun yliopisto', text: '', code: '10089'}, // 2024
  {value: 'Turun yliopistollisen keskussairaalan erityisvastuualue', text: '', code: '08282559'}, // 2024
  {value: 'Työterveyslaitos', text: '', code: '02202669'}, // 2024
  {value: 'Ulkopoliittinen instituutti', text: '', code: '1120017'}, // 2024
  {value: 'Vaasan ammattikorkeakoulu', text: '', code: '02627'}, // 2024
  {value: 'Vaasan yliopisto  ', text: '', code: '01913'}, // 2024
  {value: 'Valtion taloudellinen tutkimuskeskus', text: '', code: '3060016'}, // 2024
  {value: 'Yrkeshögskolan Arcada', text: '', code: '02535'}, // 2024
  {value: 'Yrkeshögskolan Novia', text: '', code: '10066'}, // 2024
  {value: 'Åbo Akademi', text: '', code: '01903'}, // 2024
];
