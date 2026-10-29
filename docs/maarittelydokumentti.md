## Opinto-ohjelma

- Tietojenkäsittelytieteen kandidaatti (TKT)

## Mitä ohjelmointikieltä käytät?

- TypeScript

## Kerro myös mitä muita kieliä hallitset siinä määrin, että pystyt tarvittaessa vertaisarvioimaan niillä tehtyjä projekteja.

- Python: Olen käyttänyt viimeksi pari vuotta sitten, mutta uskon pystyväni vertaisarvioimaan Pythonilla toteutettuja projekteja.
- C: Olen opiskellut perusteet matalan tason ohjelmoinnin kurssilla, mutta osaamiseni on melko perustasolla.

## Minkä ongelman ratkaiset?

- Tavoitteena on tehdä automaattinen luolaston generointi 2D-peliin. Luola generoidaan kokonaan pelin alkaessa. Pelaaja sijoitetaan yhteen luolaston huoneista, ja hänen tavoitteenaan on löytää portaat, jotka johtavat seuraavaan luolastoon. Portaiden saavuttamisen jälkeen generoidaan automaattisesti uusi luolasto.

## Mitä algoritmeja ja tietorakenteita toteutat työssäsi?

- Delaunay-triangulaatio ja Bowyer–Watson algoritmi muodostavat huoneiden keskipisteistä kolmioverkon, jonka kaarista saadaan mahdollisia huoneyhteyksiä.
- Primin algoritmi tekee yhteyksistä virittävän puun niin, että jokaisesta huoneesta pääsee varmasti kaikkiin huoneisiin jotain reittiä pitkin.
- A\* etsii reitin kahden huoneen välillä.

## Mitä syötteitä ohjelma saa ja miten niitä käytetään?

Ohjelman käyttäjältä saama syöte on pelaajan liikkuminen. Luolasto generoidaan automaattisesti ja portaiden saavuttaminen käynnistää uuden luolaston generoinnin. Generointialgoritmit saavat muun muassa huoneiden sijainteja ja kokoja sekä huoneiden välisiä mahdollisia yhteyksiä.

## Tavoitteena olevat aika- ja tilavaativuudet (esim. O-analyysit)

Käyttämieni algoritmien wikipedia sivujen mukaan aikavaativuudet ovat:

- Bowyer–Watson algoritmi: Yksinkertaisen toteutuksen aikavaativuus on O(n²), mutta tehokkaammalla toteutuksella on mahdollista O(n log n). Tässä projektissa n tarkoittaa huoneiden määrää. Tilavaativuus on O(n), eli kun tallennetaan huoneiden keskipisteet ja muodostettu kolmio.
- Primin algoritmi: Riippuu käytetyistä tietorakenteista. Esim jos toteutetaan binäärikeolla ja vierekkäisyyslistalla niin voidaan saavuttaa O(|E| log(|V|)), missä |V| on graafin solmujen määrä ja |E| sen kaarien määrä. Tässä projektissa solmut kuvaavat huoneita ja kaaret niiden välisiä mahdollisia yhteyksiä. Tilavaativuus on (O(|V|+|E|)), eli se riippuu huoneiden ja niiden välisten mahdollisten yhteyksien määrästä.
- A\* pystyy mahdollisesti O(|E| log(|V|)) ([Lähde](https://en.wikipedia.org/wiki/Pathfinding)). Muistinkulutus riippuu tallennettujen solmujen ja yhteyksien määrästä.

Lähden alustavasti toteuttamaan projektia Bowyer-Watson algoritmin yksinkertaisella toteutuksella, joten tavoite aikavaativuus on sen mukainen, eli O(n²).

## Lähteet, joita aiot käyttää:

- [Procedurally Generated Dungeons](https://vazgriz.com/119/procedurally-generated-dungeons/), tästä löytyi aika hyvin informaatiota, josta lähteä liikkeelle.
- [Bowyer–Watson algorithm](https://en.wikipedia.org/wiki/Bowyer%E2%80%93Watson_algorithm)
- [Delaunay triangulation](https://en.wikipedia.org/wiki/Delaunay_triangulation)
  - [Youtube video Delaunay Triangulatiosta](https://www.youtube.com/watch?v=W49OphOm-1I&t=304s)
- [A\* search algorithm](https://en.wikipedia.org/wiki/A*_search_algorithm)
- [Prim's algorithm](https://en.wikipedia.org/wiki/Prim's_algorithm)

# Harjoitustyön ydin

Aiheen ydin on luolaston generoinnissa käytettävien algoritmien toteuttaminen. Tarkoituksena on muodostaa huoneiden keskipisteistä Delaunay-triangulaatio Bowyer–Watson algoritmilla, ja tämän avulla yhdistää huoneet Primin algoritmilla ja etsiä huoneiden väliset polut A\* algoritmilla.
Tavoitteena on, että generoitu luolasto on yhtenäinen eli kaikki huoneet ovat saavutettavissa toisistaan käytäviä pitkin.
En käytä grafiikkaan paljon aikaa, vaan esitän huoneet ja käytävät yksinkertaisilla suorakulmioilla. Käytän niiden piirtämiseen ennestään tuttua PixiJS kirjastoa, jotta voin keskittyä algoritmien toteutukseen.
