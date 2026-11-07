## Viikkoraportti 2

Käytetty tuntimäärä: 30h

## Mitä olen tehnyt tällä viikolla?

Aloitin tekemään varsinaista luolaston generointia. Lisäsin satunnaisen huoneiden sijoittelun 20x20 ruudukolle ja aloitin Delaunay triangulaation tekemisen Bowyer-Watson algoritmilla.

Olen lisännyt testikattavuuden seurannan sekä ottanut käyttöön linttauksen ja Prettierin. Olen myös aloittanut algoritmien testaamisen Vitestillä, mutta testit ovat vielä varsin puutteellisia, koska en ole ehtinyt keskittyä niiden tekemiseen kunnolla. Pyrin kuitenkin viikonlopun aikana lisäämään mahdollisimman paljon testejä algoritmeille. Koodi on dokumentoitu.

Materiaalissa mainitaan, ettei turhiin testeihin kannata käyttää aikaa. Tämän perusteella olen ajatellut keskittyä ensisijaisesti algoritmien testaamiseen ja jättää esimerkiksi pelaajan liikkumisen ja muut algoritmien ulkopuoliset ominaisuudet vähemmälle huomiolle.

## Miten ohjelma on edistynyt?

Ensimmäiseksi minun piti ratkaista, miten huoneet sijoitetaan kartalle satunnaisesti. Huomasin, etten ollut määrittelydokumentissa kuvannut tarkemmin, miten toteuttaisin tämän osuuden. Minulla oli kuitenkin melko hyvä käsitys siitä, miten halusin toteuttaa sen, joten ratkaisu löytyi kokeilemalla.

Päädyin siihen, että jokainen huone on kooltaan 3x3 ruutua, koska samankokoisia huoneita on helppo sijoittaa ruudukolle. Keksin myös mielestäni näppärän ratkaisun, jonka avulla huoneista voisi tehdä myöhemmin erikokoisia. Aion kuitenkin todennäköisesti toteuttaa tämän vasta kurssin jälkeen ja keskittyä nyt määrittelydokumentissa mainittuihin algoritmeihin.

Huoneet sijoitetaan 18x18 ruudukolle (20x20, jos reunat lasketaan mukaan). Algoritmi käy ruudukon läpi ja rakentaa kuhunkin mahdolliseen kohtaan huoneen tietyllä todennäköisyydellä. Todennäköisyys määräytyy kaavasta 10 / totalWeight, jossa totalWeight saa aluksi arvon 200. Arvoa pienennetään jokaisen rivin jälkeen viidellä, jolloin huoneiden rakentamisen todennäköisyys kasvaa ruudukon loppua kohti.

Ratkaisu näyttää toimivan hyvin, ja huoneet jakautuvat tasaisesti eri puolille karttaa. Olen kuitenkin rajoittanut huoneiden määrän tyypityksessä välille 3-10, sillä esimerkiksi yli 14 huoneen tapauksessa algoritmi ei välttämättä enää löydä tarpeeksi tilaa kaikkien huoneiden sijoittamiseen. Normaalissa käytössä huoneiden satunnainen sijoittelu on toiminut odotetulla tavalla.

Delaunay-triangulaation toteuttaminen Bowyer-Watson algoritmilla vei eniten aikaa tällä viikolla. Bowyer-Watson algoritmin wikipedia sivulta löytyvä pseudokoodi on kuitenkin ollut suureksi avuksi.

Jos luolastossa on esimerkiksi neljä huonetta, algoritmini palauttaa seuraavanlaisen tuloksen:

```
key: 14
value: (3) [3, 1, 0]

key: 19
value: (3) [3, 2, 1].
```

Kun triangulaatiosta poistetaan superkolmio, jäljelle jää kaksi kolmiota. Kolmio 14 koostuu siis pisteistä 0, 1 ja 3. Kolmio 19 puolestaan koostuu pisteistä 1, 2 ja 3.

Huomasin kuitenkin, ettei algoritmini toimi vielä kaikissa tapauksissa. Joskus yksi piste jää jostain syystä kokonaan huomioimatta, ja joskus kolmiot leikkaavat toisiaan. Tämä on selvästi yksi toteutuksen osa-alueista, johon tarvitaan lisää testausta ja korjauksia.

Projekti on kuitenkin edennyt hyvin, ja sen tekeminen on ollut varsin mielenkiintoista.

## Mitä opin tällä viikolla?

Olen perehtynyt tarkemmin Bowyer-Watson algoritmin toimintaan ja siihen, miten Delaunay triangulaatio muodostetaan sen avulla.

## Mikä jäi epäselväksi tai tuottanut vaikeuksia?

Bowyer-Watson algoritmi ei vielä toimi kaikissa tilanteissa. Minulla on kuitenkin mielestäni hyvä käsitys algoritmin eri vaiheista ja siitä, miten sen pitäisi toimia. Uskon saavani sen toimimaan alkuviikon aikana.

## Mitä teen seuraavaksi?

Aion seuraavaksi keskittyä testien tekemiseen ja niiden avulla algoritmin virheiden löytämiseen ja korjaamiseen. Kun Delaunay triangulaatio toimii odotetusti, alan toteuttaa joko Primin tai A* algoritmia.
