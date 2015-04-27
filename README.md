# lavaggio_strade_Trento
lavaggio strade Trento marzo-maggio 2015
## premessa
il Comune di Trento rilascia il calendario delle strade nel periodo marzo-maggio 2015 interessate al lavaggio a questo indirizzo
http://www.comune.trento.it/Comunicazione/Il-Comune-informa/In-primo-piano/Lavaggio-notturno-strade2

## il problema
Il calendario è archiviato in un [PDF](https://github.com/napo/lavaggio_strade_trento/raw/master/raw_data/SPAZZAMENTO%20E%20LAVAGGIO%20NOTTURNO%202015.pdf) di difficile lettura (e interpretazione per chi non conosce la città).

<img src="https://raw.githubusercontent.com/napo/lavaggio_strade_trento/master/raw_data/screenshots/first_page_calendario_comune_trento_lavaggio_strade.png" width="300px"/>

## la creazione dei dati
Da questo PDF è stata ricostruita la lista delle vie interessate, corretto i nomi delle vie (unica chiave attraverso cui è possibile collegare le informazioni a dati geografici) e associato quindi le singole voci alle geometrie che le descrivono in OpenStreetMap.
L'operazione di estrazione e pulizia dei nomi delle vie dal PDF è stata fatta manualmente ed ha creato un file [.csv](https://raw.githubusercontent.com/napo/lavaggio_strade_trento/master/raw_data/roads/lavaggio_strade.csv) con data della giornata interessata *date* (formattata come AAAAMMGG), nome della via *name*, eventuali limiti sull'operazione del lavaggio *limit* (es. lato della strada o tratto interessato), giorno di inizio pulizia *start* (formattato come AAAA-MM-GG) e giorno di fine pulizia *end* (= giorno dopo).
<img src="https://raw.githubusercontent.com/napo/lavaggio_strade_trento/master/raw_data/screenshots/elenco_strade_csv.png" width="300px"/>
Il file .csv è poi stato importato in una tabella postgis

### estrazione da OpenStreetMap.
I dati da openstreetmap sono stati ricavati da una [query a overpass-api](http://overpass-api.de/api/interpreter?data=%5Bout%3Axml%5D%5Btimeout%3A25%5D%3B%0Aarea%283600046663%29-%3E.searchArea%3B%0A%28%0A%20%20way%5B%22highway%22%5D%28area.searchArea%29%3B%0A%20%20relation%5B%22highway%22%5D%28area.searchArea%29%3B%0A%29%3B%0Aout%20body%3B%0A%3E%3B%0Aout%20skel%20qt%3B) relativa ai soli tag "highway" attraverso il wizard di [overpass-turbo](http://overpass-turbo.eu) con la sintassi *"highway=* in Trento"*
Ripulita per avere un output in XML e solo sulla tipologia "way"
```javascript
[out:xml][timeout:25];
{{geocodeArea:Trento}}->.searchArea;
(
  way["highway"](area.searchArea);
);
out body;
>;
out skel qt;
```
Ottenendo un [file da 7mb](https://github.com/napo/lavaggio_strade_trento/raw/master/raw_data/osm/highways_trento.osm.bz2) a sua volta importato in postgis com osm2pgsql

Da qui, attraverso una query SQL di join sul nome della strada contenuto nella tabella delle strade interessate al lavaggio e quello delle tabelle delle linee (= strade) e dei poligoni (= per piazze e piazzali adibiti a parcheggio) si è collegato i nomi delle vie alle geometrie presenti in OpenStreetMap.

Una verifica manuale ha permesso di inviduare (dove possibile) i tratti di strade ed eventuali incongruenze sui nomi dovuti a cambi di toponomastica o toponomastica "locale" (es. "da Via Degasperi a *Macdonald)*").
Da lì la conversione in [geoJSON](https://github.com/napo/lavaggio_strade_trento/blob/master/raw_data/lavaggio_strade.geojson) 



demo: http://de.straba.us/lavaggio_strade_trento/


screenshot ![Alt 'le strade da pulire il 24 aprile 2014'](https://raw.githubusercontent.com/napo/lavaggio_strade_trento/master/img/lavaggio_strade_trento.png)

