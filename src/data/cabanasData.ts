import { CabanaUnit, SanctuaryProperty, CabanaPackageDetails, CabanaPackageTier, CabanaSpecifications } from '../types';

export const CABANA_IMAGE_SETS = {
  oceanfront: [
    '/src/assets/images/hero_sri_lanka_luxury_escape_1792932448818.jpg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuADEoVD0RY4y8v3FocVRlEOeFGj0sfPs0j10HlKgpN8hPDQgG1Cp0XPwtF0wzEcnBkssXMf5ap88gLC3O0W-nqzgrFptbAuI2zrkqWvWxM-lH5CIdPqQfQtOG2aV-0WoeqmLcgYEMK1Etb7zGjygx3SEat-6Em5mpWaetSQJvM2OSRURcqIv68AfCYJYdJD5uOcRd0t7xBe3HpTGKkFP-9Lbviq9NKimu3_Lf6D-3sPP53OMPrcRaOa',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCddDOk1PEzEryL44aq-FeAF1GwDH1Mdj447UT2KYeso9sIJJzRGP3CeUy48-et7qicLY352KRXGVvoPwcKyZriSwvqQ2ot3YKdMAdgvHnvcTwqG5m2bs33NkQjYfxculm5eOKsZKXQ1k0DVF46lcKA0thMgHf2cPtuCMLUVMohhy3nNxH2NPoNAxnau5GyUwELdva-52_QfyZQCBDWg3YWwRSgWd3d-uK19gepOZR24mMNTBD_kd5A',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA1yaD1jKP08nNpCh0Z-kEE6F8xdx6Iz4PehiNqN3GSAk9EPjYeHPREOoPi_d-VAWu1TW4wJFgR2LwgqgQ4MiooOSIPZboIMnWB0kjvqSyepJKgf0iVEoG3fphEJxn_6YLOlJ-_GnK9GH2GUX9eQXGtcZtnaK-DDU76APMXU-wSh9chXaqlX-udUc_jNoAg-hprK5knXICwG6bPWxTXuIlc-5WhEDQz5i_7FlI-eMpFdIZWyzy4paav'
  ],
  poolside: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCddDOk1PEzEryL44aq-FeAF1GwDH1Mdj447UT2KYeso9sIJJzRGP3CeUy48-et7qicLY352KRXGVvoPwcKyZriSwvqQ2ot3YKdMAdgvHnvcTwqG5m2bs33NkQjYfxculm5eOKsZKXQ1k0DVF46lcKA0thMgHf2cPtuCMLUVMohhy3nNxH2NPoNAxnau5GyUwELdva-52_QfyZQCBDWg3YWwRSgWd3d-uK19gepOZR24mMNTBD_kd5A',
    '/src/assets/images/hero_sri_lanka_luxury_escape_1792932448818.jpg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuADEoVD0RY4y8v3FocVRlEOeFGj0sfPs0j10HlKgpN8hPDQgG1Cp0XPwtF0wzEcnBkssXMf5ap88gLC3O0W-nqzgrFptbAuI2zrkqWvWxM-lH5CIdPqQfQtOG2aV-0WoeqmLcgYEMK1Etb7zGjygx3SEat-6Em5mpWaetSQJvM2OSRURcqIv68AfCYJYdJD5uOcRd0t7xBe3HpTGKkFP-9Lbviq9NKimu3_Lf6D-3sPP53OMPrcRaOa'
  ],
  vip: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA1yaD1jKP08nNpCh0Z-kEE6F8xdx6Iz4PehiNqN3GSAk9EPjYeHPREOoPi_d-VAWu1TW4wJFgR2LwgqgQ4MiooOSIPZboIMnWB0kjvqSyepJKgf0iVEoG3fphEJxn_6YLOlJ-_GnK9GH2GUX9eQXGtcZtnaK-DDU76APMXU-wSh9chXaqlX-udUc_jNoAg-hprK5knXICwG6bPWxTXuIlc-5WhEDQz5i_7FlI-eMpFdIZWyzy4paav',
    '/src/assets/images/hero_sri_lanka_luxury_escape_1792932448818.jpg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDi40qXJRFZwB3abf_wUSEGP6InmvJLG7uxoxx6BAzzZ8M7pflu0FJTjgfBBRW535bzukTarLStCx-zUiTqWp9Bk4bjvYjsIVq3n8USikhoAbDa_nEoyo1S-dzSId1E5qkV-4rlE2bs7_nHUia4aui6D_VSa6pOTB9rmJtObDVsWQTQReXPNL2xb74D4te7aJsRnx7GpOmQhWggTLJpsnTgg8cNmINnr0mASYDGJvvI19Ch635JToq0'
  ],
  family: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDi40qXJRFZwB3abf_wUSEGP6InmvJLG7uxoxx6BAzzZ8M7pflu0FJTjgfBBRW535bzukTarLStCx-zUiTqWp9Bk4bjvYjsIVq3n8USikhoAbDa_nEoyo1S-dzSId1E5qkV-4rlE2bs7_nHUia4aui6D_VSa6pOTB9rmJtObDVsWQTQReXPNL2xb74D4te7aJsRnx7GpOmQhWggTLJpsnTgg8cNmINnr0mASYDGJvvI19Ch635JToq0',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCddDOk1PEzEryL44aq-FeAF1GwDH1Mdj447UT2KYeso9sIJJzRGP3CeUy48-et7qicLY352KRXGVvoPwcKyZriSwvqQ2ot3YKdMAdgvHnvcTwqG5m2bs33NkQjYfxculm5eOKsZKXQ1k0DVF46lcKA0thMgHf2cPtuCMLUVMohhy3nNxH2NPoNAxnau5GyUwELdva-52_QfyZQCBDWg3YWwRSgWd3d-uK19gepOZR24mMNTBD_kd5A',
    '/src/assets/images/hero_sri_lanka_luxury_escape_1792932448818.jpg'
  ],
  lagoon: [
    '/src/assets/images/sanctuary_river_glamping_retreat_1792932450705.jpg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCddDOk1PEzEryL44aq-FeAF1GwDH1Mdj447UT2KYeso9sIJJzRGP3CeUy48-et7qicLY352KRXGVvoPwcKyZriSwvqQ2ot3YKdMAdgvHnvcTwqG5m2bs33NkQjYfxculm5eOKsZKXQ1k0DVF46lcKA0thMgHf2cPtuCMLUVMohhy3nNxH2NPoNAxnau5GyUwELdva-52_QfyZQCBDWg3YWwRSgWd3d-uK19gepOZR24mMNTBD_kd5A',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuADEoVD0RY4y8v3FocVRlEOeFGj0sfPs0j10HlKgpN8hPDQgG1Cp0XPwtF0wzEcnBkssXMf5ap88gLC3O0W-nqzgrFptbAuI2zrkqWvWxM-lH5CIdPqQfQtOG2aV-0WoeqmLcgYEMK1Etb7zGjygx3SEat-6Em5mpWaetSQJvM2OSRURcqIv68AfCYJYdJD5uOcRd0t7xBe3HpTGKkFP-9Lbviq9NKimu3_Lf6D-3sPP53OMPrcRaOa'
  ],
  mountain: [
    '/src/assets/images/sanctuary_ella_mist_mountain_1792932449774.jpg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA1yaD1jKP08nNpCh0Z-kEE6F8xdx6Iz4PehiNqN3GSAk9EPjYeHPREOoPi_d-VAWu1TW4wJFgR2LwgqgQ4MiooOSIPZboIMnWB0kjvqSyepJKgf0iVEoG3fphEJxn_6YLOlJ-_GnK9GH2GUX9eQXGtcZtnaK-DDU76APMXU-wSh9chXaqlX-udUc_jNoAg-hprK5knXICwG6bPWxTXuIlc-5WhEDQz5i_7FlI-eMpFdIZWyzy4paav',
    '/src/assets/images/sanctuary_galle_fort_colonial_1792932449839.jpg'
  ]
};

/**
 * Returns 5 detailed private cabanas for any property, complete with tailored package details.
 */
export function getPropertyCabanas(property: SanctuaryProperty): CabanaUnit[] {
  if (property.subUnits && property.subUnits.length > 0) {
    return property.subUnits.map((c) => ({
      ...c,
      specifications: c.specifications || getCabanaSpecifications(c)
    }));
  }

  const propId = property.id;
  const isMountain =
    property.district.includes('Ella') ||
    property.district.includes('Kandy') ||
    property.district.includes('Nuwara');

  if (isMountain) {
    const mountainCabanas: CabanaUnit[] = [
      {
        id: `${propId}-cab-1`,
        code: 'CAB-01',
        name: 'The Eagle Ridge Panoramic Glass Cabana',
        type: 'vip',
        typeLabel: 'VIP Mist Ridge Cabana',
        tagline: 'Suspended above the clouds with 180° Ella Gap & waterfall vistas',
        capacity: 'Up to 4 Guests',
        maxAdults: 4,
        maxKids: 2,
        priceDeltaLkr: 2500,
        coverImage: '/src/assets/images/sanctuary_ella_mist_mountain_1792932449774.jpg',
        images: CABANA_IMAGE_SETS.mountain,
        features: [
          'Unobstructed mountain gap & morning mist sunrise view',
          'Heated outdoor timber jacuzzi pool',
          'Private Ceylon High Tea serving station',
          'Woolen fleece blankets & wood-burning fire pot',
          'High-speed Starlink WiFi & Bluetooth audio'
        ],
        viewType: '180° Ella Mountain Ridge & Gap',
        privacyLevel: 'Exclusive VIP',
        status: 'AVAILABLE',
        slotsRemaining: 2,
        description: 'Perched on the dramatic cliff edge facing the Ella Gap. Features floor-to-ceiling panoramic glass, a private heated jacuzzi, and artisan Ceylon high-tea served by your dedicated butler.',
        packageDetails: {
          tierName: 'Highland Ridge Panoramic VIP Day Pass',
          diningPlan: '12-Curry Authentic Highland Buffet + Warm Apple & Cinnamon Scones High Tea',
          welcomeRefreshment: 'Hot Spiced Ceylon Cardamom Tea or Fresh Strawberry Cooler',
          swimmingAccess: 'Private Cliffside Heated Timber Jacuzzi + Ridge Infinity Pool',
          towelPolicy: 'Complimentary warm fleece-lined robes and luxury bath towels',
          corkagePolicy: 'BYOB Corkage-Free + Hot water kettle & artisanal wine glasses provided',
          changingRoom: 'Private heated timber changing room with shower and organic toiletries',
          schedule: '09:30 AM – 05:30 PM (Full Day Mountain Pass)',
          exclusivePerks: [
            'Dedicated personal butler for high tea & food service',
            'Wood-burning outdoor fire pit with eucalyptus logs',
            'Complimentary Ella Rock guided trail map and walking poles',
            'Starlink high-speed internet & Bluetooth sound hub'
          ],
          packageTiers: [
            {
              id: 'mountain-classic',
              name: 'Classic Ridge Day Pass',
              priceDeltaLkr: 0,
              timing: '09:30 AM – 05:30 PM',
              diningPlan: 'Authentic 12-Curry Highland Buffet Lunch',
              highlights: ['Welcome spiced tea', 'Pool & Jacuzzi access', 'Towels included']
            },
            {
              id: 'mountain-hightea',
              name: 'Royal High Tea & BBQ Feast',
              priceDeltaLkr: 2500,
              timing: '09:30 AM – 06:00 PM',
              badge: 'Most Popular',
              diningPlan: 'Buffet Lunch + Artisanal Afternoon High Tea & Live BBQ skewers',
              highlights: ['Private Butler table service', 'Warm strawberry dessert platter', 'Priority heated jacuzzi']
            }
          ]
        }
      },
      {
        id: `${propId}-cab-2`,
        code: 'CAB-02',
        name: 'Heated Cliffside Pool-Edge Pavilion',
        type: 'poolside',
        typeLabel: 'Heated Pool Cabana',
        tagline: 'Zero distance to the heated cliffside infinity swimming pool',
        capacity: 'Up to 4 Guests',
        maxAdults: 4,
        maxKids: 2,
        priceDeltaLkr: 0,
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCddDOk1PEzEryL44aq-FeAF1GwDH1Mdj447UT2KYeso9sIJJzRGP3CeUy48-et7qicLY352KRXGVvoPwcKyZriSwvqQ2ot3YKdMAdgvHnvcTwqG5m2bs33NkQjYfxculm5eOKsZKXQ1k0DVF46lcKA0thMgHf2cPtuCMLUVMohhy3nNxH2NPoNAxnau5GyUwELdva-52_QfyZQCBDWg3YWwRSgWd3d-uK19gepOZR24mMNTBD_kd5A',
        images: CABANA_IMAGE_SETS.poolside,
        features: [
          'Immediate access to the 28°C temperature-controlled pool',
          'Two plush double daybeds with weather curtains',
          'Complimentary warm towel & robe service',
          'Hot spiced tea and spiced coffee bar'
        ],
        viewType: 'Heated Pool & Mountain Valley',
        privacyLevel: 'Standard',
        status: 'AVAILABLE',
        slotsRemaining: 3,
        description: 'Direct step-in access to the heated infinity pool. Enjoy swimming in warm waters while cold mountain mist swirls over the valley below.',
        packageDetails: {
          tierName: 'Heated Poolside Wellness Pass',
          diningPlan: 'Country Style Claypot Buffet Lunch with fresh garden salad bar',
          welcomeRefreshment: 'Fresh Ginger Lime infusion with Ceylon jaggery',
          swimmingAccess: 'Direct step into 28°C heated infinity pool with valley view',
          towelPolicy: 'Pre-warmed plush pool towels provided on deck',
          corkagePolicy: 'BYOB Permitted (Corkage Free) + Ice and glassware setup',
          changingRoom: 'Poolside locker suite with heated showers',
          schedule: '09:30 AM – 05:30 PM',
          exclusivePerks: [
            'Immediate pool step-in from daybed',
            'Unlimited hot tea station throughout the day',
            'Waterproof pool lounger cushions'
          ],
          packageTiers: [
            {
              id: 'pool-std',
              name: 'Standard Pool Pass',
              priceDeltaLkr: 0,
              timing: '09:30 AM – 05:30 PM',
              diningPlan: 'Full Buffet Lunch at dining deck',
              highlights: ['Welcome drink', 'Pool access', 'Towel service']
            }
          ]
        }
      },
      {
        id: `${propId}-cab-3`,
        code: 'CAB-03',
        name: 'Pine Forest Heritage Tea Cottage Cabana',
        type: 'family',
        typeLabel: 'Highland Family Cabana',
        tagline: 'Nestled under fragrant cypress pines with private dining deck',
        capacity: 'Up to 8 Guests',
        maxAdults: 8,
        maxKids: 4,
        priceDeltaLkr: 3000,
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDi40qXJRFZwB3abf_wUSEGP6InmvJLG7uxoxx6BAzzZ8M7pflu0FJTjgfBBRW535bzukTarLStCx-zUiTqWp9Bk4bjvYjsIVq3n8USikhoAbDa_nEoyo1S-dzSId1E5qkV-4rlE2bs7_nHUia4aui6D_VSa6pOTB9rmJtObDVsWQTQReXPNL2xb74D4te7aJsRnx7GpOmQhWggTLJpsnTgg8cNmINnr0mASYDGJvvI19Ch635JToq0',
        images: CABANA_IMAGE_SETS.family,
        features: [
          'Spacious covered cedar timber pavilion for 8 guests',
          'Private buffet and BBQ banquet table',
          'Stone fireplace with aromatic pine logs',
          'Board games & children tea garden walk'
        ],
        viewType: 'Pine Forest & Rolling Tea Hills',
        privacyLevel: 'High',
        status: 'AVAILABLE',
        slotsRemaining: 1,
        description: 'Ample space for large family day outs. Includes an open stone fireplace, private dining deck for your lunch buffet, and scenic tea trails.',
        packageDetails: {
          tierName: 'Highland Family Grand Feast Pass',
          diningPlan: 'Family Style Large Claypot Buffet with 16 authentic curries + BBQ grill',
          welcomeRefreshment: 'Fresh Nuwara Eliya Strawberry Juice Pitcher + King Coconuts',
          swimmingAccess: 'Full access to main heated infinity pool + children splash area',
          towelPolicy: '8x Large family towels + warm woolen wraps',
          corkagePolicy: 'BYOB Friendly with 2 large ice coolers and glassware for 10',
          changingRoom: 'Spacious family change suite with double showers and changing bench',
          schedule: '09:00 AM – 06:00 PM (Extended Hours for Families)',
          exclusivePerks: [
            'Private 8-seater dining table inside your cabana',
            'Stone fireplace with fragrant aromatic pine logs',
            'Kids tea garden walk and outdoor lawn games',
            'Lockable security cabinet for laptops and cameras'
          ]
        }
      },
      {
        id: `${propId}-cab-4`,
        code: 'CAB-04',
        name: 'Cloud Nine Overhang Hammock Pavilion',
        type: 'lagoon',
        typeLabel: 'Overhang Net Daybed',
        tagline: 'Suspended safety net hammock bed over the steep valley gorge',
        capacity: 'Up to 2-3 Guests',
        maxAdults: 3,
        maxKids: 0,
        priceDeltaLkr: 1500,
        coverImage: '/src/assets/images/sanctuary_river_glamping_retreat_1792932450705.jpg',
        images: CABANA_IMAGE_SETS.lagoon,
        features: [
          'Reinforced structural net hammock suspended over the valley',
          'Plush Bohemian pillows & silk blankets',
          'Binoculars for birdwatching & waterfall spotting',
          'Fresh Ceylon passion fruit juice carafe'
        ],
        viewType: 'Deep Gorge & Mountain Waterfalls',
        privacyLevel: 'High',
        status: 'FEW_LEFT',
        slotsRemaining: 1,
        description: 'Experience the exhilarating sensation of floating above the mountain canopy. Perfect for romantic couples, photographers, and tranquility seekers.',
        packageDetails: {
          tierName: 'Cloud Romance & Tranquility Pass',
          diningPlan: 'Gourmet Picnic Basket lunch served on net hammock or timber deck',
          welcomeRefreshment: 'Passion fruit carafe with mint and Ceylon bees honey',
          swimmingAccess: 'Heated pool access + scenic lookout deck',
          towelPolicy: 'Organic cotton towels & herbal face mist spray',
          corkagePolicy: 'Wine & Champagne corkage free with ice bucket & crystal flutes',
          changingRoom: 'Private garden change cubicle with rain shower',
          schedule: '10:00 AM – 06:00 PM',
          exclusivePerks: [
            'Overwater suspended hammock net with mountain vista',
            'HD binoculars for birdwatching and spotting trains on Nine Arch Bridge',
            'Tranquility quiet zone with ambient wind chimes'
          ]
        }
      },
      {
        id: `${propId}-cab-5`,
        code: 'CAB-05',
        name: 'Royal Planter Private Suite Cabana',
        type: 'vip',
        typeLabel: 'Private Executive Suite',
        tagline: 'Full colonial wood interior, private ensuite shower & dressing room',
        capacity: 'Up to 4 Guests',
        maxAdults: 4,
        maxKids: 2,
        priceDeltaLkr: 4500,
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1yaD1jKP08nNpCh0Z-kEE6F8xdx6Iz4PehiNqN3GSAk9EPjYeHPREOoPi_d-VAWu1TW4wJFgR2LwgqgQ4MiooOSIPZboIMnWB0kjvqSyepJKgf0iVEoG3fphEJxn_6YLOlJ-_GnK9GH2GUX9eQXGtcZtnaK-DDU76APMXU-wSh9chXaqlX-udUc_jNoAg-hprK5knXICwG6bPWxTXuIlc-5WhEDQz5i_7FlI-eMpFdIZWyzy4paav',
        images: CABANA_IMAGE_SETS.vip,
        features: [
          'Enclosed air-conditioned living suite + outdoor private veranda',
          'Private rain shower & changing suite with luxury herbal toiletries',
          'Mini wine chiller & Ceylon tea collection',
          'Full dedicated butler for the day'
        ],
        viewType: 'Private Garden & Ella Rock Panorama',
        privacyLevel: 'Exclusive VIP',
        status: 'AVAILABLE',
        slotsRemaining: 1,
        description: 'Combines the freedom of a daytime resort pass with the complete privacy and comfort of an executive colonial hotel suite.',
        packageDetails: {
          tierName: 'Executive Planter Suite Daytime Sanctuary',
          diningPlan: 'Private 4-Course Fine Dining Lunch served on your private colonial veranda',
          welcomeRefreshment: 'Fresh Soursop juice + King Coconut cocktail',
          swimmingAccess: 'Direct private gate to heated infinity pool & sun deck',
          towelPolicy: 'Premium Egyptian cotton bath sheets, robes, and slippers',
          corkagePolicy: 'Full Bar setup, mini fridge, and ice chiller with zero corkage',
          changingRoom: 'Enclosed ensuite AC bedroom and private granite bathroom',
          schedule: '09:00 AM – 06:00 PM',
          exclusivePerks: [
            'Private air-conditioned bedroom suite for daytime resting',
            'Dedicated personal butler at your service',
            'Full espresso machine and artisan Ceylon tea tray'
          ]
        }
      }
    ];
    return mountainCabanas.map((c) => ({
      ...c,
      specifications: c.specifications || getCabanaSpecifications(c)
    }));
  }

  // Coastal / Beach / Lake Cabana properties (Bentota, Colombo, Galle, Mirissa)
  const rawCabanas: CabanaUnit[] = [
    {
      id: `${propId}-cab-1`,
      code: 'CAB-01',
      name: 'The Geoffrey Bawa Oceanfront Grand Pavilion',
      type: 'oceanfront',
      typeLabel: 'VIP Beachfront Cabana',
      tagline: 'Front-row Indian Ocean view with teak daybed & flowing linen curtains',
      capacity: 'Up to 6 Guests',
      maxAdults: 6,
      maxKids: 3,
      priceDeltaLkr: 2500,
      coverImage: '/src/assets/images/hero_sri_lanka_luxury_escape_1792932448818.jpg',
      images: CABANA_IMAGE_SETS.oceanfront,
      features: [
        'First-row unobstructed Indian Ocean beach panorama',
        'Hand-carved teak king daybed with weather linen drapes',
        'Dedicated King Coconut ice cooler & butler call bell',
        'Direct private wooden walkway onto the golden beach sand',
        'Bluetooth waterproof sound system & USB charging hub'
      ],
      viewType: 'Direct Indian Ocean Surf',
      privacyLevel: 'Exclusive VIP',
      status: 'AVAILABLE',
      slotsRemaining: 2,
      description: 'Our premier oceanfront cabana. Situated just steps from the lapping waves with cooling sea breezes, soft muslin curtains for privacy, and personalized beverage service.',
      packageDetails: {
        tierName: 'VIP Beachfront Platinum Package',
        diningPlan: 'Grand Seafood Buffet Lunch with private table service directly in your cabana',
        welcomeRefreshment: 'Chilled King Coconut served with mint & fresh lime + tropical fruit skewers',
        swimmingAccess: 'Direct private walkway to the golden sand beach + 30m Infinity Pool access',
        towelPolicy: '3x Luxury Egyptian cotton pool towels per guest + sunbed covers',
        corkagePolicy: '100% Free BYOB Corkage + Chilled ice cooler bucket & crystal glassware',
        changingRoom: 'Dedicated air-conditioned changing suite with rain shower & luxury toiletries',
        schedule: '09:30 AM – 05:30 PM (Full Day Beachfront Pass)',
        exclusivePerks: [
          'Personal butler on call via private buzzer',
          'Direct beachfront sun loungers with umbrella setup',
          'Waterproof Bluetooth speaker system for personal playlists',
          'Sunscreen, aloe vera cooling mist & sun hat kit provided'
        ],
        packageTiers: [
          {
            id: 'bawa-std',
            name: 'Standard Beachfront Pass',
            priceDeltaLkr: 0,
            timing: '09:30 AM – 05:30 PM',
            diningPlan: 'Full Seafood Buffet at the main ocean restaurant',
            highlights: ['Welcome King Coconut', 'Pool & Beach access', 'Towels provided']
          },
          {
            id: 'bawa-vip',
            name: 'All-Inclusive VIP Cabana Feast',
            priceDeltaLkr: 3000,
            timing: '09:00 AM – 06:00 PM',
            badge: 'Most Popular',
            diningPlan: 'Seafood Buffet + Live Jumbo Prawn & Calamari Grill served in cabana',
            highlights: ['Private Butler table service', 'Unlimited fresh coconut water', '30-min Sea Jet-Ski discount voucher']
          },
          {
            id: 'bawa-sunset',
            name: 'Sunset Twilight & Cocktail Pass',
            priceDeltaLkr: 2000,
            timing: '01:30 PM – 07:30 PM',
            badge: 'Twilight Deal',
            diningPlan: 'Ceylon High Tea + Seafood Tapas & Sunset Mocktail Pitcher',
            highlights: ['Golden hour sunset view', 'Night illuminated pool swim', 'Chill lounge music']
          }
        ]
      }
    },
    {
      id: `${propId}-cab-2`,
      code: 'CAB-02',
      name: 'Azure Infinity Pool-Step Pavilion',
      type: 'poolside',
      typeLabel: 'Poolside Daybed',
      tagline: 'Zero distance to the main infinity pool with shallow submerged sunbeds',
      capacity: 'Up to 4 Guests',
      maxAdults: 4,
      maxKids: 2,
      priceDeltaLkr: 0,
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCddDOk1PEzEryL44aq-FeAF1GwDH1Mdj447UT2KYeso9sIJJzRGP3CeUy48-et7qicLY352KRXGVvoPwcKyZriSwvqQ2ot3YKdMAdgvHnvcTwqG5m2bs33NkQjYfxculm5eOKsZKXQ1k0DVF46lcKA0thMgHf2cPtuCMLUVMohhy3nNxH2NPoNAxnau5GyUwELdva-52_QfyZQCBDWg3YWwRSgWd3d-uK19gepOZR24mMNTBD_kd5A',
      images: CABANA_IMAGE_SETS.poolside,
      features: [
        'Immediate step into the 30m crystal infinity pool',
        'Two cushioned sun loungers + shaded woven canopy',
        'Complimentary chilled face towels & ice bucket',
        'Direct cocktail service from the poolside sunken bar'
      ],
      viewType: 'Infinity Pool & Ocean Horizon',
      privacyLevel: 'Standard',
      status: 'AVAILABLE',
      slotsRemaining: 4,
      description: 'The favorite spot for swimmers and sun seekers. Plunge into the pool directly from your sun terrace, or relax with a cocktail on the submerged wet-deck loungers.',
      packageDetails: {
        tierName: 'Poolside Splash & Relax Package',
        diningPlan: 'Grand Seafood & Sri Lankan Curry Buffet at the poolside terrace',
        welcomeRefreshment: 'Fresh Pineapple Mint Cooler or Chilled King Coconut',
        swimmingAccess: 'Zero distance step into 30m infinity swimming pool with shallow wet deck',
        towelPolicy: 'Complimentary fresh pool towels with free refresh upon request',
        corkagePolicy: 'BYOB Permitted (Corkage Free) + Ice bucket provided',
        changingRoom: 'Poolside fresh shower cabins with hair dryers & locker storage',
        schedule: '09:30 AM – 05:30 PM',
        exclusivePerks: [
          'Immediate water step-down right from your daybed',
          'Access to floating sun loungers & water pool noodles',
          'Direct order button to poolside cocktail bar'
        ],
        packageTiers: [
          {
            id: 'pool-classic',
            name: 'Classic Pool Pass',
            priceDeltaLkr: 0,
            timing: '09:30 AM – 05:30 PM',
            diningPlan: 'Seafood Buffet Lunch at poolside pavilion',
            highlights: ['Welcome drink', 'Infinity pool access', 'Towel service']
          },
          {
            id: 'pool-bbq-upgrade',
            name: 'Pool & Live BBQ Feast',
            priceDeltaLkr: 2200,
            timing: '09:30 AM – 05:30 PM',
            badge: 'Top Value',
            diningPlan: 'Buffet + Live BBQ Chicken & Seafood Skewers served to your lounger',
            highlights: ['Floating food tray option', 'Ice cold mocktail pitcher', 'Submerged pool daybed guarantee']
          }
        ]
      }
    },
    {
      id: `${propId}-cab-3`,
      code: 'CAB-03',
      name: 'Royal Coconut Lawn Family Pavilion',
      type: 'family',
      typeLabel: 'Family Group Cabana',
      tagline: 'Extra-large shaded timber pavilion nestled under swaying coconut palms',
      capacity: 'Up to 8-10 Guests',
      maxAdults: 8,
      maxKids: 4,
      priceDeltaLkr: 3500,
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDi40qXJRFZwB3abf_wUSEGP6InmvJLG7uxoxx6BAzzZ8M7pflu0FJTjgfBBRW535bzukTarLStCx-zUiTqWp9Bk4bjvYjsIVq3n8USikhoAbDa_nEoyo1S-dzSId1E5qkV-4rlE2bs7_nHUia4aui6D_VSa6pOTB9rmJtObDVsWQTQReXPNL2xb74D4te7aJsRnx7GpOmQhWggTLJpsnTgg8cNmINnr0mASYDGJvvI19Ch635JToq0',
      images: CABANA_IMAGE_SETS.family,
      features: [
        'Accommodates 8 to 10 guests in full shaded comfort',
        'Solid teak 8-seater dining table for buffet feast plates',
        'Dual double daybeds + 4 adjustable recliner chairs',
        'Adjacent to shallow kids splash pool zone',
        'Private security locker for phones and valuables'
      ],
      viewType: 'Lush Lawn & Pool Edge',
      privacyLevel: 'High',
      status: 'AVAILABLE',
      slotsRemaining: 1,
      description: 'Designed specifically for extended families, office friend groups, or birthday day-outs. Ample seating, private lunch dining table, and natural shade under coconut trees.',
      packageDetails: {
        tierName: 'Grand Family & Group Celebration Package',
        diningPlan: 'Extensive 20-Dish Seafood & Curry Buffet with private dedicated 8-seater dining table',
        welcomeRefreshment: 'Fresh King Coconut Pitcher + Tropical Fruit Smoothies for Kids',
        swimmingAccess: 'Full access to 30m adult infinity pool + adjacent shallow kids splash pool',
        towelPolicy: '8 to 10 Large family beach towels with dedicated basket',
        corkagePolicy: '100% Free BYOB Corkage + 2 Large cooler chests with unlimited ice',
        changingRoom: 'Spacious family change suite with double showers and secure lockers',
        schedule: '09:00 AM – 06:00 PM (Extended Hours for Families)',
        exclusivePerks: [
          'Solid teak private dining table inside your cabana for your group',
          'Kids outdoor lawn games (croquet, badminton, frisbee)',
          'Large electronic security safe for phones, cameras & jewelry',
          'Dedicated family steward to assist with drinks and plates'
        ]
      }
    },
    {
      id: `${propId}-cab-4`,
      code: 'CAB-04',
      name: 'Sunset Whispers VIP Jacuzzi Suite Cabana',
      type: 'vip',
      typeLabel: 'Private Jacuzzi Cabana',
      tagline: 'Private warm jet jacuzzi, chilled champagne ice bucket & bamboo seclusion',
      capacity: 'Up to 4 Guests',
      maxAdults: 4,
      maxKids: 1,
      priceDeltaLkr: 5000,
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1yaD1jKP08nNpCh0Z-kEE6F8xdx6Iz4PehiNqN3GSAk9EPjYeHPREOoPi_d-VAWu1TW4wJFgR2LwgqgQ4MiooOSIPZboIMnWB0kjvqSyepJKgf0iVEoG3fphEJxn_6YLOlJ-_GnK9GH2GUX9eQXGtcZtnaK-DDU76APMXU-wSh9chXaqlX-udUc_jNoAg-hprK5knXICwG6bPWxTXuIlc-5WhEDQz5i_7FlI-eMpFdIZWyzy4paav',
      images: CABANA_IMAGE_SETS.vip,
      features: [
        'Private hydrotherapy jacuzzi tub with relaxing warm jets',
        'Enclosed living bower with natural bamboo screening',
        'Dedicated butler servicing fresh tropical skewers & drinks',
        'Mini chiller bar for BYOB wine & beers',
        'High-velocity cooling mist fan'
      ],
      viewType: 'Sunset Ocean & Private Garden Bower',
      privacyLevel: 'Exclusive VIP',
      status: 'FEW_LEFT',
      slotsRemaining: 1,
      description: 'The ultimate VIP sanctuary experience. Soak in your own private bubbling jacuzzi with chilled beverages and unobtrusive personal butler hospitality.',
      packageDetails: {
        tierName: 'Royal Hydro Jacuzzi & Champagne Pass',
        diningPlan: 'Chef Gourmet 4-Course Seafood Feast or Grand Buffet served in private jacuzzi bower',
        welcomeRefreshment: 'Chilled Sparkling White Grape flute + Fresh Strawberries & dark chocolate dip',
        swimmingAccess: 'Private Heated Hydro Jacuzzi (unlimited exclusive use) + Main Infinity Pool',
        towelPolicy: 'Premium waffle spa robes, slippers, and oversized bath sheets',
        corkagePolicy: 'Full VIP Wine Bar setup, ice chiller bucket & cocktail glassware (Zero Corkage)',
        changingRoom: 'Enclosed private changing suite with private rain shower & herbal toiletries',
        schedule: '10:00 AM – 06:30 PM',
        exclusivePerks: [
          'Private warm-water hydrotherapy jacuzzi with massage jets',
          'Complete natural bamboo privacy screen enclosure',
          'Personal dedicated butler on call',
          'Cooling water mist fan & lemongrass aromatic ambience'
        ],
        packageTiers: [
          {
            id: 'jacuzzi-std',
            name: 'Jacuzzi Day Pass',
            priceDeltaLkr: 0,
            timing: '10:00 AM – 06:30 PM',
            diningPlan: 'Grand Seafood Buffet with private table service',
            highlights: ['Private Jacuzzi usage', 'Robes & towels', 'Butler service']
          },
          {
            id: 'jacuzzi-deluxe',
            name: 'Royal Romance & Seafood Grill',
            priceDeltaLkr: 3500,
            timing: '10:00 AM – 07:00 PM',
            badge: 'VIP Ultimate',
            diningPlan: 'Grilled Jumbo Lobster & Prawn Feast served directly in the bower',
            highlights: ['Sunset cocktail pitcher', 'Rose petal jacuzzi bath setup', 'Extended evening stay']
          }
        ]
      }
    },
    {
      id: `${propId}-cab-5`,
      code: 'CAB-05',
      name: 'Mangrove Lagoon Overwater Daybed',
      type: 'lagoon',
      typeLabel: 'Overwater Net Cabana',
      tagline: 'Built cantilevered over tranquil waters with catamaran rope hammock',
      capacity: 'Up to 3 Guests',
      maxAdults: 3,
      maxKids: 0,
      priceDeltaLkr: 1500,
      coverImage: '/src/assets/images/sanctuary_river_glamping_retreat_1792932450705.jpg',
      images: CABANA_IMAGE_SETS.lagoon,
      features: [
        'Overwater suspended hammock net hovering above the water',
        'Soothing water reflections & breeze through mangrove palms',
        'Free usage of 2-person ocean kayak for 1 hour',
        'Complimentary lemongrass iced tea & roasted cashew snacks'
      ],
      viewType: 'Lagoon Waters & Mangrove Sanctuary',
      privacyLevel: 'High',
      status: 'AVAILABLE',
      slotsRemaining: 2,
      description: 'Suspended directly over calm lagoon waters. Lie back on the overwater rope mesh while tropical fish swim below, with absolute peace and birdsong.',
      packageDetails: {
        tierName: 'Lagoon Wellness & Watersport Day Pass',
        diningPlan: 'Organic Seafood & Coconut Claypot Feast + Afternoon Ceylon Tea & Warm Roti',
        welcomeRefreshment: 'Organic Iced Lemongrass & Ginger Tea with wild honey',
        swimmingAccess: 'Overwater hammock lounge + Free 1h Kayak Rental + Main Pool access',
        towelPolicy: 'Eco-friendly bamboo cotton beach towels provided',
        corkagePolicy: 'BYOB Permitted (Corkage Free) + Wooden ice chiller bucket',
        changingRoom: 'Garden eco-shower and dressing cubicle',
        schedule: '09:30 AM – 05:30 PM',
        exclusivePerks: [
          'Overwater suspended net hammock hovering above the lagoon',
          'Free 1-hour double ocean kayak rental with life vests included',
          'Acoustic tranquility silence zone (birds and water breeze only)',
          'Binoculars for observing water monitors, kingfishers and herons'
        ]
      }
    }
  ];

  return rawCabanas.map((c) => ({
    ...c,
    specifications: c.specifications || getCabanaSpecifications(c)
  }));
}

export function getCabanaSpecifications(cabana: Partial<CabanaUnit>): CabanaSpecifications {
  const type = cabana.type || 'oceanfront';

  if (type === 'vip') {
    return {
      floorAreaSqFt: 580,
      deckAreaSqFt: 320,
      bedLayout: 'Super-King Plush Daybed (220x220cm) + Heated Hydrotherapy Jacuzzi',
      furniture: 'Handcrafted Kumbuk timber 6-seat dining table, upholstered lounge chairs, private granite bar',
      climateControl: 'Whisper-quiet Daikin AC (enclosed lounge) + outdoor patio ceiling fan',
      powerAudio: '4x Universal 230V sockets, Qi wireless phone pads, Bose 360° waterproof sound system',
      bathroomChanging: 'Luxury en-suite granite dressing room, double vanity, hot rainwater shower & bathrobes',
      shadeRating: 'Solid hardwood insulated roof with 100% weather & UV seal',
      distanceToPool: '15 meters via private tropical garden gate',
      distanceToBeach: '18 meters direct private beach walkway',
      orientation: 'Direct West (Unobstructed Sunset Panorama & Ocean Horizon)',
      accessibility: 'Step-free level ground entrance with private keycard lock'
    };
  }

  if (type === 'poolside') {
    return {
      floorAreaSqFt: 360,
      deckAreaSqFt: 180,
      bedLayout: 'Dual Cushioned Ergonomic Daybeds + In-Pool Submerged Wet Deck Loungers',
      furniture: 'Floating sunbed cocktail tray, twin rattan reclining loungers, towel storage chest',
      climateControl: 'Natural water-surface evaporative cooling + high-velocity misting fan',
      powerAudio: 'Dual weatherproof USB-A/C fast charging ports & poolside acoustic zone',
      bathroomChanging: 'Poolside private changing cabin, pressurized freshwater rain shower & locker',
      shadeRating: 'Motorized retractable canvas awning + Natural swaying palm fronds',
      distanceToPool: '0 meters (Zero-distance water plunge step into 30m infinity pool)',
      distanceToBeach: '35 meters across manicured Bermuda lawn',
      orientation: 'North-West (Full Afternoon Sunlight & Sparkling Water Reflections)',
      accessibility: '100% Barrier-free zero step flat pool deck access'
    };
  }

  if (type === 'family') {
    return {
      floorAreaSqFt: 540,
      deckAreaSqFt: 280,
      bedLayout: 'Two King Teak Daybeds + Kids Rattan Day-Nest with organic cotton bolsters',
      furniture: 'Large 8-seater family feast dining table, dual rocking hammock swings, games chest',
      climateControl: 'Dual heavy-duty whisper ceiling fans + cooling cross-lawn breezes',
      powerAudio: 'Central multi-device fast charging hub (6 slots), volume-regulated sound system',
      bathroomChanging: 'Family changing suite with twin rain showers, baby changing station & vanity',
      shadeRating: '100% All-day shade under 40-year mature coconut grove canopy',
      distanceToPool: '12 meters to kids shallow splash pool & main pool',
      distanceToBeach: '22 meters to calm family beach lagoon',
      orientation: 'Garden & Ocean Breeze Corridor',
      accessibility: '100% Flat grass access, suitable for strollers, wagons & elderly guests'
    };
  }

  if (type === 'lagoon') {
    return {
      floorAreaSqFt: 390,
      deckAreaSqFt: 210,
      bedLayout: 'Overwater Catamaran Structural Net Bed (1200kg test) + Shaded Daybed',
      furniture: 'Water-view teak bistro table, twin Bohemian beanbag loungers, timber kayak boarding pier',
      climateControl: 'Gentle lagoon cross-drafts + high-volume silent solar fan',
      powerAudio: 'Solar-backed 230V socket + dual USB ports, ambient nature tranquility zone',
      bathroomChanging: 'Private eco-timber changing cubicle with open-sky garden shower',
      shadeRating: 'Dappled tropical mangrove shade + wide cantilever UV umbrella',
      distanceToPool: '30 meters across scenic wooden boardwalk',
      distanceToBeach: '40 meters to beach lagoon mouth',
      orientation: 'Tranquil South-East (Gentle morning glow & peaceful water reflections)',
      accessibility: 'Wide boardwalk with safety guide rails leading onto overwater platform'
    };
  }

  // Default oceanfront
  return {
    floorAreaSqFt: 420,
    deckAreaSqFt: 220,
    bedLayout: 'Hand-Carved King Teak Daybed (200x200cm) + Twin Beachfront Sun Loungers',
    furniture: 'Kumbuk timber dining table for 6, woven rattan bar stools, King Coconut ice cooler station',
    climateControl: 'Whisper-quiet high-capacity ceiling fan + natural Indian Ocean sea-breeze circulation',
    powerAudio: 'Dual universal 230V sockets, USB-C 65W charging ports, waterproof Bluetooth sound system',
    bathroomChanging: 'Dedicated air-conditioned changing suite, outdoor rain shower with copper fittings, safe',
    shadeRating: '100% UV Protection woven coconut thatch ceiling with flowing muslin privacy curtains',
    distanceToPool: '20 meters via frangipani garden path',
    distanceToBeach: '8 meters direct step down onto golden sand beach',
    orientation: 'Direct West-Facing (Unobstructed Indian Ocean Sunset & Wave Crests)',
    accessibility: 'Single low step onto teak deck; portable access ramp available'
  };
}
