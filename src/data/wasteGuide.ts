import { WasteItem } from '../types';

export const WASTE_ITEMS: WasteItem[] = [
  {
    id: 'w-1',
    name: 'Plastic Milk Bottles & Drink Bottles',
    bin: 'green',
    binLabel: 'Green Wheelie Bin',
    instructions: 'Empty, rinse clean and squash. Tops can be left screwed on or removed.',
    category: 'packaging'
  },
  {
    id: 'w-2',
    name: 'Cardboard Delivery Boxes & Cartons',
    bin: 'green',
    binLabel: 'Green Wheelie Bin',
    instructions: 'Flatten completely. Remove heavy packing tape and polystyrene inserts.',
    category: 'packaging'
  },
  {
    id: 'w-3',
    name: 'Food Tins & Drink Cans',
    bin: 'green',
    binLabel: 'Green Wheelie Bin',
    instructions: 'Rinse out food remains. Tops and lids can be placed inside.',
    category: 'packaging'
  },
  {
    id: 'w-4',
    name: 'Glass Bottles & Jars',
    bin: 'green',
    binLabel: 'Green Wheelie Bin',
    instructions: 'Rinse clean. Metal lids and bottle caps can remain on.',
    category: 'packaging'
  },
  {
    id: 'w-5',
    name: 'Aerosol Cans (Deodorant, Polish)',
    bin: 'green',
    binLabel: 'Green Wheelie Bin',
    instructions: 'Must be completely empty. Do not pierce, crush, or remove nozzle.',
    category: 'packaging'
  },
  {
    id: 'w-6',
    name: 'Clean Aluminium Foil & Foil Trays',
    bin: 'green',
    binLabel: 'Green Wheelie Bin',
    instructions: 'Scrunch together into a fist-sized ball before placing into the green bin.',
    category: 'packaging'
  },
  {
    id: 'w-7',
    name: 'Food Scraps & Leftovers (Cooked/Raw)',
    bin: 'food',
    binLabel: 'Brown Food Waste Caddy',
    instructions: 'Line with compostable caddy liner or wrap in newspaper. All cooked/raw food, bones, plate scrapings.',
    category: 'food'
  },
  {
    id: 'w-8',
    name: 'Tea Bags & Coffee Grounds',
    bin: 'food',
    binLabel: 'Brown Food Waste Caddy',
    instructions: 'Suitable for food caddy. Keep lid locked to prevent animal access.',
    category: 'food'
  },
  {
    id: 'w-9',
    name: 'Fruit Peelings & Egg Shells',
    bin: 'food',
    binLabel: 'Brown Food Waste Caddy',
    instructions: 'Place straight into outside brown food caddy or kitchen caddy.',
    category: 'food'
  },
  {
    id: 'w-10',
    name: 'Greasy Pizza Box Bases',
    bin: 'black',
    binLabel: 'Black General Rubbish Bin',
    instructions: 'Grease contaminates paper recycling. Tear off clean lid for Green Bin; place greasy base in Black Bin.',
    category: 'packaging'
  },
  {
    id: 'w-11',
    name: 'Soft Plastic Film & Crisp Packets',
    bin: 'black',
    binLabel: 'Black General Rubbish Bin',
    instructions: 'Cannot be processed in Guildford green bins. Alternatively, recycle at local supermarket soft plastic points.',
    category: 'packaging'
  },
  {
    id: 'w-12',
    name: 'Black Plastic Food Trays',
    bin: 'black',
    binLabel: 'Black General Rubbish Bin',
    instructions: 'Optical sorting lasers cannot detect carbon-black pigments. Place in black rubbish bin.',
    category: 'packaging'
  },
  {
    id: 'w-13',
    name: 'Polystyrene Packaging & Peanuts',
    bin: 'black',
    binLabel: 'Black General Rubbish Bin',
    instructions: 'Non-recyclable kerbside. Place in black bin or take bulk sheets to Slyfield tip.',
    category: 'packaging'
  },
  {
    id: 'w-14',
    name: 'Nappies, Wet Wipes & Sanitary Items',
    bin: 'black',
    binLabel: 'Black General Rubbish Bin',
    instructions: 'Bag securely and place in black refuse bin. Never place in recycling or flush.',
    category: 'household'
  },
  {
    id: 'w-15',
    name: 'Household Batteries (AA, AAA, button)',
    bin: 'special',
    binLabel: 'Bag on Bin Lid (Special)',
    instructions: 'Put in a small clear plastic bag and place on top of either your Green or Black bin lid on collection day.',
    category: 'electronics'
  },
  {
    id: 'w-16',
    name: 'Small Electrical Items (Kettle, Toaster, Hairdryer)',
    bin: 'special',
    binLabel: 'Bag on Bin Lid (Special)',
    instructions: 'Must fit inside a standard carrier bag. Place tied bag on top of your bin lid for council collection.',
    category: 'electronics'
  },
  {
    id: 'w-17',
    name: 'Clothes, Bedding & Paired Shoes',
    bin: 'special',
    binLabel: 'Bag on Bin Lid (Special)',
    instructions: 'Place clean textiles inside a tied supermarket carrier bag on top of your bin lid on collection day.',
    category: 'household'
  },
  {
    id: 'w-18',
    name: 'Grass Cuttings, Hedge Trimmings & Weeds',
    bin: 'garden',
    binLabel: 'Brown Garden Waste Bin',
    instructions: 'For registered garden waste subscribers. Alternatively, compost at home or take to Slyfield tip.',
    category: 'garden'
  },
  {
    id: 'w-19',
    name: 'Fallen Leaves & Small Twigs (<10cm diameter)',
    bin: 'garden',
    binLabel: 'Brown Garden Waste Bin',
    instructions: 'Place loosely in brown garden bin. Do not use plastic bags.',
    category: 'garden'
  },
  {
    id: 'w-20',
    name: 'Paint Cans & Chemical Bottles',
    bin: 'tip',
    binLabel: 'Community Recycling Centre',
    instructions: 'Hazardous waste: Take to Slyfield Community Recycling Centre (Moorfield Road, Guildford GU1 1RU).',
    category: 'hazardous'
  },
  {
    id: 'w-21',
    name: 'Lightbulbs & Fluorescent Tubes',
    bin: 'tip',
    binLabel: 'Community Recycling Centre',
    instructions: 'Energy-saving bulbs contain traces of mercury. Take to local hardware store or Slyfield tip.',
    category: 'hazardous'
  },
  {
    id: 'w-22',
    name: 'Shredded Paper',
    bin: 'green',
    binLabel: 'Green Wheelie Bin',
    instructions: 'Guildford accepts shredded paper if placed inside a paper bag or cereal box so it doesn\'t blow away.',
    category: 'packaging'
  },
  {
    id: 'w-23',
    name: 'Tetra Pak & Juice Cartons',
    bin: 'green',
    binLabel: 'Green Wheelie Bin',
    instructions: 'Rinse, flatten and replace plastic caps. Accepted in Guildford mixed recycling.',
    category: 'packaging'
  },
  {
    id: 'w-24',
    name: 'Broken Window Glass or Pyrex',
    bin: 'black',
    binLabel: 'Black General Rubbish Bin',
    instructions: 'Wrap safely in newspaper and tape securely before placing in black bin to protect collection crews.',
    category: 'household'
  }
];
