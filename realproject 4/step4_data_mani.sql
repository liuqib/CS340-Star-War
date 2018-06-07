-- get all xxx IDs and Names from xxx table
SELECT character_id, fname, lname FROM character
SELECT spaceship_id, name FROM Spaceship
SELECT weapon_id, name FROM weapon
SELECT planet_id, name FROM planet

-- get all characters and their Side name for the List People page
SELECT character.character_id, fname, lname, side, race FROM  INNER JOIN character ON Side = [Side_id_from_dropdown_Input]

-- get a single character's data for the Update People form
SELECT character_id, fname, lname, Side, age FROM character WHERE character_id = [character_ID_selected_from_browse_character_page]

-- get all character's data to populate a dropdown for associating with weapon
SELECT character_id AS cid, fname, lname FROM character

-- get all weapon to populate a dropdown for associating with people
SELECT weapon_id AS wid, weapon FROM weapon

-- get all peoople with their current associated weapon to list
SELECT wid, cid, CONCAT(fname,' ',lname) AS name, weapon  FROM character INNER JOIN weapon_charactor ON character.character_id = weapon_charactor.cid INNER JOIN weapon_charactor on weapon.weapon_id = weapon_charactor.wid ORDER BY name, weapon

-- add a new xxx to table xxx
INSERT INTO character (fname, lname, side, race) VALUES ([fnameInput], [lnameInput], [SideInput], [RaceInput])
INSERT INTO Spaceship (name, side, type) VALUES ([nameInput], [SideInput], [TypeInput])
INSERT INTO weapon (name, side, color) VALUES ([nameInput], [SideInput], [ColorInput])
INSERT INTO planet (name, side, condition) VALUES ([nameInput], [SideInput], [ConditionInput])

-- associate a character with a weapon (M-to-M relationship addition)
INSERT INTO weapon_charactor (wid, cid) VALUES ([weapon_id_from_dropdown_Input], [character_id_from_dropdown_Input])

-- update a xxx's data based on submission of the Update xxx form
UPDATE character SET fname=[fnameInput], lname=[lnameInput], Side=[Side_id_from_dropdown_Input], Race=[RaceInput] WHERE id=[character_ID_from_the_update_form]
UPDATE Spaceship SET name=[nameInput], Side=[Side_id_from_dropdown_Input], Type=[TypeInput] WHERE id=[Spaceship_ID_from_the_update_form]
UPDATE weapon SET name=[nameInput], Side=[Side_id_from_dropdown_Input], Color=[ColorInput] WHERE id=[weapon_ID_from_the_update_form]
UPDATE planet SET name=[nameInput], Side=[Side_id_from_dropdown_Input], Condition=[condition_id_from_dropdown_Input] WHERE id=[planet_ID_from_the_update_form]

-- delete a xxx
DELETE FROM character WHERE id = [character_ID_selected_from_browse_character_page]
DELETE FROM Spaceship WHERE id = [Spaceship_ID_selected_from_browse_Spaceship_page]
DELETE FROM weapon WHERE id = [weapon_ID_selected_from_browse_weapon_page]
DELETE FROM planet WHERE id = [planet_ID_selected_from_browse_planet_page]

-- dis-associate a weapon from a person (M-to-M relationship deletion)
DELETE FROM weapon_charactor WHERE pid = [weapon_ID_selected_from_weapon_and_character_list] AND cid = [weapon_ID_selected_from-weapon_and_character_list]
