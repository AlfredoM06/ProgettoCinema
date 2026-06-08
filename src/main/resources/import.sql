--film
INSERT INTO db_cinema.films
(archiviato, data_di_uscita, durata, prezzo, scadenza, distribuzione, formato, regista, titolo, img_cover, img_logo, img_poster, lingue, `cast`, descrizione)
VALUES(0, '', 0, 0, '', '', '', '', '', '', '', '', '', '', '');
INSERT INTO db_cinema.films
(archiviato, data_di_uscita, durata, prezzo, scadenza, distribuzione, formato, regista, titolo, img_cover, img_logo, img_poster, lingue, `cast`, descrizione)
VALUES(0, '', 0, 0, '', '', '', '', '', '', '', '', '', '', '');
INSERT INTO db_cinema.films
(archiviato, data_di_uscita, durata, prezzo, scadenza, distribuzione, formato, regista, titolo, img_cover, img_logo, img_poster, lingue, `cast`, descrizione)
VALUES(0, '', 0, 0, '', '', '', '', '', '', '', '', '', '', '');
INSERT INTO db_cinema.films
(archiviato, data_di_uscita, durata, prezzo, scadenza, distribuzione, formato, regista, titolo, img_cover, img_logo, img_poster, lingue, `cast`, descrizione)
VALUES(0, '', 0, 0, '', '', '', '', '', '', '', '', '', '', '');
INSERT INTO db_cinema.films
(archiviato, data_di_uscita, durata, prezzo, scadenza, distribuzione, formato, regista, titolo, img_cover, img_logo, img_poster, lingue, `cast`, descrizione)
VALUES(0, '', 0, 0, '', '', '', '', '', '', '', '', '', '', '');
INSERT INTO db_cinema.films
(archiviato, data_di_uscita, durata, prezzo, scadenza, distribuzione, formato, regista, titolo, img_cover, img_logo, img_poster, lingue, `cast`, descrizione)
VALUES(0, '2026/5/20', 120, 6, '2026/9/25', 'Walt Disney Studios Motion Pictures', 'Standard', 'Jon Favreau', 'The Mandalorian and Grogu', '', '', '', 'ITA', 'Pedro Pascal, Sigourney Weaver, Grogu', 'L Impero Galattico è caduto ed è stato sostituito dalla nascente Nuova Repubblica. Gli ultimi signori della guerra imperiali, ancora sparsi per la Galassia, continuano una guerriglia di resistenza contro la Nuova Repubblica, che ingaggia il cacciatore di taglie mandaloriano Din Djarin e il suo giovane apprendista Grogu per neutralizzarli. I due vengono incaricati dal colonnello Ward, comandante della base di Adelphi, di catturare il più importante signore della guerra imperiale ancora in circolazione, il comandante Coin, di cui non si conoscono né il volto né il luogo in cui si trova.');
INSERT INTO db_cinema.films
(archiviato, data_di_uscita, durata, prezzo, scadenza, distribuzione, formato, regista, titolo, img_cover, img_logo, img_poster, lingue, `cast`, descrizione)
VALUES(0, '2026/06/13', 125, 6, '2026/10/24', 'Universal Pictures', 'Standard', 'Dean DeBlois', 'Dragon Trainer', '', '', '', 'ITA', 'Mason Thames, Nico Parker, Gerard Butler, Nick Frost, Julian Dennison, Gabriel Howell, Bronwyn James, Harry Trevaldwyn', ' Il villaggio vichingo di Berk è frequentemente attaccato dai draghi, che rubano il bestiame e mettono in pericolo i suoi abitanti. Hiccup, il figlio sedicenne del capo Stoick l Immenso, non essendo fisicamente forte come gli altri suoi pari, è relegato nella forgia del villaggio, creando dispositivi meccanici. Durante un incursione dei draghi, il ragazzo abbatte un drago raro, la Furia Buia. Determinato a dimostrare il suo valore a sé stesso e alla tribù, Hiccup trova la creatura intrappolata, ma esita a finirla e alla fine la libera, sorprendendosi quando il drago lo risparmia prima di fuggire.');
INSERT INTO db_cinema.films
(archiviato, data_di_uscita, durata, prezzo, scadenza, distribuzione, formato, regista, titolo, img_cover, img_logo, img_poster, lingue, `cast`, descrizione)
VALUES(0, '2026/05/22', 130, 6, '2026/10/6', 'Warner Bros. Pictures', 'Standard', 'James Gunn', 'Superman', '', '', '', 'ITA', 'David Corenswet, Rachel Brosnahan, Nicholas Hoult', 'Superman, è già un eroe affermato, ma non ancora del tutto compreso. Sin dalle prime sequenze, si trova ad affrontare una creatura mostruosa, pilotata da remoto dal geniale e spietato Lex Luthor, deciso a distruggere l alieno venuto da Krypton e conquistare un paese mediorientale ricco di petrolio. Chiedere aiuto alla giornalista Lois Lane e al team di eroi per scongiurare i piani malefici di Lex.');
INSERT INTO db_cinema.films
(archiviato, data_di_uscita, durata, prezzo, scadenza, distribuzione, formato, regista, titolo, img_cover, img_logo, img_poster, lingue, `cast`, descrizione)
VALUES(0, '2026/06/14', 110, 6, '2026/09/18', 'Warner Bros. Pictures', 'Standard', 'Zach Lipovsky, Adam Stein', 'Final Destination: Bloodlines', '', '', '', 'ITA', 'Kaitlyn Santa Juana, Teo Briones, Brec Bassinger', 'Tormentata da un incubo violento e ricorrente che ha a che fare con il disastro dello Skyview dove era presenta nonna Iris avvenuto cinquant anni prima, La studentessa universitaria torna a casa alla ricerca dell unica persona che potrebbe spezzare il ciclo della morte e salvare la sua famiglia dal terribile destino che inevitabilmente li attende. Dai creatori di Final Destination, Bloodlines ripercorre tutta la saga, da dove è iniziato.');

--generi
INSERT INTO db_cinema.genere_films
(nome)
VALUES('Azione');
INSERT INTO db_cinema.genere_films
(nome)
VALUES('Anime');
INSERT INTO db_cinema.genere_films
(nome)
VALUES('Commedie');
INSERT INTO db_cinema.genere_films
(nome)
VALUES('Fantasy');
INSERT INTO db_cinema.genere_films
(nome)
VALUES('Horror');
INSERT INTO db_cinema.genere_films
(nome)
VALUES('Musical');
INSERT INTO db_cinema.genere_films
(nome)
VALUES('Romantici');
INSERT INTO db_cinema.genere_films
(nome)
VALUES('Thriller');

--gadgets
--INSERT INTO db_cinema.gadgets
--(prezzo, quantita, nome, img, img_banner, descrizione)
--VALUES(0, 0, '', '', '', '');

--posti
INSERT INTO db_cinema.posti
(prezzo_posto, tipo)
VALUES(7, 'Standard');
INSERT INTO db_cinema.posti
(prezzo_posto, tipo)
VALUES(9.5, 'V.I.P.');
INSERT INTO db_cinema.posti
(prezzo_posto, tipo)
VALUES(5, 'Disabili');

--sale
INSERT INTO db_cinema.sale
(numero_posti, tipo)
VALUES( 40, 'Standard');
INSERT INTO db_cinema.sale
(numero_posti, tipo)
VALUES( 35, '3D');
INSERT INTO db_cinema.sale
(numero_posti, tipo)
VALUES( 25, 'IMAX');
INSERT INTO db_cinema.sale
(numero_posti, tipo)
VALUES( 40, '4K');

--ruoli
--INSERT INTO db_cinema.ruoli
--(nome)
--VALUES('');

--utenti
--INSERT INTO db_cinema.utenti
--(membership, password, ruolo, username, email)
--VALUES(0, '', '', '', '');

