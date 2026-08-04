-- Partnership
INSERT INTO db_cinema.partnerships (img_banner, nome) VALUES('', 'no partner');
INSERT INTO db_cinema.partnerships (img_banner, nome) VALUES('', 'prova');

-- formato
INSERT INTO db_cinema.formati (nome) VALUES('Standard');
INSERT INTO db_cinema.formati (nome) VALUES('3D');
INSERT INTO db_cinema.formati (nome) VALUES('4K');
INSERT INTO db_cinema.formati (nome) VALUES('IMAX');

-- lingua
INSERT INTO db_cinema.lingue (nome) VALUES('ITA');
--INSERT INTO db_cinema.lingue (nome) VALUES('');

--film
INSERT INTO db_cinema.films (archiviato, data_di_uscita, durata, id_partnership, prezzo, scadenza, distribuzione, regista, titolo, img_cover, img_logo, img_poster, `cast`, descrizione) VALUES (0, '2026-08-25', 114, 2, 6, '2026-09-10', 'Paramount Pictures', 'Kevin Williamson', 'Scream 7', '/img/scream7_cover.jpg', '/img/scream7_logo.png', '/img/scream7_poster.jpg', 'Neve Campbell, Courteney Cox, Isabel May, Jasmin Savoy Brown, Mason Gooding', 'quando un nuovo killer Ghostface semina il terrore nella tranquilla città dove Sidney Prescott ha ricostruito la sua vita, i suoi incubi più oscuri diventano realtà: sua figlia diventa il prossimo bersaglio. Determinata a proteggere la sua famiglia, Sidney dovrà affrontare gli orrori del suo passato.');
INSERT INTO db_cinema.films (archiviato, data_di_uscita, durata, id_partnership, prezzo, scadenza, distribuzione, regista, titolo, img_cover, img_logo, img_poster, `cast`, descrizione) VALUES (0, '2026-08-02', 135, 1, 6, '2026-09-12', 'Universal Pictures', 'Gareth Edwards', 'Jurassic World – Rebirth', '/img/jurassicworld_cover.jpg', '/img/jurassicworld_logo.png', '/img/jurassicworld_poster.webp', 'Scarlett Johansson, Mahershala Ali, Jonathan Bailey', 'Diciassette anni dopo dagli eventi di Jurassic world Dominiion, nel 2027,il pianeta si trova profondamente cambiato. L''ambiente terrestre si è rivelato in gran parte inadatto alla sopravvivenza delle specie preistoriche riportate in vita. La maggior parte dei dinosauri è morta o stata abbattuta; quelli sopravvissuti si rifugiano in poche aree remote, per lo più tropicali, dove le condizioni naturali ricordano i loro antichi habitat, l''accesso alle quali è stato vietato dalle autorità.');
INSERT INTO db_cinema.films (archiviato, data_di_uscita, durata, id_partnership, prezzo, scadenza, distribuzione, regista, titolo, img_cover, img_logo, img_poster, `cast`, descrizione) VALUES (0, '2026-08-15', 192, null, 6, '2026-10-12', '20th Century Studios', 'James Cameron', 'Avatar – La via dell’acqua', '/img/avatar2_cover.jpg', '/img/avatar2_logo.png', '/img/avatar2_poster.png', 'Sam Worthington, Zoe Saldaña, Sigourney Weaver', 'ake Sully è il capo del clan degli Omaticaya e ha avuto tre figli con Neytiri: Neteyam, Lo''ak e Tuktirey, detta "Tuk". I due, inoltre, hanno adottato una giovane Na''vi di nome Kiri, concepita inspiegabilmente dall''Avatar della defunta dottoressa Grace Augustine, e si occupano di un ragazzo umano di nome Miles Socorro, detto "Spider", figlio del defunto colonnello Miles Quaritch, nato e sempre vissuto su Pandora con gli scienziati umani e la famiglia Sully, che si comporta come un Na''vi.');
INSERT INTO db_cinema.films (archiviato, data_di_uscita, durata, id_partnership, prezzo, scadenza, distribuzione, regista, titolo, img_cover, img_logo, img_poster, `cast`, descrizione) VALUES (0, '2021-06-08', 155, null, 6, '2026-10-20', 'Warner Bros. Pictures', 'Denis Villeneuve', 'Dune (Parte Uno)', '/img/dune_cover.jpg', '/img/dune_logo.png', '/img/dune_poster.jpg', 'Timothée Chalamet, Rebecca Ferguson, Oscar Isaac', 'In un distante futuro dell''umanità esiste un pianeta chiamato Arrakis, detto "Dune". Questo pianeta, completamente sabbioso, è l''unica fonte della sostanza più preziosa dell''universo, la "spezia": essa è una sostanza psichedelica simile a una polvere luccicante e presente nelle sabbie che coprono il pianeta, che conferisce il dono della premonizione e amplifica le capacità mentali, rendendo possibile l''utilizzo dei macchinari per il viaggio interstellare; è inoltre ritenuta sacra dai nativi di Dune, i Fremen, per via degli effetti visionari che ha sugli umani. Un giorno l''imperatore Shaddam Corrino IV toglie il controllo del pianeta Arrakis alla crudele casata Harkonnen per darlo nelle mani della nobile famiglia Atreides, la cui popolarità continua a crescere nel resto dell''Imperium.');
INSERT INTO db_cinema.films (archiviato, data_di_uscita, durata, id_partnership, prezzo, scadenza, distribuzione, regista, titolo, img_cover, img_logo, img_poster, `cast`, descrizione) VALUES (0, '2026-08-14', 108, null, 6, '2026-09-30', 'Walt Disney Studios Motion Pictures', 'Dean Fleischer Camp', 'Lilo & Stitch (live-action)', '/img/lilo_cover.jpg', '/img/lilo_logo.png', '/img/lilo_poster.jpg', 'Maia Kealoha, Sydney Agudong, Chris Sanders', 'Rivisitazione in live-action del classico d''animazione Disney del 2002, “Lilo & Stitch” è la storia divertente e commovente di una ragazza hawaiana solitaria e dell''alieno fuggitivo che l''aiuta a riparare la sua famiglia distrutta.');
INSERT INTO db_cinema.films (archiviato, data_di_uscita, durata, id_partnership, prezzo, scadenza, distribuzione, regista, titolo, img_cover, img_logo, img_poster, `cast`, descrizione) VALUES (0, '2026-8-20', 120, null, 6, '2026/9/25', 'Walt Disney Studios Motion Pictures', 'Jon Favreau', 'The Mandalorian and Grogu', '/img/mandalorian_grogu_cover.jpg', '/img/mandalorian_grogu_logo.png', '/img/mandalorian_grogu_poster.jpg', 'Pedro Pascal, Sigourney Weaver, Grogu', 'L Impero Galattico è caduto ed è stato sostituito dalla nascente Nuova Repubblica. Gli ultimi signori della guerra imperiali, ancora sparsi per la Galassia, continuano una guerriglia di resistenza contro la Nuova Repubblica, che ingaggia il cacciatore di taglie mandaloriano Din Djarin e il suo giovane apprendista Grogu per neutralizzarli. I due vengono incaricati dal colonnello Ward, comandante della base di Adelphi, di catturare il più importante signore della guerra imperiale ancora in circolazione, il comandante Coin, di cui non si conoscono né il volto né il luogo in cui si trova.');
INSERT INTO db_cinema.films (archiviato, data_di_uscita, durata, id_partnership, prezzo, scadenza, distribuzione, regista, titolo, img_cover, img_logo, img_poster, `cast`, descrizione) VALUES (0, '2026-08-13', 125, null, 6, '2026/10/24', 'Universal Pictures', 'Dean DeBlois', 'Dragon Trainer', '/img/dragontrainer_cover.jpg', '/img/dragontrainer_logo.png', '/img/dragontrainer_poster.jpg', 'Mason Thames, Nico Parker, Gerard Butler, Nick Frost, Julian Dennison, Gabriel Howell, Bronwyn James, Harry Trevaldwyn', 'Il villaggio vichingo di Berk è frequentemente attaccato dai draghi, che rubano il bestiame e mettono in pericolo i suoi abitanti. Hiccup, il figlio sedicenne del capo Stoick l Immenso, non essendo fisicamente forte come gli altri suoi pari, è relegato nella forgia del villaggio, creando dispositivi meccanici. Durante un incursione dei draghi, il ragazzo abbatte un drago raro, la Furia Buia. Determinato a dimostrare il suo valore a sé stesso e alla tribù, Hiccup trova la creatura intrappolata, ma esita a finirla e alla fine la libera, sorprendendosi quando il drago lo risparmia prima di fuggire.');
INSERT INTO db_cinema.films (archiviato, data_di_uscita, durata, id_partnership, prezzo, scadenza, distribuzione, regista, titolo, img_cover, img_logo, img_poster, `cast`, descrizione) VALUES (0, '2026-08-22', 130, null, 6, '2026/10/6', 'Warner Bros. Pictures', 'James Gunn', 'Superman', '/img/supermen_cover.jpg', '/img/Superman_2025_logo.png', '/img/superman.jpg', 'David Corenswet, Rachel Brosnahan, Nicholas Hoult', 'Superman, è già un eroe affermato, ma non ancora del tutto compreso. Sin dalle prime sequenze, si trova ad affrontare una creatura mostruosa, pilotata da remoto dal geniale e spietato Lex Luthor, deciso a distruggere l alieno venuto da Krypton e conquistare un paese mediorientale ricco di petrolio. Chiedere aiuto alla giornalista Lois Lane e al team di eroi per scongiurare i piani malefici di Lex.');
INSERT INTO db_cinema.films (archiviato, data_di_uscita, durata, id_partnership, prezzo, scadenza, distribuzione, regista, titolo, img_cover, img_logo, img_poster, `cast`, descrizione) VALUES (0, '2026-08-14', 110, null, 6, '2026/09/18', 'Warner Bros. Pictures', 'Zach Lipovsky, Adam Stein', 'Final Destination: Bloodlines', '/img/final_destination_cover.png', '/img/final_destination_logo.webp', '/img/final_destination_poster.jpg', 'Kaitlyn Santa Juana, Teo Briones, Brec Bassinger', 'Tormentata da un incubo violento e ricorrente che ha a che fare con il disastro dello Skyview dove era presenta nonna Iris avvenuto cinquant anni prima, La studentessa universitaria torna a casa alla ricerca dell unica persona che potrebbe spezzare il ciclo della morte e salvare la sua famiglia dal terribile destino che inevitabilmente li attende. Dai creatori di Final Destination, Bloodlines ripercorre tutta la saga, da dove è iniziato.');
-- import nuovo = INSERT INTO db_cinema.films (archiviato, data_di_uscita, durata, id_partnership, prezzo, scadenza, distribuzione, regista, titolo, img_cover, img_logo, img_poster, `cast`, descrizione) VALUES (0, '', 0, 0, 0, '', '', '', '', '', '', '', '', '');

--generi
INSERT INTO db_cinema.genere_films (nome) VALUES ('Anime');
INSERT INTO db_cinema.genere_films (nome) VALUES ('Azione');
INSERT INTO db_cinema.genere_films (nome) VALUES ('Commedie');
INSERT INTO db_cinema.genere_films (nome) VALUES ('Fantasy');
INSERT INTO db_cinema.genere_films (nome) VALUES ('Horror');
INSERT INTO db_cinema.genere_films (nome) VALUES ('Musical');
INSERT INTO db_cinema.genere_films (nome) VALUES ('Romantici');
INSERT INTO db_cinema.genere_films (nome) VALUES ('Thriller');

--relazioni film/generi
INSERT INTO db_cinema.films_generi (id_film, id_genere) VALUES (1, 8); -- scream 7
INSERT INTO db_cinema.films_generi (id_film, id_genere) VALUES (2, 2); -- jurassic world
INSERT INTO db_cinema.films_generi (id_film, id_genere) VALUES (3, 4); -- avatar
INSERT INTO db_cinema.films_generi (id_film, id_genere) VALUES (4, 2); -- dune
INSERT INTO db_cinema.films_generi (id_film, id_genere) VALUES (5, 6); -- lilo e stitch
INSERT INTO db_cinema.films_generi (id_film, id_genere) VALUES (6, 4); -- mandalorian
INSERT INTO db_cinema.films_generi (id_film, id_genere) VALUES (6, 2); -- mandalorian
INSERT INTO db_cinema.films_generi (id_film, id_genere) VALUES (7, 4); -- dragon trainer
INSERT INTO db_cinema.films_generi (id_film, id_genere) VALUES (8, 2); -- superman
INSERT INTO db_cinema.films_generi (id_film, id_genere) VALUES (9, 5); -- final destination

-- cross lingua e formato
INSERT INTO db_cinema.cross_formato_lingua (id_film, id_formato, id_lingua) VALUES(1, 1, 1);
INSERT INTO db_cinema.cross_formato_lingua (id_film, id_formato, id_lingua) VALUES(2, 2, 1);
INSERT INTO db_cinema.cross_formato_lingua (id_film, id_formato, id_lingua) VALUES(3, 3, 1);
INSERT INTO db_cinema.cross_formato_lingua (id_film, id_formato, id_lingua) VALUES(4, 4, 1);
INSERT INTO db_cinema.cross_formato_lingua (id_film, id_formato, id_lingua) VALUES(5, 1, 1);
INSERT INTO db_cinema.cross_formato_lingua (id_film, id_formato, id_lingua) VALUES(6, 2, 1);
INSERT INTO db_cinema.cross_formato_lingua (id_film, id_formato, id_lingua) VALUES(7, 3, 1);
INSERT INTO db_cinema.cross_formato_lingua (id_film, id_formato, id_lingua) VALUES(8, 4, 1);
INSERT INTO db_cinema.cross_formato_lingua (id_film, id_formato, id_lingua) VALUES(9, 1, 1);

--offerte
INSERT INTO db_cinema.offerte (data_inizio, data_scadenza, id_film, prezzo, genere, nome, descrizione, img_banner,  img_banner_top_offerte, img_dettaglio) VALUES ('2026-06-19', '2026-10-13', 1, 5.99, 'menu', 'Scream 7 Menu', 'cosa a caso', '','', '');
INSERT INTO db_cinema.offerte (data_inizio, data_scadenza, prezzo, genere, nome, descrizione, img_banner,  img_banner_top_offerte, img_dettaglio) VALUES ('2026-06-19', '2026-10-16', 7, 'menu', 'Spiderman Menu', 'cosa più a caso dell''altra', '','', '');
INSERT INTO db_cinema.offerte (data_inizio, data_scadenza, genere, nome, descrizione, img_banner,  img_banner_top_offerte, img_dettaglio) VALUES ('2026-06-19', '2026-10-19', 'evento', 'Carte Disney Lorcana', 'carte collezionabili', '','', '');
INSERT INTO db_cinema.offerte (data_inizio, data_scadenza, genere, nome, descrizione, img_banner, img_banner_top_offerte, img_dettaglio) VALUES ('2026-06-19', '2026-10-22', 'anteprima', 'Master of Universe Poster', 'stacce', '','', '');
--  INSERT INTO db_cinema.offerte (data_inizio, data_scadenza, id_film, prezzo, genere, nome, descrizione, img_banner, img_banner_top_offerte, img_dettaglio) VALUES('', '', 0, 0, '', '', '', '', '', '');

--posti  
INSERT INTO db_cinema.posti (prezzo_posto, tipo) VALUES( 7, 'Standard');
INSERT INTO db_cinema.posti (prezzo_posto, tipo) VALUES( 9.5, 'V.I.P.');
INSERT INTO db_cinema.posti (prezzo_posto, tipo) VALUES(5, 'Disabili');
-- INSERT INTO db_cinema.posti (prezzo_posto, tipo) VALUES(0, '');

--sale
INSERT INTO db_cinema.sale (formato, posti) VALUES ('Standard',1111111111111111111111111111111111111111111111111111111111110222222220022222222011111111113111111113); -- 1
INSERT INTO db_cinema.sale (formato, posti) VALUES ('3D',0000000000311100111311110011111111001111111100111122220022222222002222111100111111110011111111001111); -- 2
INSERT INTO db_cinema.sale (formato, posti) VALUES ('IMAX',0311101130111110111111111011111111101111111110111111111011110022202200002220220000222022003111101113); -- 3
INSERT INTO db_cinema.sale (formato, posti) VALUES ('4K',0000111111222011111122201111112220111111000011111100000000001111111111111111111100000000003131111313); -- 4
-- INSERT INTO db_cinema.sale (formato, posti) VALUES('', '');

--programmazione films
INSERT INTO db_cinema.programmazione_dei_film (data_programmazione, id_film, id_sala, n_prenotazioni, orario) VALUES(CURDATE(), 3, 2, 23, '21:30');
INSERT INTO db_cinema.programmazione_dei_film (data_programmazione, id_film, id_sala, n_prenotazioni, orario) VALUES(CURDATE(), 5, 1, 30, '20:00');
INSERT INTO db_cinema.programmazione_dei_film (data_programmazione, id_film, id_sala, n_prenotazioni, orario) VALUES(CURDATE(), 7, 4, 32, '20:10');
INSERT INTO db_cinema.programmazione_dei_film (data_programmazione, id_film, id_sala, n_prenotazioni, orario) VALUES(CURDATE(), 9, 3, 25, '23:30');
INSERT INTO db_cinema.programmazione_dei_film (data_programmazione, id_film, id_sala, n_prenotazioni, orario) VALUES(CURDATE(), 2, 1, 40, '22:00');
INSERT INTO db_cinema.programmazione_dei_film (data_programmazione, id_film, id_sala, n_prenotazioni, orario) VALUES(CURDATE(), 4, 4, 39, '19:30');
-- programmazione test
INSERT INTO db_cinema.programmazione_dei_film (data_programmazione, id_film, id_sala, n_prenotazioni, orario) VALUES(CURDATE(), 1, 2, 23, '18:30');
INSERT INTO db_cinema.programmazione_dei_film (data_programmazione, id_film, id_sala, n_prenotazioni, orario) VALUES('2026-08-05', 2, 1, 23, '19:30');
INSERT INTO db_cinema.programmazione_dei_film (data_programmazione, id_film, id_sala, n_prenotazioni, orario) VALUES('2026-08-03', 2, 1, 23, '19:00');
INSERT INTO db_cinema.programmazione_dei_film (data_programmazione, id_film, id_sala, n_prenotazioni, orario) VALUES('2026-08-04', 3, 3, 23, '17:30');
INSERT INTO db_cinema.programmazione_dei_film (data_programmazione, id_film, id_sala, n_prenotazioni, orario) VALUES('2026-08-06', 4, 3, 23, '20:30');
INSERT INTO db_cinema.programmazione_dei_film (data_programmazione, id_film, id_sala, n_prenotazioni, orario) VALUES('2026-08-04', 5, 4, 23, '21:30');
INSERT INTO db_cinema.programmazione_dei_film (data_programmazione, id_film, id_sala, n_prenotazioni, orario) VALUES('2026-08-03', 6, 2, 23, '19:00');
INSERT INTO db_cinema.programmazione_dei_film (data_programmazione, id_film, id_sala, n_prenotazioni, orario) VALUES('2026-08-07', 7, 1, 23, '18:00');
INSERT INTO db_cinema.programmazione_dei_film (data_programmazione, id_film, id_sala, n_prenotazioni, orario) VALUES('2026-08-03', 8, 1, 23, '23:00');
INSERT INTO db_cinema.programmazione_dei_film (data_programmazione, id_film, id_sala, n_prenotazioni, orario) VALUES('2026-08-04', 8, 1, 23, '23:40');
INSERT INTO db_cinema.programmazione_dei_film (data_programmazione, id_film, id_sala, n_prenotazioni, orario) VALUES('2026-08-05', 8, 1, 23, '23:00');
INSERT INTO db_cinema.programmazione_dei_film (data_programmazione, id_film, id_sala, n_prenotazioni, orario) VALUES('2026-08-04', 9, 2, 23, '19:30');

-- INSERT INTO db_cinema.programmazione_dei_film (data_programmazione, id_film, id_sala, n_prenotazioni, orario) VALUES('', 0, 0, 0, 0, '', '');

--ruoli
--INSERT INTO db_cinema.ruoli
--(nome)
--VALUES('');

--utenti
--INSERT INTO db_cinema.utenti
--(membership, password, ruolo, username, email)
--VALUES(0, '', '', '', '');


--INSERT INTO db_cinema.utenti (acquisto_membership, anno_ultima_mail_compleanno, carta_ricaricabile, data_acquisto, data_nascita, data_scadenza, membership, punti_membership, utilizzi_card, cognome, nome, password, ruolo, username, email, nome_carta) VALUES('', 0, 0, '', '', '', 0, 0, 0, '', '', '', '', '', '', '');