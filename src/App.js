import React, { useState, useEffect } from 'react';
import { generateName } from './NameGenerator';
import { getBestFactionFit } from './SkillFacts'
import ReactTooltip from 'react-tooltip';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

const currentYear = 427;

let genders = ["Female", "Male"];
let playerClasses = ["Acrobat", "Agent", "Archer", "Assassin", "Barbarian", "Bard", "Battlemage", "Crusader", "Healer", "Knight", "Mage", "Monk", "Nightblade", "Pilgrim", "Rogue", "Scout", "Sorcerer", "Spellsword", "Thief", "Warrior", "Witchhunter"];
let npcClasses = ["Alchemist", "Apothecary", "Bookseller", "Buoyant Armiger", "Caravaner", "Champion", "Clothier", "Commoner", "Dreamer", "Drillmaster", "Enchanter", "Enforcer", "Farmer", "Gondolier", "Guard", "Guild Guide", "Herder", "Hunter", "Mabrigash", "Merchant", "Miner", "Necromancer", "Noble", "Ordinator", "Ordinator Guard", "Pauper", "Pawnbroker", "Priest", "Publican", "Savant", "Sharpshooter", "Shipmaster", "Slave", "Smith", "Smuggler", "Trader", "Warlock", "Wise Woman", "Witch"];
let races = ["Argonian", "Breton", "Dark Elf", "High Elf", "Imperial", "Khajiit", "Nord", "Orc", "Redguard", "Wood Elf"]
let lifestyles = ["Royalty", "A Noble", "Well Off", "Poor", "Destitute"]
let birthsigns = ["Warrior", "Mage", "Thief", "Serpent", "Lady", "Steed", "Lord", "Apprentice", "Atronach", "Ritual", "Lover", "Shadow", "Tower"]

let greatHouses = ["House Hlaalu", "House Redoran", "House Telvanni"];
let imperialFactions = ["Fighters Guild", "Mages Guild", "Imperial Legion", "Thieves Guild"];
let religiousFactions = ["Imperial Cult", "Tribunal Temple"]
let morrowindFactions = ["Morag Tong"];
let vampireClans = ["Aundae Clan", "Berne Clan", "Quarra Clan"]

let drives = {
  "Vigilant": "You desire to clear out every Daedric ruin in Vvardenfell.",
  "Scholar": "You wish to collect one copy of every book you come across.",
  "Collector": "You want to collect one of each material of your chosen weapon.",
  "Exorcist": "You desire to rid the land of the supernatural by hunting down all ghosts, vampires, and lycanthropes.",
  "They light the way to freedom": "Seek out and complete the Twin Lamps quests.",
  "Hobbyist": "You dabble in a side skill, train one of your miscellanious skills to 100.",
  "Imperialist": "Complete the Imperial Cult or Legion questlines, even if they are not in your factions list.",
  "Daedrologist": "Complete at least one daedric quest and gain the prince's artefact.",
  "Sixth House Cultist": "You wish to explore every sixth house shrine you find and leave ash statues everywhere you visit."
};
let ideals = {
  "Honest": "You never steal, and you never haggle a merchant below their initial price.",
  "Virtuous": "You always agree to help people when they ask.",
  "Charitable": "You always give gold to paupers in the streets.",
  "Robin Hood": "You steal only from the richest nobles.",
  "Abolitionist": "All slaves you come across must be freed, and their owners killed.",
};
let flaws = {
  "Hydrophobic": "You cannot swim or otherwise enter water, water walking is a must.",
  "Kleptomaniac": "You must steal at least one thing per day.",
  "Stubborn": "If caught committing a crime, you will always resist arrest.",
  "Sentimental": "You never sell your old weapons and armour, but instead display them in your home base.",
  "Bloodlust": "You must kill an innocent every time you visit a settlement, once per day.",
  "Alcoholic": "Once per day you must consume at least one of: Ancient Dagoth Brandy, Cyrodiilic Brandy, Flin, Greef, Mazte, Nord Mead, Shein, Sujamma, or Vintage Brandy.",
  "Sugartooth": "Once per day you must consume at least one skooma or moon sugar, and you must be in possession of a skooma pipe at all times.",
  "Prejudiced": "You can only trade with NPCs of your own race.",
  "Snooty": "You won't talk to anyone wearing common clothing or basic armour (iron, leather)."
};

let classSpecificTraits = {
  "Dreamer": {"Dreamer": "You are a dreamer, strip naked and wield a chitin club. Purge the outlander n'wah from the land."},
  "Trader": {"Pack Merchant": "Buy goods in town and sell them for a profit in the next"},
  "Merchant": {"Pack Merchant": "Buy goods in town and sell them for a profit in the next"},
  "Caravaner": {"Pack Merchant": "Buy goods in town and sell them for a profit in the next"},
  "Bookseller": {"Pack Merchant": "Buy goods in town and sell them for a profit in the next"},
  "Buoyant Armiger": {"Buoyant Armiger": "You're a Buoyant Armiger, give yourself a full set of glass armour and charge straight into Ghostgate, kill everything within."},
  "Ordinator": {"Ordinator": "You're an Ordinator, give yourself a set of Indoril Armor, Expensive Pants, and an Ebony Mace and purge the lawless scum from the land"},
  "Ordinator Guard": {"Ordinator": "You're an Ordinator, give yourself a set of Indoril Armor, Expensive Pants, and an Ebony Mace and purge the lawless scum from the land"},
  "Slave": {"Ex-Slave": "Seek out and complete the Twin Lamps quests."},
}

let maxLifespan = { "Argonian": 80, "Breton": 120, "Dark Elf": 400, "High Elf": 400, "Imperial": 80, "Khajiit": 80, "Nord": 80, "Orc": 80, "Redguard": 80, "Wood Elf": 400 };

function rand(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function map(min, max, newMin, newMax, value) {
  return newMin + (value - min) * (newMax - newMin) / (max - min);
}

function generateAge(race) {
  return Math.floor(map(0, 1, maxLifespan[race] * 0.25, maxLifespan[race], Math.random()))
}

function generateAim(lifestyle) {
  switch (lifestyle) {
    case "Royalty":
    case "A Noble":
      return "you yearn to regain your former wealth and clear your name";
    case "Well Off":
      return "you hope to carve out a decent life in this new land"
    case "Poor":
    case "Destitute":
      return "you pray that this new land will treat you more kindly than your last"
  }
}

function buildDescription(data) {

  return <div>
    You are {data.name}, a {data.gender.toLowerCase()} {data.race} {data.characterClass.toLowerCase()}.
    You were born under the sign of The {data.birthsign} in the year 3E{currentYear - data.age}.
    You were {data.lifestyle.toLowerCase()} before being arrested and sent to Vvardenfell, and as a result {generateAim(data.lifestyle)}.


  </div>
}

function generateFactions(characterClass, isVampire, buildSensibleCharacters) {
  let factions = {};

  if (buildSensibleCharacters) {

    factions["Imperial Faction"] = getBestFactionFit("Imperial Faction", characterClass, true);
    factions["Great House"] = getBestFactionFit("Great House", characterClass);
    factions["Native Faction"] = getBestFactionFit("Native Faction", characterClass);

    //TODO isReligious
    factions["Religious Faction"] = getBestFactionFit("Religious Faction", characterClass);
    if (isVampire) factions["Vampire Clan"] = getBestFactionFit("Vampire Clan", characterClass);

    return factions;
  }

  if (Math.random() > 0.2) factions["Imperial Faction"] = [rand(imperialFactions)];
  if (Math.random() > 0.7) factions["Native Faction"] = [rand(morrowindFactions)];
  if (Math.random() > 0.2) factions["Religious Faction"] = [rand(religiousFactions)];
  if (Math.random() > 0.2) factions["Great House"] = [rand(greatHouses)];
  if (isVampire) factions["Vampire Clan"] = [rand(vampireClans)];
  return factions;
}

function generateTraits(characterClass, dict, addClassSpecific = false) {
  let traits = {};
  let count = Math.random() > 0.65 ? 2 : 1;

  for (var i = 0; i < count; i++) {
    let key = Object.keys(dict)[Math.floor(Math.random() * Object.keys(dict).length)];
    let trait = dict[key];
    traits[key] = trait;
  }

  if (characterClass == "Thief" || characterClass == "Rogue") {
    delete traits["Honest"];
  }

  if (addClassSpecific) {
    traits = Object.assign({},classSpecificTraits[characterClass],  traits);
  }

  return traits;
}

export default function Creator() {
  const [data, setData] = useState();
  const [useNpcClasses, setNpcClassesChecked] = useState(false);
  const [buildSensibleCharacters, setSensibleCharsChecked] = useState(false);
  const { height, width } = useWindowDimensions();
  const [tooltip, showTooltip] = useState(true);

  const handleOnChangeNpcClasses = () => {
    setNpcClassesChecked(!useNpcClasses);
  };
  const handleOnChangeSensibleChars = () => {
    setSensibleCharsChecked(!buildSensibleCharacters);
  };

  function generateRandomCharacter() {

    const race = rand(races);
    const gender = rand(genders);
    const characterClass = "Buoyant Armiger";//useNpcClasses ? rand(playerClasses.concat(npcClasses)) : rand(playerClasses);

    const isNereverine = Math.random() > 0.5;
    const isVampire = Math.random() > 0.85;
    const isWerewolf = !isVampire && Math.random() > 0.95;

    setData({
      name: generateName(race, gender),
      gender: gender,
      characterClass: characterClass,
      race: race,
      lifestyle: rand(lifestyles),
      birthsign: rand(birthsigns),

      age: generateAge(race),
      factions: generateFactions(characterClass, isVampire, buildSensibleCharacters),

      isNereverine: isNereverine,
      isVampire: isVampire,
      isWerewolf: isWerewolf,

      drives: generateTraits(characterClass, drives, true),
      ideals: generateTraits(characterClass, ideals),
      flaws: generateTraits(characterClass, flaws),
    });
  }

  return (
    <div class="App">
      <button onClick={generateRandomCharacter}
        style={{
          padding: '8px 20px',
          marginBottom: 20,
          backgroundColor: '#F5DEB3',
          outline: 'rgba(0,0,0,0.5) solid 3px',
          borderRadius: 100,
          fontSize: 18,
          color: 'black',
          fontWeight: 700,
          letterSpacing: 1.5,
        }}
      >
        GENERATE NEW CHARACTER
      </button>
      <div style={{
        padding: '8px 20px',
        marginBottom: 20,
        backgroundColor: '#F5DEB3',
        outline: 'rgba(0,0,0,0.5) solid 3px',
        fontSize: 18,
        color: 'black',
        fontWeight: 700,
        letterSpacing: 1.5,
        marginLeft: 'max(calc(50% - 635px), 0px)',
        marginRight: 'max(calc(50% - 635px), 0px)',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: width <= 800 ? 'row' : 'row',
          alignItems: 'start',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <input type="checkbox" id="npcClasses" name="npcClasses" value="npcClasses" checked={useNpcClasses} onChange={handleOnChangeNpcClasses} />Use NPC Classes
          {tooltip && <ReactTooltip effect="solid" />}
          <div data-tip="Attempts to match up factions with your character's class"
            onMouseEnter={() => {
              showTooltip(true)
            }
            }
            onMouseLeave={() => {
              showTooltip(false);
              setTimeout(() => showTooltip(true), 50);
            }}>
            <input type="checkbox" id="sensibleChars" name="sensibleChars" value="sensibleChars" checked={buildSensibleCharacters} onChange={handleOnChangeSensibleChars} />Sensible Characters
          </div>
        </div>
      </div>
      <div
        style={{
          //TODO: Jank fix to center content on larger screens but left align on mobile (dependant on width of children)
          marginLeft: 'max(calc(50% - 635px), 0px)',
          marginRight: 'max(calc(50% - 635px), 0px)',
        }}
      >
        <br />
        {
          data &&
          <div
            style={{
              display: 'flex',
              flexDirection: width <= 800 ? 'row' : 'column',
              alignItems: 'start',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: width <= 800 ? 'column' : 'row',
                alignItems: 'start',
                width: width <= 800 ? '170px' : '100%',
                alignItems: 'stretch'
              }}
            >
              <StatCard title={'name'} value={data.name} />
              <StatCard title={'gender'} value={data.gender} />
              <StatCard title={'race'} value={data.race} />
              <StatCard title={'class'} value={data.characterClass} />
              <StatCard title={'birthsign'} value={data.birthsign} />
              <StatCard title={'nereverine'} value={data.isNereverine ? "Yes" : "No"} />
              <StatCard title={'occult'} value={data.isVampire
                ? "Vampire"
                : data.isWerewolf
                  ? "Werewolf"
                  : "None"
              } />
            </div>
            <div
              style={{
                // width: '60%',
                width: '100%',
                // minWidth: 700,
                // minWidth: 480,
              }}
            >
              <StatCard title={`Bio`} value={buildDescription(data)} centerText={false} />
              <StatCard title={`Factions`} value={<div
                style={{
                  display: 'flex',
                  flexDirection: width <= 800 ? 'column' : 'row',
                  alignItems: 'start',
                }}>
                {
                  Object.keys(data.factions).map(function (title, i) {
                    return data.factions[title].length > 0 && Object.keys(data.factions[title]).map(function (faction, j) {
                      return <StatCard title={title} value={data.factions[title][faction]} nested={true} />
                    })
                  })
                }
              </div>}
                centerText={false} />
              <div style={{
                display: 'flex',
                flexDirection: width <= 800 ? 'column' : 'row',
                alignItems: 'start',

              }}>
                <StatCard title={`Drives`} value={<div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'start'
                }}>
                  {
                    Object.keys(data.drives).map(function (key, i) {
                      return <StatCard title={key} value={data.drives[key]} nested={true} />
                    })
                  }
                </div>} />
                <StatCard title={`Ideals`} value={<div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'start'
                }}>
                  {
                    Object.keys(data.ideals).map(function (key, i) {
                      return <StatCard title={key} value={data.ideals[key]} nested={true} />
                    })
                  }
                </div>} />
                <StatCard title={`Flaws`} value={<div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'start'
                }}>
                  {
                    Object.keys(data.flaws).map(function (key, i) {
                      return <StatCard title={key} value={data.flaws[key]} nested={true} />
                    })
                  }
                </div>} />
              </div>
            </div>
          </div>
        }
      </div>

    </div>
  );
}

function StatCard({ title, value, centerText = true, nested = false }) {
  return (
    <div
      style={{
        margin: 10,
        padding: 15,
        width: 'calc(100% - 50px)',
        backgroundColor: nested ? '#EFE1BC' : '#F5DEB3',
        outline: 'rgba(0,0,0,0.5) solid 3px',
        borderRadius: 10,
        textAlign: centerText ? 'center' : 'left',
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{title.toUpperCase()}</div>
      <div style={{ fontSize: 20, fontWeight: 500 }}>{value}</div>
    </div>)
}