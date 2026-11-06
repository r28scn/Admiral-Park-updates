import { NoticeItem } from '../types';

export const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 'n-1',
    title: 'Local Electrician - Alder Electrical',
    category: 'trade',
    author: 'Sam (Electrician) & Ellie',
    company: 'Alder Electrical',
    contactPhone: '07538 837 840',
    contactEmail: 'ellie@alder-electrical.co.uk',
    date: 'Recommended by Residents',
    content: 'Full domestic electrical installations, EV charger setups, fuse board upgrades, lighting installations, and EICR safety certificates across Admiral Park & GU10.',
    isVerified: true
  },
  {
    id: 'n-2',
    title: 'Managing Agent - It\'s Your Place Ltd',
    category: 'estate',
    author: 'Dean (Property Manager)',
    company: 'It\'s Your Place',
    contactPhone: '01483 575 888',
    contactEmail: 'dean@itsyourplace.co.uk',
    date: 'Official Notice',
    content: 'For all estate management enquiries, communal grounds maintenance, automated gate servicing, bin store maintenance, and building insurance queries.',
    isVerified: true
  }
];
