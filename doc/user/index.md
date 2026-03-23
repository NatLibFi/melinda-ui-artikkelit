# Artikkelien kuvailutyökalu

Artikkelien syöttölomake on tarkoitettu kotimaisten aikakauslehti- ja monografia-artikkelien lisäämiseen Melindan osana olevaan Artoon. (Vuoteen 2020 asti Arto oli oma erillinen Voyager-kirjastojärjestelmää käyttänyt tietovaranto.) [Lisätietoja Artoon tulevista artikkeleista](https://www.kiwi.fi/pages/viewpage.action?pageId=159941634).

Kuvailutyökalu toimii verkkoselaimella. Työkalun testauksessa on käytetty Chromea, mutta se toiminee myös muidenkin selaimien uudehkoilla versioilla.

## Käyttöohjeen historia

| Ohjeen versio | Aikaleima (tekijä) | Kommentti |
| ---           | ---                | ---   |
| 0.1           | 2024-09-30 (NV)    | Ensimmäinen versio ohjeesta  |
| 0.2           | 2024-10-08 (NV)    | Täydennyksiä |
| 0.3           | 2024-12-19 (NV)    | v.1.0.9 |
| 1.0           | 2025-02-14 (NV)    | v.1.1.0 |
| 1.1           | 2025-04-28 (NV)    | v.1.1.1 |
 
## Taustaa

Tässä ohjeessa esiteltävä Artikkelien kuvailutyökalu on kirjoitettu Kansalliskirjastossa 2023-2025. Tämä työkalu korvaa aiemman Artikkelitietovaranto (ARTIVA) -hankkeessa vuosina 2013-2014 tehdyn aiemman kuvailutyökalun.

Artikkeliviitteiden tiedontuottajaksi voivat tulla mitkä tahansa kirjastot, kotimaiset (tiede)kustantajat tai tieteelliset seurat, jotka haluavat oman alansa, aihepiirinsä tai omien julkaisujensa artikkelitiedot paremmin löydettäviksi. Tallentajien kanssa solmitaan erillinen sopimus, ellei organisaatio ole allekirjoittanut varsinaista Melindan palvelusopimusta.

- Palaute ja kysymykset: melinda-posti[at]helsinki.fi
- Tunnukset kuvailutyökaluun ja palveluehdot
  - Melindassa mukana olevien organisaatioiden kuvailijat saavat tunnukset oman kirjastonsa pääkäyttäjältä/Melinda-yhteyshenkilöltä. Melindan palvelusopimus kattaa myös Artikkelien kuvailutyökalun käytön.
  - Muiden organisaatioiden täytyy allekirjoittaa [Artikkelien kuvailutyökalu -palvelun palveluehdot](https://www.kiwi.fi/pages/viewpage.action?pageId=164168715), minkä jälkeen tunnuksien jakelusta sovitaan erikseen sähköpostitse. Jos organisaatiossa tai yhteenliittymässä on vain vähän tallentajia, Kansalliskirjasto toimittaa tunnukset. Jos tallentajia on useita, organisaatiolla voi olla pääkäyttäjä, joka huolehtii tunnusten jakelusta.
  - Lisätietoa: melinda-posti[at]helsinki.fi
- [Salasanan vaihtaminen](https://www.kiwi.fi/display/melinda/Salasanan+vaihtaminen)
- [Artikkelien kuvailutyökalulla tallennettavat artikkelit](https://www.kiwi.fi/pages/viewpage.action?pageId=159941634) (sisältökriteerit)
- [Artikkeliviitteiden hyödyntäminen julkaisutiedonkeruussa](https://www.kiwi.fi/pages/viewpage.action?pageId=299794443)
- [Usein kysyttyä - Artikkelien kuvailutyökalu](https://www.kiwi.fi/pages/viewpage.action?pageId=155648846)
- [Postituslista Artikkelien kuvailutyökalun käyttäjille (arto-list)](#postituslista)


# Käyttöohje

## Kirjautuminen

Palvelu sijaitsee osoitteessa [https://artikkelit.melinda.kansalliskirjasto.fi/](https://artikkelit.melinda.kansalliskirjasto.fi/). Kirjautumiseen tarvitaan [Melinda-tunnukset](https://www.kiwi.fi/display/melinda/Melinda-tunnukset). Käyttäjätunnuksen ja salasanan syöttämisen lisäksi käyttäjän on hyväksyttävä tietosuojaseloste ja evästeiden käyttö. Onnistuneen kirjautumisen jälkeen päästään varsinaiseen syöttölomakkeeseen.


## Uuden artikkelin tietojen syöttäminen


Tässä luvussa kuvataan artikkelin luomista syöttölomakkeen avulla. Ohjeet on kirjoitettu samassa järjestyksessä kuin miten asiat on järjestetty lomakkeessa. Lomaketta voi yleensä täydentää haluamassa järjestyksessä, mutta kohta "Kuvailun kohde" olisi hyvä tehdä ensimmäisenä. Alaluvuissa kuvataan kunkin osion käyttöä.

Järjestelmä kertoo lomakkeen ylälaidassa keskeneräisistä asioista. Lomakkeen oikealla puolella (jos selainikkuna on tarpeeksi suuri) tai alla näkyy luotava tietue senhenkisillä tiedoilla täytettynä. Käyttäjän tekemät lisäykset näkyvät heti tietueessa.

[Melindaan suositellaan tallennettavaksi sellaisia artikkeliviitteitä, joilla on riittävästi informaatioarvoa](https://www.kiwi.fi/pages/viewpage.action?pageId=159941634).

### Kuvailun kohde

Ensin valitaan onko kuvailun kohde lehtiartikkeli vai artikkeli kokoomateoksessa. Valinta vaikuttaa julkaisun tietojen hakuun; lehtiartikkeleita voi hakea ISSN:llä ja kokoomateoksia ISBN:llä. Lisäksi valinta määrittää luotavan tietueen bibliografisen tason (LDR/07)

### Julkaisun tiedot

Tässä kohdassa haetaan Melindasta emotietue eli lehti tai kirja, jossa artikkeli on ilmestynyt. Hakutyyppejä emotietueen löytämiseksi on neljä: ISSN (lehtiartikkeleille), ISBN (kokoomateoksille), nimeke ja Melinda-ID. Huomaa, että nimekehaku voi kestää pitkään, joten kannattaa suosia ISSN- ja ISBN-hakuja, jos ko. numero on tiedossa.

Haun voi rajata Artoon, Artoon + Fennicaan tai Artoon + Fennicaan + Melindaan. Jos haussa tulee tuplia halutusta julkaisusta, niin suositeltu valintajärjestys on Fennican emo, Arton emo ja jokin muu Melindassa oleva emo. Jos Fennicaan tai Artoon kuulumattomia emovaihtoehtoja on useampia, niin kannattaa valita se, jolla on eniten poikasia tai parhaiten luetteloitu.

Voyager-Artosta Melindaan siirretyt emotietueet olivat usein minimalistisia, ja niiden metadatapuutteiden takia ne eivät aina yhdistyneet muihin tietueisiin, vaan muodostivat uusia tietueita samasta teoksesta eli ns. tuplia Melindaan. Tämän takia monilla tietueilla Arton ja Fennican emotietueet ovat erillään toisistaan.

Kenttään Haku syötetään varsinainen haun rajausten mukainen hakuteksti, ja painetaan kentän vieressä olevaan suurennuslasin kuvaa. Tämän jälkeen järjestelmä hakee soveltuvat tietueet Melindasta, ja käyttäjä voi valita listasta oikean emotietueen. Mikäli lehteä tai kokoomateosta ei löydy haulla, Melinda-kirjastojen tallentajat voivat lisätä sen Melindaan. Pelkkää Artikkelien kuvailutyökalua käyttävät voivat ilmoittaa puuttuvista lehdistä/kokoomateoksista Melinda-palvelupostiin, jolloin ne lisätään Kansalliskirjastossa.

Emotietueen tietoja käytetään luotavassa tietueessa, esimerkiksi julkaisumaa (008/15-17) ja oletusjulkaisukieli (008/35-37 ja 041\$a) otetaan emotietueesta. Samaten 
emotietueen tietoista johdetaan luotavan osakohdetietueen kentässä 773 usean osakentän arvo.

Jos julkaisu on elektroninen aineisto, niin luotavan tietueen 008/23 saa arvon 'o' (verkkoaineisto).

Aiemmassa artikkelien kuvailutyökalun versiossa emotietueesta haettiin artikkelitietueen kenttään 593 artikkelin ns. JuFo-luokitus. Tämä on nyt kytketty pois käytöstä, koska tieto puuttuu useimmista emoista, eikä ollut aina luotettava; esim. luokitus saattaa muuttua vuosittain.

### Artikkelin tiedot

Tässä kohtaa kysytään seuraavia tietoja artikkelista:

| Artikkelin tieto           | Kuvaus |
| ---                        | ---    |
| Nimeke                     | Pakollinen tieto. Luotavan tietueen 245\$a |
| Alanimeke                  | 245\$b |
| Vastuullisuusmerkinnöt     | 245\$c. Vastuullisuusmerkintöön tekijöiden nimet kirjoitetaan niin kuin ne on artikkelissa ilmaistu |
| Vuosi                      | Julkaisuvuosi. 008/07-10, osa 773\$g:tä. Vain lehtiartikkelit, kokoomateosten 008/07-10 tulee emojulkaisusta. Pakollinen tieto. |
| Vol.                       | Vuosikerta eli volyymi. Vain lehtiartikkelit. Optionaalinen. Osa 773\$g:tä |
| Sivut                      | Osa 773\$g:tä.  |
| Kieli                      | 008/35-37, 041\$a, tässä kohtaa voi ohittaa emosta tulevan oletuskielen. Saamelaiskielistä talletetaan yleiskoodi 'smi' 008/35-37:ään ja 041\$a:han. Varsinainen kielikoodi (esim. koltansaamella 'smi') tulee toiseksi \$a-osakentäksi samaan 041-kenttään. |
| Linkki kokotekstiin        | 856\$u. Optionaalinen tieto. Kenttiä voi lisätä useita. Käytä pysyviä tunnisteitä (URN, DOI jne.), jos mahdollista. |
| [Artikkelin tyyppi](https://www.kiwi.fi/pages/viewpage.action?pageId=436076877) | 591\$d |
| Osasto tai toistuva palsta | Vain lehtiartikkelit. 490\$a |
| CC-lisenssi                | Kenttä 540. Dropdown-menu on valittavissa vain elektronisille artikkeleille |

### Tekijätiedot

Ensin valitaan tekijätyyppi, eli onko lisättävä tekijä henkilö, yhteisö vai tuleeko tieto Asterista (Asterista saa henkilöitä, yhteisöjä ja jopa X11-kenttiin kokouksia) ja syötetään tekijän nimitiedot: Henkilölle lisätään suku- ja etunimi, yhteisölle nimi.

Lisäksi tekijälle annetaan jokin rooli pudotusvalikosta. Vaihtoehdot ovat nykyisellään kirjoittaja, kuvittaja, kääntäjä, toimittaja ja määrittelemätön. Jos rooliksi valitaan määrittelemätön, ei tekijäkenttään muodosteta \$e-osakenttää.

Jos tekijälle halutaan antaa useampia rooleja, niin sama tekijä pitää lisätä eri rooleissa. Järjestelmä osaa yhdistää nämä tiedot yhteen ja samaan kenttään eri $e-osakentiksi.

Ensimmäisenä syötetty kirjoittaja tallennetaan 1XX-kenttään, tyypillisesti 100-kenttään. (Ei tarvitse olla ensimmäinen lisätty tekijä.)

Lisäksi tekijälle voi halutessaan lisätä organisaation (\$u ja \$g). Lisättävänä organisaationa käytetään artikkelissa mainittua affiliaatiota.

Jos lisäät tekijän Asterista, varmista että tekijä on todellakin Asteriin talletettu henkilö/yhteisö eikä täysnimikaima!

### Arvostellun teoksen tiedot

Arvostellun teoksen voi hakea Melindasta nimekkeen, ISSN:n tai melinda-id:n perusteella. Haku toimii kutakuinkin samoin kuin Julkaisun tiedot -kohdan haku. Valitut hakutulokset lisätään 787-kentiksi.

Tulossa: myöhemmin lomakkeella voi lisätä myös arvostelun kohteita, jotka eivät löydy Melindasta.

### Tieteenalat ja metodologiat

Tässä kohdassa voi lisätä tietueeseen kenttiä tieteenalalle ja metodologialle.

Tieteenala on dropdown-menu, jonka arvo tallettuu kentän 591 osakenttiin \$h ja \$i. Kenttää ei kuitenkaan generoida, ellei kohdassa "Artikkelin tiedot" on määritetty artikkelin tyyppi (joka puolestaan tallentuu kohtaan 591\$d). Menun vaihtoehdot perustuvat tieteenalaluokitukseen 2010 ([vuoden 2024 versio](https://wiki.eduuni.fi/display/cscsuorat/7.3+Tieteenalaluokitus+2024)).

Metodologia on vapaasana-kenttä, ja sen arvo talletetaan kenttään 567.

### Tiivistelmän tiedot

Tässä kohdassa voi lisätä tietueelle yhden tai useamman tiivistelmän tai abstraktin kenttään 520. Jos abstraktille on määritetty kieli, se talletaan 040\$b-kenttään.

Tällä hetkellä tiivistelmän maksimipituus on 2000 merkkiä. Kokoa saatetaan tulevaisuudessa kasvattaa. Tällä hetkellä ei ole mahdollista tallettaa abstraktin kieltä ilman abstraktia. (Pitkän abstraktin pilkkomista useaan kenttään $8-osakentän avulla pohditaan.)

### Asia- ja avainsanat


Tässä kohdassa käyttäjä voi lisätä 6XX-kenttiä tietueeseen.

Kohdasta "Tyyppi" valitaan sanasto, josta nimeä tai asiasanaa haetaan. Alla olevaan taulukkoon on listattu tuetut sanastot. Mukana on myös neljä muu-alkuista luokkaa sanaston ulkopuolisille asiasanoille:

| SANASTO                 | KENTTÄ   | KUVAUS |
| ---                     | ---      | --- |
| yso, allfo              | 650      | Yleinen suomalainen ontologia |
| yso-paikat, allfo-orter | 651      | lorum ipsum |
| yso-aika, allfo-tid     | 648      | lorum ipsum |
| kanto                   | 600, 610 | Henkilöt menevät 600-kenttään ja yhteisöt 610-kenttään |
| slm, fgf                | 655      | lorum ipsum |
| afo                     | 650      | Preferoi ysoa, jos mahdollista |
| kassu                   | 650      | Preferoi ysoa, jos mahdollista |
| koko                    | 650      | Preferoi ysoa, jos mahdollista |
| finmesh                 | 650      | Preferoi ysoa, jos mahdollista |
| mesh                    | 650      | Englanninkielinen lääketieteen asiasanasto. Käyttäisin vain, jos artikkeli on kansainvälisesti relevantti |
| mao/tao                 | 650      | Preferoi ysoa, jos mahdollista |
| muu                     | 653      | Vain sanastoihin kuulumattomille |
| muu - henkilö           | 600      | Vain Kantoon kuulumattomille nimille |
| muu - yhteisö           | 610      | Vain Kantoon kuulumattomille nimille |
| muu - aikamääre         | 648      | Vain yso-aikaan kuulumattomille ajanjaksoille, ml. yksittäiset vuosiluvut |

Sanaston valinnan jälkeen kirjoita Haku-kohtaan hakemasi termi tai osa siitä ja paina suurennuslasin kuvaa. Tuloslistaan tulevat osumat (max. 100), joista voit valita haluamasi termin ja siirtää sen tietueeseen painamalla plus-merkkiä.

Lisättyjen asiasanojen perässä on roskakorin kuva, jota painamalla asiasanan saa poistettua tietueesta.

Huomaa, että Melinda kääntää automaattisesti yso- ja slm-termit suomen ja ruotsin välillä noin puolentoista vuorokauden viiveellä, eli riittää, että asiasana lisätään vain toisella kielistä.

### Poimintatiedot

Tänne pystyy syöttämään tietoja 598- ja 599-kenttiin. Kentät on tarkoitettu erikseen sovitun poimintakoodin tallentamista varten, jos viitteitä halutaan esim. myöhemmin poimia johonkin toiseen tietokantaan. Poimintakoodikenttään on niin sovittaessa mahdollista tallentaa esim. aikaisemmin 995-kenttään tallennettu tiedontuottajatunnus.

Kentät ovat Arto-spesifejä, joten niihin tulee Melindassa osakenttä \$5 arvolla "ARTO" estämään kentän sisällön replikoitumisen Melindasta paikalliskantoihin.

### Lisäkentät

Tänne on koottu sekalaisia ei-pakollisia kenttiä. Kuvaus ja marc-kenttä näkyvät lomakkeessa. Toimintalogiikka on samantyylinen kuin aiemmin.

| LISÄKENTTÄ | MARC | KUVAUS |
| ---        | ---  | ---      |
| Yleinen huomautus | 500\$a | Vapaamuotoinen artikkeliin liittyvä huomautus. |
| Muu nimeke         | 246\$a | Nimekkeen vaihtoehtoinen muoto tai nimekkeen käännös, jos sellainen on merkitty esim. artikkeliin, artikkelin tiivistelmään tai lehden sisällysluetteloon. |
| UDK-luokitus | 080\$a\$x\$2 | .... |
| Muu luokitus | 084\$a\$2 | Jos \$a syötetään, niin myös luokituksen lähde \$2 on pakollinen. Melindassa \$2 on tyypillisesti [ykl](https://finto.fi/ykl/fi/)[^6] |

## Tietueen tallennus Melindaan

Lomakkeeseen syöttyjen tietojen perusteella www-sivulle generoidaan luotava osakohdetietue. Jokainen muutos päivittää luotavan tietue saman tien, joten käyttäjän on helppo hahmottaa mikä muutos vaikuttaa mihinkin marc-kenttään. Lomakkeessa annettujen tietojen lisäksi tietueeseen generoituu luotavaan artikkeliin (ja tarvittaessa myös emojulkaisuun) kenttä

~~~
960 ## $a ARTO
~~~

Jos järjestelmä ei löydä virheitä tai puutteita lomakkeessa, niin käyttäjä voi tarkistuttaa tietueen Melindan taustajärjestelmässä, Alephissa painamalla Tarkista-nappia. Jos taustajärjestelmä kelpuuttaa tietueen, Tallenna-nappi muuttuu harmaasta aktiiviseksi, ja käyttäjä voi tallentaa tietueen.

Tallennuksen jälkeen käyttäjä saa tiedon tallennuksen onnistumisesta, ja linkin luotuun tietueeseen Melindassa. Artikkelien kuvailutyökalulla tallennetut viitteet ovat heti haettavissa Melindassa. Finnassa uudet viitteet ja viitteisiin tehdyt muutokset näkyvät pienellä viiveellä.

Tallennuksen jälkeen käyttäjä voi halutessaan aloittaa seuraavan artikkelin tallennuksen, tai vaikkapa kirjautua ulos järjestelmästä.


## Editori

Artikkelien kuvailutyökalun yhteyteen on liitetty tietue-editori vuoden 2025 kevää llä. Editori mahdollistaa Melindaan jo talletettujen Arto-tietueiden pienimuotoisen editoinnin. Muut tietueet avataan read-only-tilassa, eli niitä pääsee katsomaan, muttei editoimaan. Jos luetteloijalla on pääsy Alephin omaan luettelointiohjelmaan, niin suosittelemme käyttämään sitä.

Editorin voi aktivoida tietue-editori-tabin kautta tai tekemällä ensin tietue syöttölomakkeella, ja sen jälkeen avaamalla tallennettu tietue "Muokkaa tietuetta"-napin avulla. Editorissa voi avata uuden tietueen syöttämällä halutun tietueen Melinda ID. Työkalu ei kuitenkaan anna editoida kuin Arto-kokoelmaan (eli tietueisiin, joissa on kenttä 960 $a ARTO) kuuluvia tietueita. Lomakkeen kautta lisätyissä tietueissa kenttä 960 on automaattisesti.

Editori mahdollistaa vain tiettyjen jo tietueessa olevien kenttien lisäämisen. Käyttäjä ei esimerkiksi pysty poistamaan tietueessa jo olevaa 960-kenttää. Käyttäjä voi kuitenkin lisätä uuden 960-kentän. Huomaa, että uusikin kenttä lukkiutuu tallennuksen jälkeen read-only-tilaan.

Editorissa voi olla auki vain yksi tietue kerrallaan. Jos avaat tietueen, niin aiemmin auki olleet tietueen tiedot poistuvat, ja mahdollinen tallentamattomat muutokset menetetään! Toistaiseksi ohjelma ei varoita tästä.




### Tietueen editoiminen

Editori on käytännössä joukko tekstirivejä. Kukin rivi esittää yhtä marc-kenttää: kolme ensimmäistä merkkiä kertovat kenttäkoodin, kaksi seuraavaa ovat indikaattoreita (kontrollikentillä tässä on tyhjää), ja loput dataa. Osa kentistä on "lukittuja": käyttäjä ei pääse editoimaan niitä.

Osakenttäerottimena toimii tällä hetkellä kaksi dollarimerkkiä: '$$'.

Kentästä toiseen voi siirtyä hiirellä, nuolinäppäimillä tai sarkaimella.

Kenttiä voi lisätä ja poistaa editorin yläpuolella olevien nappien avulla.

## Postituslista

Arton postituslista arto-list(at)helsinki.fi on tarkoitettu kaikille Artikkelien kuvailutyökalun käyttäjille ja muille Arto-aineiston tallentajille. Listaa käytetään enimmäkseen tiedotukseen (käyttökatkot, tallennukseen liittyvät muutokset ja uudistukset), harvakseltaan myös keskusteluun. Lista on melko hiljainen eikä siis kuormita juuri sähköpostia.

Liittymisohjeet:

- Lähetä sähköpostitse viesti osoitteeseen majordomo@helsinki.fi
- Jätä Subject-rivi tyhjäksi ja kirjoita ensimmäiselle tekstiriville subscribe arto-list oma.nimi@osoi.te
- Älä kirjoita viestiin mitään muuta (ota esim. allekirjoitustiedosto pois).
- Ihmisille eli listalaisille tarkoitetut viestit lähetetään osoitteella arto-list[at]helsinki.fi

Eroamisohjeet:

- Lähetä sähköpostitse viesti osoitteeseen majordomo@helsinki.fi
- Jätä Subject-rivi tyhjäksi ja kirjoita ensimmäiselle tekstiriville unsubscribe arto-list oma.nimi@osoi.te
- Älä kirjoita viestiin mitään muuta (ota esim. allekirjoitustiedosto pois).

## Palaute

Artikkelien kuvailutyökalua koskevat kysymykset voi lähettää osoitteeseen melinda-posti[at]helsinki.fi
