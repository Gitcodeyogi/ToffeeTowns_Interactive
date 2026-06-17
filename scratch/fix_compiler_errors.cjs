const fs = require('fs');

// Fix GG_TravellerDeck_Missions.tsx
{
  const file = 'c:/Yogesh Universe/TOFFEETOWNS_FUN/src/components/desk/GG_TravellerDeck_Missions.tsx';
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace("import { FONT } from '../../pages/TravellersDesk';\n", "");
  fs.writeFileSync(file, content, 'utf8');
  console.log("Fixed Missions imports");
}

// Fix GG_TravellerDeck_Places.tsx
{
  const file = 'c:/Yogesh Universe/TOFFEETOWNS_FUN/src/components/desk/GG_TravellerDeck_Places.tsx';
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace("FONT, ", "");
  fs.writeFileSync(file, content, 'utf8');
  console.log("Fixed Places imports");
}

// Fix GG_TravellerDeck_Shop.tsx
{
  const file = 'c:/Yogesh Universe/TOFFEETOWNS_FUN/src/components/desk/GG_TravellerDeck_Shop.tsx';
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace("import { FONT } from '../../pages/TravellersDesk';\n", "");
  fs.writeFileSync(file, content, 'utf8');
  console.log("Fixed Shop imports");
}

// Fix GG_TravellerDeck_Workshop.tsx
{
  const file = 'c:/Yogesh Universe/TOFFEETOWNS_FUN/src/components/desk/GG_TravellerDeck_Workshop.tsx';
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace("import { FONT } from '../../pages/TravellersDesk';\n", "");
  fs.writeFileSync(file, content, 'utf8');
  console.log("Fixed Workshop imports");
}
